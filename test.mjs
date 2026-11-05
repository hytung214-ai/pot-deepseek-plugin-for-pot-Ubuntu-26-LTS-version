import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source = readFileSync(new URL('./main.js', import.meta.url), 'utf8');
const translate = vm.runInNewContext(source + '\ntranslate', {});
const key = 'test-key-not-a-real-secret';
const calls = [];
const ok = (content = '你好，世界', finish_reason = 'stop') => ({
    ok: true, status: 200, data: { choices: [{ message: { content, reasoning_content: 'do not show reasoning' }, finish_reason }] },
});
const invoke = (config = {}, response = ok(), text = 'Hello world', from = 'auto', to = 'zh') => translate(text, from, to, {
    config: { apiKey: key, ...config },
    utils: { tauriFetch: async (url, request) => { calls.push({ url, request }); return response; } },
});
let passed = 0;
async function test(name, fn) {
    await fn(); passed++; console.log('PASS', name);
}
await test('default model, native Tauri request and non-streaming format', async () => {
    assert.equal(await invoke(), '你好，世界');
    const { url, request } = calls.at(-1);
    assert.equal(url, 'https://api.deepseek.com/chat/completions');
    assert.equal(request.method, 'POST');
    assert.equal(request.headers.Authorization, `Bearer ${key}`);
    assert.equal(request.body.type, 'Json');
    assert.equal(request.body.payload.model, 'deepseek-flash');
    assert.equal(request.body.payload.thinking.type, 'disabled');
    assert.equal(request.body.payload.stream, false);
    assert.match(request.body.payload.messages[0].content, /简体中文/);
    assert.equal(request.body.payload.messages[1].content, 'Hello world');
});
await test('legacy chat settings remain usable', async () => {
    await invoke({ model: 'deepseek-chat' });
    assert.equal(calls.at(-1).request.body.payload.model, 'deepseek-flash');
    assert.equal(calls.at(-1).request.body.payload.thinking.type, 'disabled');
});
await test('legacy reasoner uses thinking with sufficient output budget', async () => {
    await invoke({ model: 'deepseek-reasoner' });
    const payload = calls.at(-1).request.body.payload;
    assert.equal(payload.model, 'deepseek-flash');
    assert.equal(payload.thinking.type, 'enabled');
    assert.equal(payload.max_tokens, 8192);
});
await test('current Pro selection is respected', async () => {
    await invoke({ model: 'deepseek-v4-pro' });
    assert.equal(calls.at(-1).request.body.payload.model, 'deepseek-v4-pro');
});
await test('empty model and padded key are normalized', async () => {
    await invoke({ model: '  ', apiKey: `  ${key}\n` });
    assert.equal(calls.at(-1).request.headers.Authorization, `Bearer ${key}`);
});
await test('traditional Chinese and explicit source language', async () => {
    await invoke({}, ok(), 'Hello', 'en', 'zh_HANT');
    assert.match(calls.at(-1).request.body.payload.messages[0].content, /from English into 繁體中文/);
});
await test('quoted translations preserve meaningful quotation marks', async () => {
    assert.equal(await invoke({}, ok('  "你好"  ')), '"你好"');
});
await test('missing key is rejected before network access', async () => {
    const before = calls.length;
    await assert.rejects(invoke({ apiKey: ' ' }), /填写 API 密钥/);
    assert.equal(calls.length, before);
});
await test('empty input returns without a request or key', async () => {
    const before = calls.length;
    assert.equal(await translate(' \n', 'auto', 'en', {}), '');
    assert.equal(calls.length, before);
});
await test('invalid model and auto target are rejected', async () => {
    await assert.rejects(invoke({ model: 'constructor' }), /模型配置/);
    await assert.rejects(invoke({}, ok(), 'Hello', 'en', 'auto'), /目标语言/);
});
await test('missing Pot HTTP interface is diagnosed', async () => {
    await assert.rejects(translate('Hello', 'en', 'zh', { config: { apiKey: key } }), /tauriFetch/);
});
for (const status of [400, 401, 402, 422, 429, 500, 503]) {
    await test(`HTTP ${status} has a useful message without leaking a key`, async () => {
        await assert.rejects(invoke({}, { ok: false, status, data: { error: { message: `server echoed ${key}` } } }), error => {
            assert.match(error.message, new RegExp(`HTTP ${status}`));
            assert.ok(!error.message.includes(key));
            return true;
        });
    });
}
await test('non-JSON error body retains HTTP status', async () => {
    await assert.rejects(invoke({}, { ok: false, status: 502, data: '<html>upstream failure</html>' }), /HTTP 502/);
});
await test('string JSON response is supported', async () => {
    const response = ok(); response.data = JSON.stringify(response.data);
    assert.equal(await invoke({}, response), '你好，世界');
});
await test('missing response and malformed success response are rejected', async () => {
    await assert.rejects(invoke({}, null), /无效的 HTTP/);
    await assert.rejects(invoke({}, { ok: true, status: 200, data: 'not json' }), /有效译文/);
    await assert.rejects(invoke({}, { ok: true, status: 200, data: { choices: [] } }), /有效译文/);
});
await test('reasoning-only and truncated outputs are not returned as translations', async () => {
    await assert.rejects(invoke({}, ok('')), /有效译文/);
    await assert.rejects(invoke({}, ok('partial', 'length')), /长度限制/);
});
await test('network errors are redacted and are not retried', async () => {
    let count = 0;
    await assert.rejects(translate('Hello', 'en', 'zh', { config: { apiKey: key }, utils: { tauriFetch: async () => {
        count++; throw new Error(`connection failure ${key}`);
    } } }), error => !error.message.includes(key) && error.message.includes('请求失败'));
    assert.equal(count, 1);
});
const info = JSON.parse(readFileSync(new URL('./info.json', import.meta.url), 'utf8'));
await test('plugin metadata preserves ID and configuration keys', async () => {
    assert.equal(info.id, 'plugin.com.pot-app.deepseek');
    assert.equal(info.plugin_type, 'translate');
    assert.equal(Object.keys(info.needs[0].options)[0], 'deepseek-flash');
    assert.equal(info.needs[1].key, 'apiKey');
    assert.equal(info.language.zh_tw, 'zh_HANT');
});
console.log(`\n${passed} contract checks passed. Responses are fixtures; no live translation claimed.`);

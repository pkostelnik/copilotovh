// Run against a deployed SWA URL; a plain file server cannot verify these rules.
const assert = require('node:assert/strict');

async function verifyDeployment(base) {
  const origin = new URL(base).origin;
  assert.equal(new URL(origin).protocol, 'https:', 'Use the HTTPS deployment URL');
  const routes = [
    ['/', 200], ['/index_en.html', 200], ['/disclaimer.html', 200],
    ['/pk.html', 410], ['/pk', 410], ['/pk/', 410],
    ['/remotion/deployment-check', 404], ['/deployment-check/missing-page', 404],
    ['/staticwebapp.config.json', 404], ['/README.md', 404], ['/AGENTS.md', 404],
    ['/CLAUDE.md', 404], ['/GEMINI.md', 404], ['/design.md', 404],
    ['/copilot-instructions.md', 404], ['/.github/copilot-instructions.md', 404]
  ];
  for (const [route, status] of routes) {
    const response = await fetch(origin + route, { signal: AbortSignal.timeout(20000) });
    assert.equal(response.status, status, `${route}: HTTP status`);
    const csp = response.headers.get('content-security-policy') || '';
    for (const directive of ["script-src 'self'", "style-src 'self'", "frame-ancestors 'none'", "base-uri 'none'", "form-action 'none'"]) {
      assert.ok(csp.split(';').map(s => s.trim()).includes(directive), `${route}: missing CSP ${directive}`);
    }
    assert.ok(!/unsafe-inline|unsafe-eval/.test(csp), `${route}: unsafe CSP`);
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(response.headers.get('x-frame-options'), 'DENY');
    assert.equal(response.headers.get('strict-transport-security'), 'max-age=63072000; includeSubDomains; preload');
    assert.equal(response.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
    assert.equal(response.headers.get('cross-origin-opener-policy'), 'same-origin');
    assert.equal(response.headers.get('cross-origin-resource-policy'), 'same-origin');
    assert.match(response.headers.get('permissions-policy') || '', /camera=\(\)/);
    if (route === '/deployment-check/missing-page') {
      const body = await response.text();
      assert.match(body, /src="\/init\.js"/);
      assert.match(body, /href="\/styles\.css"/);
    } else {
      await response.arrayBuffer();
    }
    console.log(`Verified ${status} ${route}`);
  }
  for (const asset of ['/init.js', '/styles.css']) {
    const response = await fetch(origin + asset, { signal: AbortSignal.timeout(20000) });
    assert.equal(response.status, 200, `${asset}: required error-page asset`);
    assert.match(response.headers.get('content-type') || '', asset.endsWith('.js') ? /javascript/ : /text\/css/);
    assert.equal(response.headers.get('cache-control'), 'public, max-age=86400, must-revalidate');
    await response.arrayBuffer();
  }
}

module.exports = { verifyDeployment };
if (require.main === module) verifyDeployment(process.argv[2]).catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});

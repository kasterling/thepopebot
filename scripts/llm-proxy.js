#!/usr/bin/env node
/**
 * LLM Proxy with automatic Gemini fallback
 * Primary:  GitHub Models (gpt-4o-mini) — 150 req/day free
 * Fallback: Google Gemini (gemini-2.0-flash) — 1,500 req/day free
 *
 * Listens on localhost:11435 — OpenAI-compatible /chat/completions endpoint.
 * Set OPENAI_BASE_URL=http://localhost:11435 in .env to route through here.
 */

const http = require('http');
const https = require('https');

const PORT = 11435;

const GITHUB = {
  host: 'models.inference.ai.azure.com',
  path: '/chat/completions',
  key: process.env.CUSTOM_API_KEY,
};

const GEMINI = {
  host: 'generativelanguage.googleapis.com',
  path: '/v1beta/openai/chat/completions',
  key: process.env.GOOGLE_API_KEY,
  model: 'gemini-2.0-flash',
};

function callProvider(provider, body) {
  return new Promise((resolve, reject) => {
    const cfg = provider === 'gemini' ? GEMINI : GITHUB;
    // Remap model to Gemini's when falling back
    const payload = JSON.stringify(
      provider === 'gemini' ? { ...body, model: GEMINI.model } : body
    );

    const req = https.request(
      {
        host: cfg.host,
        path: cfg.path,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cfg.key}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
        rejectUnauthorized: false, // GitHub Models uses Microsoft cert chain
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve({ status: res.statusCode, body: data }));
      }
    );

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(405);
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  let raw = '';
  req.on('data', (chunk) => (raw += chunk));
  req.on('end', async () => {
    try {
      const body = JSON.parse(raw);

      // Try GitHub Models first
      let result = await callProvider('github', body);

      // On rate limit, fall back to Gemini
      if (result.status === 429) {
        console.log('[llm-proxy] GitHub Models rate limited → Gemini fallback');
        result = await callProvider('gemini', body);
      }

      res.writeHead(result.status, { 'Content-Type': 'application/json' });
      res.end(result.body);
    } catch (err) {
      console.error('[llm-proxy] Error:', err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: { message: err.message, type: 'proxy_error' } }));
    }
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[llm-proxy] :${PORT} | Primary: GitHub Models (${GITHUB.key ? 'key set' : 'NO KEY'}) | Fallback: Gemini (${GEMINI.key ? 'key set' : 'NO KEY'})`);
});

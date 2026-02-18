// Simple Groq API Proxy Server
// Run with: node groq-proxy.js
// This proxies requests from the browser to Groq API, bypassing CORS issues

const http = require('http');
const https = require('https');
const url = require('url');

const PORT = process.env.PORT || 3001;

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Content-Type', 'application/json');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method !== 'POST') {
        res.writeHead(405);
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            const apiKey = data.apiKey;
            delete data.apiKey; // Remove API key from request body

            if (!apiKey) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'API key required' }));
                return;
            }

            // Forward to Groq API
            const options = {
                hostname: 'api.groq.com',
                path: '/openai/v1/chat/completions',
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(JSON.stringify(data))
                }
            };

            const proxyReq = https.request(options, (proxyRes) => {
                let responseBody = '';

                proxyRes.on('data', chunk => {
                    responseBody += chunk;
                });

                proxyRes.on('end', () => {
                    res.writeHead(proxyRes.statusCode, proxyRes.headers);
                    res.end(responseBody);
                });
            });

            proxyReq.on('error', (error) => {
                console.error('Proxy error:', error);
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Proxy error: ' + error.message }));
            });

            proxyReq.write(JSON.stringify(data));
            proxyReq.end();

        } catch (error) {
            console.error('Parse error:', error);
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
    });
});

server.listen(PORT, () => {
    console.log(`Groq proxy server running on http://localhost:${PORT}`);
    console.log('Forward requests to: http://localhost:' + PORT);
});

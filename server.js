import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-production-domain.com' 
    : 'http://localhost:5173',
  credentials: true
}));

// Static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Proxy middleware configuration
const apiProxy = createProxyMiddleware({
  target: 'https://naswater.market.alicloudapi.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api': ''
  },
  headers: {
    'Authorization': `APPCODE ${process.env.VITE_API_KEY}`,
    'Content-Type': 'application/json'
  },
  onProxyReq: (proxyReq, req, res) => {
    // Add default query parameters
    const url = new URL(req.url, `http://${req.headers.host}`);
    const params = new URLSearchParams(url.search);

    // Add required parameters if not present
    if (!params.has('pageNum')) params.set('pageNum', '1');
    if (!params.has('pageSize')) params.set('pageSize', '1000');
    if (!params.has('returnTotalNum')) params.set('returnTotalNum', 'true');
    if (!params.has('province')) params.set('province', '江苏省');
    if (!params.has('city')) params.set('city', '无锡市');

    // Update URL with all params
    proxyReq.path = `${proxyReq.path.split('?')[0]}?${params.toString()}`;

    console.log(`[${new Date().toISOString()}] Proxying request:`, {
      originalUrl: req.url,
      targetUrl: proxyReq.path
    });
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[${new Date().toISOString()}] Received response:`, {
      statusCode: proxyRes.statusCode,
      url: req.url
    });
  },
  onError: (err, req, res) => {
    console.error(`[${new Date().toISOString()}] Proxy error:`, err);
    res.status(500).json({
      error: 'Proxy error',
      message: err.message
    });
  }
});

// API routes
app.use('/api/stainfo', apiProxy);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Server error:`, err);
  res.status(500).json({
    error: 'Server error',
    message: err.message
  });
});

// Start server
app.listen(port, () => {
  console.log(`[${new Date().toISOString()}] Server running on port ${port}`);
  console.log(`[${new Date().toISOString()}] Environment: ${process.env.NODE_ENV}`);
});
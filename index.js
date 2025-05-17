require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware: API key authentication
app.use((req, res, next) => {
  const clientKey = req.headers['x-api-key'];
  if (clientKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

/**
 * GET /accounts/:accountId/transactions?offSet=0&limit=10
 * Maps offset/limit to a pageNum/pageSize backend API
 */
app.get('/accounts/:accountId/transactions', async (req, res) => {
  const { accountId } = req.params;

  const offset = parseInt(req.query.offSet || req.query.offset) || parseInt(process.env.DEFAULT_OFFSET) || 0;
  const limit = parseInt(req.query.limit) || parseInt(process.env.DEFAULT_LIMIT) || 10;

  const pageNum = Math.floor(offset / limit) + 1;
  const pageSize = limit;

  try {
    const response = await axios.get(process.env.UPSTREAM_API_URL, {
      headers: {
        'x-api-key': process.env.UPSTREAM_API_KEY,
      },
      params: {
        pageNum,
        pageSize,
      },
    });

    const data = response.data;
    const total = data.total || 0;
    const nextOffset = offset + data.items.length;

    const nextHref =
      nextOffset < total
        ? `/accounts/${accountId}/transactions?offSet=${nextOffset}&limit=${limit}`
        : null;

    res.json({
      page: {
        nextOffset: nextOffset < total ? String(nextOffset) : null,
        total,
      },
      links: {
        next: nextHref ? { href: nextHref } : undefined,
      },
      transactions: data.items,
    });
  } catch (err) {
    console.error('Error calling upstream page-based API:', err.message);
    res.status(500).json({ error: 'Failed to fetch data from upstream' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ FDX Core Transaction Mapper running on http://localhost:${PORT}`);
});

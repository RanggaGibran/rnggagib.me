const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route handler (tambahkan sebelum app.listen)
app.get('/*', function(req, res) {
  // Exclude API routes if you have any
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
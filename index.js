const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Discord OAuth configuration
const CLIENT_ID = process.env.DISCORD_CLIENT_ID || 'YOUR_CLIENT_ID';
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || 'YOUR_CLIENT_SECRET';
const REDIRECT_URI = `${process.env.BASE_URL || 'http://localhost:3000'}/auth/discord/callback`;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Discord OAuth Callback endpoint
app.get('/auth/discord/callback', async (req, res) => {
  try {
    const code = req.query.code;
    
    if (!code) {
      return res.send(`
        <script>
          window.opener.postMessage({type: 'DISCORD_AUTH_FAILURE'}, window.location.origin);
          window.close();
        </script>
      `);
    }
    
    // Exchange code for token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        scope: 'identify',
      }),
    });
    
    const tokens = await tokenResponse.json();
    
    if (tokenResponse.status !== 200) {
      throw new Error(tokens.error_description || 'Failed to get token from Discord');
    }
    
    // Get user info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });
    
    const user = await userResponse.json();
    
    if (userResponse.status !== 200) {
      throw new Error(user.message || 'Failed to get user from Discord');
    }
    
    // Send message to opener and close popup
    res.send(`
      <script>
        window.opener.postMessage({
          type: 'DISCORD_AUTH_SUCCESS',
          code: '${code}',
          user: ${JSON.stringify(user)},
          token: '${tokens.access_token}'
        }, window.location.origin);
        window.close();
      </script>
    `);
  } catch (error) {
    console.error('Discord auth error:', error);
    res.status(500).send(`
      <script>
        window.opener.postMessage({type: 'DISCORD_AUTH_FAILURE', error: '${error.message}'}, window.location.origin);
        window.close();
      </script>
    `);
  }
});

// Reviews API endpoint
app.get('/api/reviews', (req, res) => {
  // For demo purposes, return mock data
  // In a real implementation, fetch from database
  const mockReviews = [
    {
      id: 1,
      rating: 5,
      message: "Wow! Portfolio yang sangat kreatif dengan tema pixel art. Saya suka efek retro dan desainnya yang detail.",
      user: {
        id: "123456",
        username: "PixelFan",
        discriminator: "1234",
        avatar: null
      },
      createdAt: "2025-01-15T10:30:00"
    },
    {
      id: 2,
      rating: 4,
      message: "Website ini sangat keren! Animasi pixel art memberikan nuansa game retro yang nostalgic. Mini game nya juga menyenangkan!",
      user: {
        id: "234567",
        username: "RetroGamer",
        discriminator: "5678",
        avatar: null
      },
      createdAt: "2025-02-02T15:45:00"
    },
    {
      id: 3,
      rating: 5,
      message: "Saya terkesan dengan portofolio yang unik ini. Integrasi game dan desain website sangat menarik. Sangat menonjol dari portofolio developer lainnya!",
      user: {
        id: "345678",
        username: "WebDevPro",
        discriminator: "9012",
        avatar: null
      },
      createdAt: "2025-03-10T09:15:00"
    }
  ];
  
  res.json(mockReviews);
});

// Post review endpoint
app.post('/api/reviews', (req, res) => {
  // Validate auth token
  const authToken = req.headers.authorization?.split(' ')[1];
  if (!authToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  // Get review data
  const { rating, message } = req.body;
  
  // Validate input
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Invalid rating' });
  }
  
  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  // For demo purposes, return a success response
  // In a real implementation, save to database
  res.json({ 
    success: true, 
    review: {
      id: Date.now(),
      rating,
      message,
      user: {
        id: '123456789',
        username: 'DemoUser',
        discriminator: '1234',
        avatar: null
      },
      createdAt: new Date().toISOString()
    } 
  });
});

// Catch-all route handler (tambahkan sebelum app.listen)
app.get('/*', function(req, res) {
  // Exclude API routes if you have any
  if (!req.path.startsWith('/api/') && !req.path.startsWith('/auth/')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
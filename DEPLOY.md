# BrowserQuest - Complete Deployment Guide

## 🚀 Modernization Summary

**What was updated:**
- ❌ Removed: `websocket`, `websocket-server`, `log`, `bison`, `sanitizer`, `memcache`
- ✅ Added: `ws` v8 (modern WebSocket library)
- ✅ Created: `main-modern.js` and `ws-modern.js`
- ✅ Added: Deployment configs for Replit, Fly.io, Railway

**Why:**
Old packages from 2012 don't install on modern Node.js. This version works on Node 14+.

---

## Option 1: Replit (Easiest - Web UI)

**Best for:** Beginners, no terminal needed

### Steps:
1. Go to https://replit.com
2. Click "Create Repl"
3. Select "Import from GitHub"
4. Paste your fork URL or upload the files
5. Click "Run"

**Cost:** Free (sleeps after 1 hour) or $7/mo for always-on

**Pros:**
- Web-based editor
- No CLI needed
- Auto-deploys on code change

**Cons:**
- Sleeps on free tier
- Slower than dedicated hosting

---

## Option 2: Fly.io (Best Free Option)

**Best for:** Actually free, no sleep

### Steps:

```bash
# 1. Install Fly CLI
curl -L https://fly.io/install.sh | sh

# 2. Login
fly auth login

# 3. Navigate to BrowserQuest folder
cd BrowserQuest-master

# 4. Launch (creates app)
fly launch

# When prompted:
# - App name: browserquest-yourname
# - Region: Choose closest to you
# - Postgres: No
# - Redis: No

# 5. Deploy
fly deploy
```

**Your game:** `https://browserquest-yourname.fly.dev`

**Cost:** Free (3GB RAM total across all apps)

**Pros:**
- Truly free
- Doesn't sleep
- Fast global CDN

**Cons:**
- Requires terminal/CLI
- Learning curve

---

## Option 3: Railway (Easiest Paid)

**Best for:** $5/mo, zero config

### Steps:

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account
5. Select BrowserQuest repo
6. Click "Deploy"

**Cost:** $5/month for 500 hours runtime

**Pros:**
- Connects to GitHub
- Auto-redeploys on push
- Never sleeps
- Simple dashboard

**Cons:**
- Not free

---

## Local Testing

```bash
# Install dependencies
npm install

# Run server
npm start

# Open browser to:
http://localhost:8000
```

---

## Troubleshooting

### Error: "Cannot find module 'ws'"
```bash
npm install
```

### Error: "Port 8000 already in use"
```bash
# Kill process on port 8000
# Mac/Linux:
lsof -ti:8000 | xargs kill -9

# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Game loads but no players appear
- Check browser console (F12)
- Ensure WebSocket connection succeeded
- Check server logs for errors

### "Connection closed" errors
- Make sure your hosting platform allows WebSockets
- Check firewall settings
- Verify PORT environment variable is set correctly

---

## Configuration

Edit `server/config.json`:

```json
{
    "port": 8000,              // Auto-overridden by PORT env var on hosting
    "nb_players_per_world": 200,  // Max players per world
    "nb_worlds": 5,                // Number of parallel worlds
    "map_filepath": "./server/maps/world_server.json",
    "metrics_enabled": false       // Memcache metrics (disabled)
}
```

---

## Files You Created

```
BrowserQuest-master/
├── package.json          (Updated dependencies)
├── server/js/
│   ├── main-modern.js    (New entry point)
│   ├── ws-modern.js      (Modern WebSocket handler)
│   ├── main.js           (Original - kept for reference)
│   └── ws.js             (Original - kept for reference)
├── .replit               (Replit config)
├── fly.toml              (Fly.io config)
├── Procfile              (Railway/Heroku config)
└── README-MODERN.md      (This file)
```

---

## What's Next?

1. **Test locally:** `npm start`
2. **Choose hosting:** Replit (easiest) or Fly.io (free)
3. **Deploy:** Follow steps above
4. **Share:** Send friends your game URL!

---

## Need Help?

**Common Issues:**
- Game won't start → Check `npm install` completed
- Can't connect → Verify WebSocket support on your host
- Multiplayer broken → Check firewall/CORS settings

**Original Credits:**
- Created by Little Workshop
- Modernized: 2024

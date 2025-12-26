# BrowserQuest - Modernized

A fully modernized version of Mozilla's BrowserQuest MMORPG.

## What's Been Updated

- ✅ Modern WebSocket library (`ws` v8)
- ✅ Removed deprecated dependencies
- ✅ Simplified logging (console-based)
- ✅ Added deployment scripts
- ✅ Node 14+ compatible
- ✅ Ready for Replit/Railway/Fly.io

## Quick Start (Local)

```bash
npm install
npm start
```

Game runs on `http://localhost:8000`

## Deploy to Replit

1. Go to [replit.com](https://replit.com)
2. Click "Create Repl" → "Import from GitHub"
3. Paste: `https://github.com/YOUR-FORK/BrowserQuest`
4. Click "Run"

**Done!** Your game is live.

## Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

## Deploy to Fly.io

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Deploy
fly launch
```

## Configuration

Edit `server/config.json`:

```json
{
    "port": 8000,
    "nb_players_per_world": 200,
    "nb_worlds": 5,
    "map_filepath": "./server/maps/world_server.json"
}
```

## File Structure

```
client/          - Game client (HTML/JS)
server/          - Game server (Node.js)
  js/
    main-modern.js    - Modernized entry point
    ws-modern.js      - Modern WebSocket handler
  config.json         - Server configuration
```

## Original Credits

Created by [Little Workshop](http://www.littleworkshop.fr)
- Franck Lecollinet - [@whatthefranck](http://twitter.com/whatthefranck)
- Guillaume Lecollinet - [@glecollinet](http://twitter.com/glecollinet)

## License

- Code: MPL 2.0
- Content: CC-BY-SA 3.0

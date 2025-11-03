# 🚀 Quick Deployment Guide

## ✅ Issues Fixed
1. **Duplicate routes** in kali-mcp-server.js removed
2. **Error handling** improved in both servers
3. **Timeout handling** fixed with AbortController
4. **Port consistency** enforced (3001)
5. **Vercel routing** optimized

## 📦 Deploy to Vercel (Backend)

```bash
cd /Users/admin/atoms
vercel --prod
```

After deployment, set these environment variables in Vercel dashboard:
- `GEMINI_API_KEY` = Your Google API key
- `ALLOWED_ORIGINS` = Your frontend URLs (comma-separated)

## 🛡️ Deploy Kali MCP to GCP

```bash
cd /Users/admin/atoms
./deploy-mcp.sh
```

This will:
- Upload kali-mcp-server.js and package.json
- Install dependencies
- Start server with PM2

## 🎨 Deploy Frontend

```bash
cd /Users/admin/atoms/frontend
vercel --prod
```

## ✨ All-in-One Deploy

```bash
cd /Users/admin/atoms
./deploy-all.sh
```

## 🧪 Test Everything

```bash
cd /Users/admin/atoms
./validate-servers.sh
```

Or test specific endpoints:
```bash
# Test backend
curl https://your-backend.vercel.app/health

# Test Kali MCP
curl http://136.113.58.241:3001/health

# Test Gemini API
curl -X POST https://your-backend.vercel.app/api/gemini \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hello","temperature":0.7,"maxTokens":50}'
```

## 📁 Files Created/Modified

**Fixed:**
- `kali-mcp-server.js` - Removed duplicates, fixed error handling
- `gemini-proxy.js` - Fixed timeout handling
- `vercel.json` - Better routing
- `deploy-mcp.sh` - Port fixes

**Created:**
- `.vercelignore` - Exclude files from deployment
- `deploy-vercel.sh` - Quick backend deploy
- `deploy-all.sh` - Complete deployment
- `validate-servers.sh` - Health checks
- `FIXES_APPLIED.md` - Full documentation

## 🔧 Useful Commands

```bash
# Start local backend
cd /Users/admin/atoms
npm start

# Check Vercel deployments
vercel ls

# View deployment logs
vercel logs

# Check GCP VM status
gcloud compute instances list

# SSH to Kali VM
gcloud compute ssh atoms-kali-security --zone=us-central1-a

# View Kali MCP logs on VM
pm2 logs kali-mcp
```

## 🎯 Current Status

✅ Kali MCP Server: http://136.113.58.241:3001 (HEALTHY)
⏳ Backend: Deploy with `./deploy-vercel.sh`
⏳ Frontend: Deploy from `/frontend` directory

---
**Ready to deploy!** Run `./deploy-all.sh` to deploy everything.

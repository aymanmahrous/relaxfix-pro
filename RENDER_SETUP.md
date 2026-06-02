# Render Deployment Guide for RelaxFix PRO

## Prerequisites

- Render account (https://render.com)
- GitHub repository pushed
- Supabase database ready

## Step-by-Step Deployment

### 1. Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### 2. Create New Web Service

1. Click "New +" button
2. Select "Web Service"
3. Connect GitHub account if not already connected
4. Search for `relaxfix-pro` repository
5. Select it and click "Connect"

### 3. Configure Build Settings

**Name:** `relaxfix-pro`

**Environment:** Node

**Build Command:**
```bash
pnpm install && pnpm build
```

**Start Command:**
```bash
pnpm run start
```

**Plan:** Standard (or higher for production)

### 4. Add Environment Variables

Click "Advanced" and add these variables:

```
NODE_ENV=production
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/relaxfix_pro
VITE_APP_ID=your_manus_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
OWNER_OPEN_ID=your_owner_open_id
OWNER_NAME=Your Business Name
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your_forge_api_key
VITE_FRONTEND_FORGE_API_KEY=your_frontend_forge_key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=your_website_id
```

### 5. Deploy

1. Click "Create Web Service"
2. Render will automatically start building
3. Wait for deployment to complete (usually 5-10 minutes)
4. Once deployed, you'll get a URL like: `https://relaxfix-pro.onrender.com`

## Custom Domain Setup

### 1. Add Custom Domain

1. Go to Service Settings
2. Click "Custom Domains"
3. Enter your domain (e.g., `relaxfix.ae`)
4. Click "Add Custom Domain"

### 2. Update DNS Records

Render will provide DNS records to add to your domain registrar:

```
Type: CNAME
Name: www (or your subdomain)
Value: relaxfix-pro.onrender.com
```

### 3. Verify Domain

- Wait for DNS propagation (usually 24-48 hours)
- Render will automatically provision SSL certificate
- Your site will be accessible at your custom domain

## Auto-Deployment Setup

### Enable Auto-Deploy on Push

1. Go to Service Settings
2. Under "Deploy Hooks", copy the hook URL
3. In GitHub repository:
   - Go to Settings → Webhooks
   - Click "Add webhook"
   - Paste the Render hook URL
   - Select "Push events"
   - Click "Add webhook"

Now every push to `main` will automatically deploy!

## Database Connection

### Supabase PostgreSQL

1. Get connection string from Supabase:
   - Go to Project Settings → Database
   - Copy "Connection string" (URI)
   - Use this as DATABASE_URL

2. Run migrations on Render:
   ```bash
   # SSH into Render service
   render ssh relaxfix-pro
   
   # Run migrations
   pnpm run db:push
   ```

## Monitoring & Logs

### View Logs

1. Go to Service Dashboard
2. Click "Logs" tab
3. View real-time logs

### Common Issues

**Build fails:**
```
Check build logs for errors
Usually due to missing environment variables
```

**Database connection error:**
```
Verify DATABASE_URL is correct
Check Supabase is accessible from Render
```

**Port binding error:**
```
Ensure app doesn't hardcode port
Use process.env.PORT || 3000
```

## Performance Optimization

### 1. Enable Caching

```javascript
// server/_core/index.ts
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=3600');
  }
  next();
});
```

### 2. Use CDN

Render automatically serves static files through their CDN.

### 3. Database Optimization

- Add indexes to frequently queried columns
- Use connection pooling (Supabase provides this)
- Monitor query performance in Supabase dashboard

### 4. Monitor Performance

1. Go to Render Dashboard
2. Check "Metrics" tab
3. Monitor CPU, Memory, Disk usage

## Backup & Recovery

### Automatic Backups

Supabase provides automatic daily backups. To restore:

1. Go to Supabase Dashboard
2. Click "Backups" tab
3. Select backup and restore

### Manual Backup

```bash
# Export database
pg_dump postgresql://... > backup.sql

# Restore
psql postgresql://... < backup.sql
```

## Scaling

### Increase Resources

1. Go to Service Settings
2. Change Plan (Standard → Pro → Business)
3. Render will automatically scale

### Multiple Instances

For high traffic:
1. Go to Service Settings
2. Increase "Num Instances"
3. Render will load balance automatically

## Troubleshooting

### Service Won't Start

```bash
# Check logs
render logs relaxfix-pro

# Common causes:
# 1. Missing environment variables
# 2. Database connection error
# 3. Port already in use
```

### Deployment Stuck

```bash
# Cancel deployment
render cancel relaxfix-pro

# Retry
render deploy relaxfix-pro
```

### High Memory Usage

```bash
# Check what's consuming memory
render metrics relaxfix-pro

# Solutions:
# - Upgrade to higher plan
# - Optimize code
# - Reduce cache size
```

## Cost Estimation

- **Web Service**: $7/month (Starter) - $25/month (Standard)
- **Database**: Supabase free tier up to 500MB
- **Bandwidth**: Included in plan
- **SSL**: Free

## Support

- Render Support: https://support.render.com
- Supabase Support: https://supabase.com/support
- GitHub Actions: https://docs.github.com/en/actions

## Next Steps

1. ✅ Deploy to Render
2. ✅ Set up custom domain
3. ✅ Configure monitoring
4. ✅ Set up backups
5. ✅ Enable auto-deployment
6. ✅ Test all features
7. ✅ Monitor performance

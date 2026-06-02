# RelaxFix PRO - Deployment Guide

## Prerequisites

- Node.js 22.13.0+
- pnpm 10.4.1+
- GitHub account
- Render account
- Supabase account

## Local Development Setup

### 1. Install Dependencies

```bash
cd relaxfix-pro
pnpm install
```

### 2. Environment Variables

Create `.env.local` for development:

```bash
# Database
DATABASE_URL=mysql://user:password@localhost:3306/relaxfix_pro

# OAuth
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# JWT & Security
JWT_SECRET=your_jwt_secret_key_min_32_chars

# Owner Info
OWNER_OPEN_ID=your_owner_open_id
OWNER_NAME=Your Name

# Manus APIs
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your_forge_api_key
VITE_FRONTEND_FORGE_API_KEY=your_frontend_forge_key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=your_website_id
```

### 3. Run Development Server

```bash
pnpm run dev
```

Server runs on `http://localhost:3000`

### 4. Build for Production

```bash
pnpm run build
pnpm run start
```

## GitHub Setup

### 1. Create New Repository

```bash
gh repo create relaxfix-pro --private --source=. --remote=origin --push
```

### 2. Push to GitHub

```bash
git add .
git commit -m "Initial RelaxFix PRO commit"
git push -u origin main
```

## Supabase Setup

### 1. Create Project

- Go to [supabase.com](https://supabase.com)
- Create new project
- Note the connection string

### 2. Migrate Database

```bash
# Export current schema
mysqldump -u user -p relaxfix_pro > schema.sql

# Import to Supabase (PostgreSQL)
# Convert MySQL to PostgreSQL syntax first
psql -h db.supabase.co -U postgres -d relaxfix_pro -f schema.sql
```

### 3. Update DATABASE_URL

```
postgresql://user:password@db.supabase.co:5432/relaxfix_pro
```

## Render Deployment

### 1. Connect GitHub Repository

- Go to [render.com](https://render.com)
- Click "New +"
- Select "Web Service"
- Connect GitHub account
- Select `relaxfix-pro` repository

### 2. Configure Build Settings

**Build Command:**
```bash
pnpm install && pnpm build
```

**Start Command:**
```bash
pnpm run start
```

**Environment Variables:**

Add all variables from `.env.production`:

```
DATABASE_URL=postgresql://...
VITE_APP_ID=...
OAUTH_SERVER_URL=https://api.manus.im
JWT_SECRET=...
OWNER_OPEN_ID=...
OWNER_NAME=...
BUILT_IN_FORGE_API_URL=...
BUILT_IN_FORGE_API_KEY=...
VITE_FRONTEND_FORGE_API_KEY=...
VITE_FRONTEND_FORGE_API_URL=...
VITE_ANALYTICS_ENDPOINT=...
VITE_ANALYTICS_WEBSITE_ID=...
NODE_ENV=production
```

### 3. Deploy

- Click "Create Web Service"
- Render will automatically deploy on push to main

### 4. Custom Domain

- Go to Service Settings
- Add custom domain
- Update DNS records

## Monitoring & Maintenance

### View Logs

```bash
# Render logs
render logs relaxfix-pro

# Local logs
tail -f .manus-logs/devserver.log
```

### Database Backups

```bash
# Supabase automatic backups
# Available in Supabase dashboard

# Manual backup
pg_dump postgresql://... > backup.sql
```

### Performance Monitoring

- Render dashboard: https://dashboard.render.com
- Supabase dashboard: https://app.supabase.com
- Analytics: Check VITE_ANALYTICS_ENDPOINT

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf dist node_modules
pnpm install
pnpm build
```

### Database Connection Error

```bash
# Test connection
psql -h db.supabase.co -U postgres -d relaxfix_pro -c "SELECT 1"
```

### OAuth Not Working

- Verify VITE_APP_ID is correct
- Check OAUTH_SERVER_URL is accessible
- Ensure callback URL is registered

## Production Checklist

- [ ] All environment variables set
- [ ] Database migrated and tested
- [ ] GitHub repository created and pushed
- [ ] Render deployment successful
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Monitoring enabled
- [ ] Backup strategy in place
- [ ] Error tracking configured
- [ ] Performance optimized

## Support

For issues:
1. Check logs: `pnpm run dev` and browser console
2. Verify environment variables
3. Test database connection
4. Check GitHub Actions for build errors

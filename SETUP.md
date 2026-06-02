# RelaxFix PRO - Setup & Configuration Guide

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/relaxfix-pro.git
cd relaxfix-pro
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment

Copy environment variables template:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
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
OWNER_NAME=Your Business Name

# Manus APIs
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your_forge_api_key
VITE_FRONTEND_FORGE_API_KEY=your_frontend_forge_key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=your_website_id
```

### 4. Run Development Server

```bash
pnpm run dev
```

Open http://localhost:3000 in your browser.

## Project Structure

```
relaxfix-pro/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── hooks/         # Custom hooks
│   │   ├── contexts/      # React contexts
│   │   ├── lib/           # Utilities
│   │   ├── App.tsx        # Main app
│   │   └── index.css      # Global styles
│   └── public/            # Static files
├── server/                # Node.js backend
│   ├── _core/            # Core infrastructure
│   ├── db.ts             # Database helpers
│   ├── routers.ts        # tRPC procedures
│   └── storage.ts        # S3 storage
├── drizzle/              # Database schema
│   ├── schema.ts         # Table definitions
│   └── migrations/       # Migration files
├── shared/               # Shared code
├── package.json
├── vite.config.ts
├── tsconfig.json
└── DEPLOYMENT.md         # Deployment guide
```

## Database Setup

### MySQL (Local Development)

```bash
# Create database
mysql -u root -p
> CREATE DATABASE relaxfix_pro;
> EXIT;

# Run migrations
pnpm run db:push
```

### Supabase (Production)

1. Create project at https://supabase.com
2. Get connection string from project settings
3. Update DATABASE_URL in .env.local
4. Run migrations: `pnpm run db:push`

## Development Workflow

### Create New Feature

1. **Update Database Schema**

```typescript
// drizzle/schema.ts
export const newTable = mysqlTable('new_table', {
  id: int('id').autoincrement().primaryKey(),
  // ... columns
});
```

2. **Generate Migration**

```bash
pnpm drizzle-kit generate
```

3. **Apply Migration**

```bash
pnpm run db:push
```

4. **Add Database Helper**

```typescript
// server/db.ts
export async function getNewTableData() {
  const db = await getDb();
  return await db.select().from(newTable);
}
```

5. **Create tRPC Procedure**

```typescript
// server/routers.ts
const newRouter = router({
  list: publicProcedure.query(async () => {
    return await db.getNewTableData();
  }),
});
```

6. **Use in Frontend**

```typescript
// client/src/pages/MyPage.tsx
const { data } = trpc.newRouter.list.useQuery();
```

7. **Write Tests**

```typescript
// server/newRouter.test.ts
import { describe, it, expect } from 'vitest';

describe('newRouter', () => {
  it('should fetch data', async () => {
    // test implementation
  });
});
```

## Testing

### Run Tests

```bash
pnpm test
```

### Write Tests

Tests go in `server/*.test.ts` files using Vitest:

```typescript
import { describe, it, expect } from 'vitest';
import { appRouter } from './routers';

describe('feature', () => {
  it('should work', async () => {
    const caller = appRouter.createCaller(mockContext);
    const result = await caller.feature.query();
    expect(result).toBeDefined();
  });
});
```

## Building for Production

### Build

```bash
pnpm run build
```

Output:
- `dist/public/` - Frontend build
- `dist/index.js` - Backend build

### Test Production Build Locally

```bash
pnpm run start
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on:
- GitHub setup
- Supabase configuration
- Render deployment
- Custom domain setup
- Monitoring & maintenance

## Common Commands

```bash
# Development
pnpm run dev          # Start dev server
pnpm run check        # Type check
pnpm test             # Run tests
pnpm run format       # Format code

# Production
pnpm run build        # Build for production
pnpm run start        # Start production server

# Database
pnpm drizzle-kit generate    # Generate migrations
pnpm run db:push             # Apply migrations
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error

```bash
# Test connection
mysql -u user -p -h localhost -D relaxfix_pro -e "SELECT 1"
```

### Build Errors

```bash
# Clear cache and rebuild
rm -rf dist node_modules .next
pnpm install
pnpm build
```

### OAuth Not Working

1. Verify VITE_APP_ID is correct
2. Check OAUTH_SERVER_URL is accessible
3. Ensure callback URL matches in OAuth settings

## Performance Tips

1. **Code Splitting**: Use dynamic imports for large components
2. **Image Optimization**: Use WebP format and lazy loading
3. **Database**: Add indexes to frequently queried columns
4. **Caching**: Use React Query's cache management
5. **Monitoring**: Check Render dashboard for performance metrics

## Security Best Practices

1. Never commit `.env.local` to git
2. Use HTTPS in production
3. Validate all user inputs
4. Use parameterized queries (Drizzle handles this)
5. Keep dependencies updated: `pnpm update`
6. Enable CORS only for trusted domains
7. Use secure cookies with HttpOnly flag

## Support & Resources

- [Manus Documentation](https://docs.manus.im)
- [tRPC Documentation](https://trpc.io)
- [React Documentation](https://react.dev)
- [Drizzle ORM](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)

## License

MIT

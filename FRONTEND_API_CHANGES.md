# Frontend API Configuration Changes

## Summary

Updated the frontend to call the backend API at `https://jemo.codewithseth.co.ke` **directly** instead of using the Next.js API proxy layer.

## What Changed

### Before (Using Next.js API Proxy)
```
Browser → Vercel Frontend (/api/requests) → Backend (jemo.codewithseth.co.ke/api/requests)
```

### After (Direct Backend Calls)
```
Browser → Backend (jemo.codewithseth.co.ke/api/requests)
```

## Files Modified

### 1. Request Service Page
**File**: `/app/request-service/page.tsx`
- Changed: `fetch('/api/requests')` → `fetch('https://jemo.codewithseth.co.ke/api/requests')`
- Impact: Service request submissions now go directly to backend

### 2. Blog Admin Page
**File**: `/app/admin/blog/page.tsx`
- Changed all API calls to use direct backend URL:
  - **Fetch posts**: `fetch('/api/blog')` → `fetch('https://jemo.codewithseth.co.ke/api/blog')`
  - **Create post**: `fetch('/api/blog')` → `fetch('https://jemo.codewithseth.co.ke/api/blog')`
  - **Update post**: `fetch('/api/blog')` → `fetch('https://jemo.codewithseth.co.ke/api/blog/${id}')`
  - **Delete post**: `fetch('/api/blog?id=${id}')` → `fetch('https://jemo.codewithseth.co.ke/api/blog/${id}')`
  - **Upload image**: `fetch('/api/upload')` → `fetch('https://jemo.codewithseth.co.ke/api/upload')`

### 3. API Configuration File (NEW)
**File**: `/lib/api-config.ts`
- Created centralized configuration for backend URL
- Can be used in future updates to make API calls more maintainable

## Benefits

✅ **Transparency**: API calls are now visible in browser network tab
✅ **Simplicity**: Removed unnecessary proxy layer
✅ **Debugging**: Easier to see what's happening with API calls
✅ **Direct**: No intermediate processing

## Potential Issues to Watch

⚠️ **CORS**: The backend must have CORS enabled to accept requests from your frontend domain
- Current backend already has `app.use(cors())` which allows all origins
- For production, you may want to restrict to specific origins

⚠️ **Environment Variables**: 
- Backend URL is hardcoded as `https://jemo.codewithseth.co.ke`
- For local development, you may want to use `http://localhost:4000`
- Consider using environment variables: `process.env.NEXT_PUBLIC_BACKEND_URL`

## Next Steps

### For Other Admin Pages

If you want to update other admin pages to use direct backend calls, follow this pattern:

```typescript
// Before
const res = await fetch('/api/services')

// After
const BACKEND_URL = 'https://jemo.codewithseth.co.ke'
const res = await fetch(`${BACKEND_URL}/api/services`)
```

### Using the API Config File

For cleaner code, you can use the new config file:

```typescript
import { getApiUrl, API_CONFIG } from '@/lib/api-config'

// Simple usage
const res = await fetch(getApiUrl(API_CONFIG.endpoints.services))

// Or
const res = await fetch(getApiUrl('/api/services'))
```

## Testing

Once the MongoDB connection is fixed on the backend, test these features:

1. **Service Requests**: Submit a service request form
2. **Blog Admin**:
   - View all blog posts
   - Create a new post
   - Edit an existing post
   - Delete a post
   - Upload an image

All should now work directly with the backend!

## MongoDB Connection Still Required

**Important**: These changes don't fix the MongoDB connection issue. The backend at `https://jemo.codewithseth.co.ke` still needs to connect to MongoDB Atlas successfully.

Follow the instructions in [BACKEND_FIX_GUIDE.md](./BACKEND_FIX_GUIDE.md) to fix the MongoDB connection.

# Backend MongoDB Connection Fix Guide

## Problem Summary

Both the production backend (`jemo.codewithseth.co.ke`) and local backend are returning **500 Internal Server Error** for all API endpoints. The root cause is a **MongoDB Atlas connection failure**.

### Error Details
```
MongooseError: Operation buffering timed out after 10000ms
Reason: ReplicaSetNoPrimary
Cluster: ac-3tsni9l-shard-00-*.p8yydpu.mongodb.net
```

## Root Causes

The MongoDB Atlas connection is failing due to one or more of these issues:

1. **IP Whitelist Restrictions** - Your server's IP address is not whitelisted in MongoDB Atlas
2. **Incorrect Credentials** - Username/password in the connection string is wrong
3. **Network Access Issues** - Firewall or network configuration blocking the connection
4. **Expired/Invalid Connection String** - The MongoDB URI may be outdated

## Fix Instructions

### Step 1: Check MongoDB Atlas Configuration

1. **Log in to MongoDB Atlas**: https://cloud.mongodb.com/
2. **Navigate to your cluster** (`atlas-9v1grr-shard-0`)
3. **Check Network Access**:
   - Click "Network Access" in the left sidebar
   - Verify your server IPs are whitelisted:
     - For production: Add the IP of `jemo.codewithseth.co.ke`
     - For local testing: Add `0.0.0.0/0` (allows all IPs - for testing only)
   - Click "Add IP Address" if needed

4. **Check Database User**:
   - Click "Database Access" in the left sidebar
   - Verify the user exists and has read/write permissions
   - Note the username (you'll need it for the connection string)
   - If needed, reset the password and update your `.env` file

### Step 2: Update Backend Environment Variables

#### For Production Server (`jemo.codewithseth.co.ke`)

SSH into your production server and update the `.env` file:

```bash
# Navigate to backend directory
cd /path/to/backend

# Edit .env file
nano .env
```

Add/update these variables:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
PORT=4000
```

Replace:
- `<username>` - Your MongoDB Atlas username
- `<password>` - Your MongoDB Atlas password (URL-encoded if it contains special characters)
- `<cluster>` - Your cluster address (e.g., `ac-3tsni9l-shard-00.p8yydpu.mongodb.net`)
- `<database>` - Database name (e.g., `jemo_db`)

**Example**:
```env
MONGODB_URI=mongodb+srv://jemouser:MyP%40ssw0rd@ac-3tsni9l-shard-00.p8yydpu.mongodb.net/jemo_db?retryWrites=true&w=majority
PORT=4000
```

#### For Local Development

Update `/home/seth/Documents/boom/jemo/server/.env`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/jemo_db?retryWrites=true&w=majority
PORT=4000
```

### Step 3: Restart Backend Server

#### Production Server
```bash
# If using PM2
pm2 restart jemo-backend

# If using systemd
sudo systemctl restart jemo-backend

# If running directly
# Kill the old process and restart
pkill -f "node.*index.js"
npm start
```

#### Local Server
```bash
cd /home/seth/Documents/boom/jemo/server
npm start
```

### Step 4: Verify Connection

Test the backend endpoints:

```bash
# Test blog endpoint
curl https://jemo.codewithseth.co.ke/api/blog

# Test services endpoint
curl https://jemo.codewithseth.co.ke/api/services

# Expected response (empty array if no data):
{"success":true,"posts":[]}
```

## Alternative: Use Local MongoDB

If you prefer to use a local MongoDB instance instead of Atlas:

### Install MongoDB Locally

```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Update .env File

```env
MONGODB_URI=mongodb://localhost:27017/jemo_db
PORT=4000
```

### Restart Backend

```bash
cd /home/seth/Documents/boom/jemo/server
npm start
```

## Testing Admin Functionalities

Once the backend is connected to MongoDB:

### 1. Test Blog Admin Page

```bash
# Navigate to admin blog page
http://localhost:3000/admin/blog
```

You should be able to:
- ✅ View all blog posts
- ✅ Create new blog posts
- ✅ Edit existing posts
- ✅ Delete posts
- ✅ Upload images
- ✅ Publish/unpublish posts

### 2. Test Other Admin Pages

- **Analytics**: `http://localhost:3000/admin/analytics`
- **Services**: `http://localhost:3000/admin/services`
- **Events**: `http://localhost:3000/admin/events`
- **Quotes**: `http://localhost:3000/admin/quotes`
- **Invoices**: `http://localhost:3000/admin/invoices`
- **Requests**: `http://localhost:3000/admin/requests`

## Troubleshooting

### Still Getting 500 Errors?

1. **Check server logs**:
   ```bash
   # Production
   pm2 logs jemo-backend
   
   # Local
   # Check terminal where npm start is running
   ```

2. **Verify MongoDB connection string format**:
   - Must start with `mongodb+srv://` for Atlas
   - Special characters in password must be URL-encoded:
     - `@` → `%40`
     - `#` → `%23`
     - `$` → `%24`
     - `%` → `%25`

3. **Test MongoDB connection directly**:
   ```bash
   # Install MongoDB Shell
   npm install -g mongosh
   
   # Test connection
   mongosh "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/jemo_db"
   ```

### Frontend Still Shows Errors?

1. **Clear browser cache** and reload
2. **Check frontend is pointing to correct backend**:
   - All API routes should use `https://jemo.codewithseth.co.ke`
   - Already configured correctly in your codebase

## Summary Checklist

- [ ] Whitelist server IP in MongoDB Atlas Network Access
- [ ] Verify MongoDB user credentials
- [ ] Update `.env` file with correct `MONGODB_URI`
- [ ] Restart backend server
- [ ] Test API endpoints with curl
- [ ] Test admin blog page in browser
- [ ] Verify all CRUD operations work
- [ ] Test other admin pages

## Need Help?

If you're still experiencing issues after following this guide:

1. Check MongoDB Atlas logs for connection attempts
2. Verify your server can reach MongoDB Atlas (network connectivity)
3. Ensure no firewall rules are blocking outbound connections to MongoDB
4. Contact MongoDB Atlas support if the issue persists

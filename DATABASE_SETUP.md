# Database Setup Guide

This guide will help you set up PostgreSQL locally for the IPIMS (Integrated Police & Immigration Management System) application.

## Prerequisites

### Install PostgreSQL on Windows

1. **Download PostgreSQL**:
   - Visit [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
   - Download the latest version (recommended: PostgreSQL 15 or 16)

2. **Install PostgreSQL**:
   - Run the installer as Administrator
   - During installation:
     - Set a password for the `postgres` superuser (remember this!)
     - Default port: `5432` (keep default)
     - Default locale: `[Default locale]` (keep default)
   - Complete the installation

3. **Add PostgreSQL to PATH** (if not done automatically):
   - Open System Properties → Environment Variables
   - Add `C:\Program Files\PostgreSQL\16\bin` to your PATH
   - Restart your terminal/IDE

### Alternative: Using Docker (Recommended for Development)

If you prefer Docker:

```bash
# Pull and run PostgreSQL container
docker run --name ipims-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=ipims_db \
  -p 5432:5432 \
  -d postgres:15
```

## Database Setup

### Step 1: Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update the `.env` file with your PostgreSQL credentials:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/ipims_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ipims_db
DB_USER=postgres
DB_PASSWORD=your_password_here
NRC_SALT=change_this_to_a_random_string
```

**Important**: Update `DB_PASSWORD` to match your PostgreSQL installation password.

### Step 2: Run Database Setup

Once PostgreSQL is installed and running:

```bash
# Install dependencies (if not already done)
npm install

# Run the database setup script
node scripts/setup-db.js
```

This script will:
- Create the `ipims_db` database
- Apply the schema from `db/schema.sql`
- Insert sample data including:
  - System Administrator: admin@ipims.zm / admin123
  - Police Officer: officer@ipims.zm / officer123
  - Immigration Officer: immigration@ipims.zm / immigration123

### Step 3: Verify Setup

Test the database connection:

```bash
# Connect to PostgreSQL
psql -U postgres -h localhost -d ipims_db

# List tables
\dt

# Check sample data
SELECT email, role FROM admin_users;
SELECT email, rank FROM officers;
SELECT email, office_location FROM immigration_officers;

# Exit
\q
```

## Running the Application

After successful database setup:

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Production Deployment

### Deploying to Vercel with Supabase

1. **Create a Supabase Project**:
   - Go to [https://supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and service role key

2. **Run the Schema in Supabase**:
   - Open the Supabase SQL Editor
   - Copy the contents of `db/schema.sql`
   - Execute the schema

3. **Configure Vercel Environment Variables**:
   ```env
   DATABASE_URL=your_supabase_connection_string
   DB_HOST=your_supabase_host
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=your_supabase_password
   NRC_SALT=your_production_salt
   ```

4. **Deploy**:
   ```bash
   vercel deploy --prod
   ```

##Troubleshooting

### Common Issues

1. **"psql: command not found"**
   - PostgreSQL is not installed or not in PATH
   - Restart terminal after installation

2. **Connection refused**
   - PostgreSQL service is not running
   - Windows: Check Services for "postgresql-x64-XX"
   - Start service: `net start postgresql-x64-16`

3. **Authentication failed**
   - Wrong password in `.env` file
   - Update `DB_PASSWORD` to match your PostgreSQL password

4. **Database already exists**
   - Safe to ignore - script handles existing databases
   - To reset: `DROP DATABASE ipims_db;` then re-run setup

5. **"role 'postgres' does not exist"**
   - Create the role: `createuser -s postgres`
   - Or use your PostgreSQL username in `.env`

### Manual Database Creation

If the script fails, create manually:

```sql
-- Connect as postgres user
psql -U postgres

-- Create database
CREATE DATABASE ipims_db;

-- Connect to new database
\c ipims_db

-- Run schema (copy-paste contents of db/schema.sql)
```

## Database Schema Overview

The IPIMS database includes the following main tables:

- **residents**: Citizen and foreign national records
- **officers**: Police officer accounts
- **immigration_officers**: Immigration officer accounts
- **admin_users**: System administrator accounts
- **cases**: Police case records
- **suspects**: Suspect information linked to cases
- **permits**: Immigration work/residence permits
- **visas**: Visa applications and records
- **fingerprint_applications**: Fingerprinting service applications
- **audit_logs**: System audit trail

## Next Steps

After successful database setup:

1. Start the development server: `npm run dev`
2. Test API endpoints with real data persistence
3. Login with sample credentials
4. Register new citizens through the citizen portal

## Security Notes

- Never commit your `.env` file to version control
- Use strong passwords in production
- Rotate the `NRC_SALT` value for production deployments
- Enable SSL connections for production databases
- Set up regular database backups
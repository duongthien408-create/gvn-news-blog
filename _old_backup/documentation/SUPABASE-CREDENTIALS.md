# 🔐 SUPABASE CREDENTIALS

**Date:** 2025-11-06
**Project:** GearVN Creator Hub

---

## 📍 Project Information

**Project URL:** https://qibhlrsdykpkbsnelubz.supabase.co

**Project ID:** `qibhlrsdykpkbsnelubz`

**Region:** `ap-southeast-1` (Singapore)

---

## 🔑 API Keys

### Anon/Public Key (Frontend)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDc4NzEsImV4cCI6MjA3NzkyMzg3MX0.jmwZ8r_7dC8fU5hIlgXrFZUpJBxE07bZyBEuLoG1SrM
```

**Sử dụng cho:**
- Frontend API calls
- Public read operations
- Row Level Security (RLS) queries

---

## 🗄️ Database Connection

### Connection String (Pooler)
```
postgresql://postgres.qibhlrsdykpkbsnelubz:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### Connection String (Direct)
```
postgresql://postgres.qibhlrsdykpkbsnelubz:[YOUR-PASSWORD]@db.qibhlrsdykpkbsnelubz.supabase.co:5432/postgres
```

**Lấy password:**
1. Vào Supabase Dashboard
2. Settings → Database
3. Copy password từ Connection String

---

## 📊 Dashboard Access

**URL:** https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz

**Quick Links:**
- **Table Editor:** https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/editor
- **SQL Editor:** https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/sql
- **Auth:** https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/auth/users
- **Storage:** https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/storage/buckets
- **Logs:** https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/logs

---

## 🛠️ Setup Commands

### 1. Create .env file

```bash
# In project root
cat > .env << 'EOF'
SUPABASE_URL=https://qibhlrsdykpkbsnelubz.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDc4NzEsImV4cCI6MjA3NzkyMzg3MX0.jmwZ8r_7dC8fU5hIlgXrFZUpJBxE07bZyBEuLoG1SrM
DATABASE_URL=postgresql://postgres.qibhlrsdykpkbsnelubz:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
EOF
```

### 2. Test connection

```bash
# Test PostgreSQL connection
psql $DATABASE_URL -c "SELECT version();"

# Or with Docker
docker run --rm -it postgres:15 psql $DATABASE_URL -c "SELECT version();"
```

---

## 🔒 Security Notes

⚠️ **IMPORTANT:**
- ✅ Anon key is safe to use in frontend (protected by RLS)
- ❌ NEVER commit `.env` file to git
- ❌ NEVER share Service Role key publicly
- ✅ Use environment variables in production
- ✅ Enable Row Level Security (RLS) on all tables

---

## 📝 Common Tasks

### Run SQL Migration
```bash
# Via psql
psql $DATABASE_URL -f database/01-add-video-fields.sql

# Via Supabase Dashboard
# Go to SQL Editor → Paste SQL → Run
```

### Check Tables
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

### Verify Video Fields
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'posts'
  AND column_name IN ('video_url', 'video_thumbnail', 'video_duration', 'video_platform', 'transcript', 'content_type');
```

---

## 🚀 API Endpoints

### REST API Base URL
```
https://qibhlrsdykpkbsnelubz.supabase.co/rest/v1
```

### Example: Get all posts
```bash
curl https://qibhlrsdykpkbsnelubz.supabase.co/rest/v1/posts \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDc4NzEsImV4cCI6MjA3NzkyMzg3MX0.jmwZ8r_7dC8fU5hIlgXrFZUpJBxE07bZyBEuLoG1SrM" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDc4NzEsImV4cCI6MjA3NzkyMzg3MX0.jmwZ8r_7dC8fU5hIlgXrFZUpJBxE07bZyBEuLoG1SrM"
```

---

## 📅 Last Updated

**Date:** 2025-11-06
**Updated by:** Claude Code Assistant

---

## 🆘 Support

**Supabase Docs:** https://supabase.com/docs
**Community:** https://github.com/supabase/supabase/discussions
**Status:** https://status.supabase.com

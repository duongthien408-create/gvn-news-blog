# 🚀 START HERE - Schema v2.0

## ⚡ Quick Setup (2 steps)

### Step 1: Create Schema
Open **Supabase SQL Editor** and run:
```
database/02-new-complete-schema.sql
```

### Step 2: Load Sample Data
Then run:
```
database/seed-sample-data.sql
```

**Done!** ✅

---

## 📁 Important Files

```
database/
├── 02-new-complete-schema.sql    ⭐ MAIN SCHEMA (run this first)
├── seed-sample-data.sql          ⭐ SAMPLE DATA (run this second)
├── 00-clean-data.sql             🧹 Clean/reset data
├── README-V2.md                  📚 Full documentation
├── QUICKSTART.md                 ⚡ Setup guide
└── v1_archive/                   📦 Old files (ignore)
```

---

## 🎯 What You Get

- **25+ tables** with all features
- **10 users** (test accounts ready)
- **20 posts** (articles + videos)
- **5 creators** (YouTubers)
- **15 tags**, **10 products**, **5 squads**
- **Full gamification** (levels, achievements, streaks)
- **Backend already compatible!**

---

## 🧪 Test

After setup, verify:

```sql
SELECT COUNT(*) FROM users;    -- Should be 10
SELECT COUNT(*) FROM posts;    -- Should be 20
SELECT COUNT(*) FROM creators; -- Should be 5
```

---

## 🔐 Test Login

```
Email: admin@gearvn.com
Password: password123
```

---

## 📚 Need Help?

- Quick setup → [QUICKSTART.md](QUICKSTART.md)
- Full docs → [README-V2.md](README-V2.md)
- Migration info → [../V2-MIGRATION-COMPLETE.md](../V2-MIGRATION-COMPLETE.md)

---

**Schema Version:** 2.0.0 | **Status:** ✅ READY

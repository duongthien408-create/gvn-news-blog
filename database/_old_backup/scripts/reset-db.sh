#!/bin/bash

# ============================================
# Database Reset Script
# Drops all tables and recreates from schema
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f ../.env ]; then
    export $(cat ../.env | grep -v '^#' | xargs)
fi

echo -e "${GREEN}🔄 Database Reset Script${NC}"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ ERROR: DATABASE_URL is not set${NC}"
    echo "Please set DATABASE_URL in .env file or export it as environment variable"
    exit 1
fi

# Confirm reset
echo -e "${RED}⚠️  WARNING: This will DELETE ALL DATA in the database!${NC}"
echo "This action cannot be undone."
echo ""
read -p "Type 'RESET' to confirm: " confirm

if [ "$confirm" != "RESET" ]; then
    echo "Reset cancelled"
    exit 0
fi

# Create backup before reset
echo ""
echo -e "${YELLOW}📦 Creating backup before reset...${NC}"
./backup.sh

# Drop all tables
echo ""
echo -e "${YELLOW}🗑️  Dropping all tables...${NC}"

psql "$DATABASE_URL" << EOF
DO \$\$ DECLARE
    r RECORD;
BEGIN
    -- Disable triggers
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END \$\$;
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ All tables dropped${NC}"
else
    echo -e "${RED}❌ Failed to drop tables${NC}"
    exit 1
fi

# Recreate schema
echo ""
echo -e "${YELLOW}🏗️  Recreating schema...${NC}"
psql "$DATABASE_URL" -f ../00-complete-schema.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Schema created${NC}"
else
    echo -e "${RED}❌ Failed to create schema${NC}"
    exit 1
fi

# Seed data
echo ""
echo -e "${YELLOW}🌱 Seeding data...${NC}"
psql "$DATABASE_URL" -f ../01-seed-data.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Data seeded${NC}"
else
    echo -e "${RED}❌ Failed to seed data${NC}"
    exit 1
fi

# Verify
echo ""
echo -e "${YELLOW}🔍 Verifying database...${NC}"
psql "$DATABASE_URL" << EOF
SELECT 'Users: ' || COUNT(*) FROM users
UNION ALL
SELECT 'Posts: ' || COUNT(*) FROM posts
UNION ALL
SELECT 'Comments: ' || COUNT(*) FROM comments
UNION ALL
SELECT 'Categories: ' || COUNT(*) FROM categories;
EOF

echo ""
echo -e "${GREEN}🎉 Database reset complete!${NC}"

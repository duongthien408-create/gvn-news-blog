#!/bin/bash

# ============================================
# Database Migration Script
# Runs migrations on existing database
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

echo -e "${GREEN}🚀 Database Migration Script${NC}"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ ERROR: DATABASE_URL is not set${NC}"
    echo "Please set DATABASE_URL in .env file or export it as environment variable"
    exit 1
fi

# Create migrations table if not exists
echo -e "${YELLOW}📋 Checking migrations table...${NC}"
psql "$DATABASE_URL" << EOF
CREATE TABLE IF NOT EXISTS schema_migrations (
  id SERIAL PRIMARY KEY,
  version VARCHAR(255) UNIQUE NOT NULL,
  applied_at TIMESTAMP DEFAULT NOW()
);
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migrations table ready${NC}"
else
    echo -e "${RED}❌ Failed to create migrations table${NC}"
    exit 1
fi

# Function to check if migration has been applied
has_migration() {
    local version=$1
    local result=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM schema_migrations WHERE version='$version'")
    echo $result
}

# Function to apply migration
apply_migration() {
    local version=$1
    local file=$2

    echo ""
    echo -e "${YELLOW}🔧 Applying migration: ${version}${NC}"

    # Run migration
    psql "$DATABASE_URL" -f "$file"

    if [ $? -eq 0 ]; then
        # Record migration
        psql "$DATABASE_URL" -c "INSERT INTO schema_migrations (version) VALUES ('$version')"
        echo -e "${GREEN}✅ Migration ${version} applied${NC}"
    else
        echo -e "${RED}❌ Migration ${version} failed${NC}"
        exit 1
    fi
}

# Check and apply base schema
echo ""
echo -e "${YELLOW}Checking base schema...${NC}"
if [ $(has_migration "00-complete-schema") -eq 0 ]; then
    apply_migration "00-complete-schema" "../00-complete-schema.sql"
else
    echo -e "${GREEN}✅ Base schema already applied${NC}"
fi

# Check and apply seed data
echo ""
echo -e "${YELLOW}Checking seed data...${NC}"
if [ $(has_migration "01-seed-data") -eq 0 ]; then
    apply_migration "01-seed-data" "../01-seed-data.sql"
else
    echo -e "${GREEN}✅ Seed data already applied${NC}"
fi

# List additional migration files
echo ""
echo -e "${YELLOW}Checking for additional migrations...${NC}"

MIGRATIONS_DIR="../migrations"
if [ -d "$MIGRATIONS_DIR" ]; then
    for file in $(ls -v ${MIGRATIONS_DIR}/*.sql 2>/dev/null); do
        version=$(basename "$file" .sql)

        if [ $(has_migration "$version") -eq 0 ]; then
            apply_migration "$version" "$file"
        else
            echo -e "${GREEN}✅ Migration ${version} already applied${NC}"
        fi
    done
else
    echo "No additional migrations found"
fi

# Show applied migrations
echo ""
echo -e "${YELLOW}📋 Applied migrations:${NC}"
psql "$DATABASE_URL" -c "SELECT version, applied_at FROM schema_migrations ORDER BY applied_at"

echo ""
echo -e "${GREEN}🎉 All migrations applied!${NC}"

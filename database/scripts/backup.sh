#!/bin/bash

# ============================================
# Database Backup Script
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

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/gearvn_backup_${TIMESTAMP}.sql"
COMPRESSED_FILE="${BACKUP_FILE}.gz"

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

echo -e "${GREEN}🚀 Starting database backup...${NC}"
echo "Timestamp: ${TIMESTAMP}"
echo "Backup file: ${BACKUP_FILE}"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ ERROR: DATABASE_URL is not set${NC}"
    echo "Please set DATABASE_URL in .env file or export it as environment variable"
    exit 1
fi

# Backup database
echo -e "${YELLOW}📦 Creating backup...${NC}"
pg_dump "$DATABASE_URL" > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backup created successfully${NC}"

    # Compress backup
    echo -e "${YELLOW}🗜️  Compressing backup...${NC}"
    gzip "$BACKUP_FILE"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Backup compressed successfully${NC}"

        # Get file size
        SIZE=$(du -h "$COMPRESSED_FILE" | cut -f1)
        echo "File size: ${SIZE}"

        # Keep only last 7 backups
        echo -e "${YELLOW}🧹 Cleaning old backups (keeping last 7)...${NC}"
        cd ${BACKUP_DIR}
        ls -t gearvn_backup_*.sql.gz | tail -n +8 | xargs -r rm --
        cd ..

        echo -e "${GREEN}✅ Backup complete!${NC}"
        echo "Backup saved to: ${COMPRESSED_FILE}"
    else
        echo -e "${RED}❌ Failed to compress backup${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Backup failed${NC}"
    exit 1
fi

# List all backups
echo ""
echo -e "${YELLOW}📋 Available backups:${NC}"
ls -lh ${BACKUP_DIR}/gearvn_backup_*.sql.gz 2>/dev/null || echo "No backups found"

echo ""
echo -e "${GREEN}🎉 All done!${NC}"

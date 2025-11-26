#!/bin/bash

# ============================================
# Database Restore Script
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

echo -e "${GREEN}🔄 Database Restore Script${NC}"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ ERROR: DATABASE_URL is not set${NC}"
    echo "Please set DATABASE_URL in .env file or export it as environment variable"
    exit 1
fi

# List available backups
echo -e "${YELLOW}📋 Available backups:${NC}"
BACKUPS=($(ls -t ${BACKUP_DIR}/gearvn_backup_*.sql.gz 2>/dev/null))

if [ ${#BACKUPS[@]} -eq 0 ]; then
    echo -e "${RED}❌ No backup files found in ${BACKUP_DIR}${NC}"
    exit 1
fi

# Display backups with numbers
for i in "${!BACKUPS[@]}"; do
    SIZE=$(du -h "${BACKUPS[$i]}" | cut -f1)
    echo "$((i+1)). ${BACKUPS[$i]} (${SIZE})"
done

# Get user input
echo ""
read -p "Select backup number to restore (1-${#BACKUPS[@]}) or 'q' to quit: " choice

if [ "$choice" = "q" ]; then
    echo "Restore cancelled"
    exit 0
fi

# Validate input
if ! [[ "$choice" =~ ^[0-9]+$ ]] || [ "$choice" -lt 1 ] || [ "$choice" -gt ${#BACKUPS[@]} ]; then
    echo -e "${RED}❌ Invalid selection${NC}"
    exit 1
fi

SELECTED_BACKUP="${BACKUPS[$((choice-1))]}"
echo ""
echo -e "${YELLOW}Selected backup: ${SELECTED_BACKUP}${NC}"

# Confirm restore
echo ""
echo -e "${RED}⚠️  WARNING: This will overwrite the current database!${NC}"
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

# Decompress backup
TEMP_FILE="${SELECTED_BACKUP%.gz}"
echo ""
echo -e "${YELLOW}📦 Decompressing backup...${NC}"
gunzip -c "$SELECTED_BACKUP" > "$TEMP_FILE"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to decompress backup${NC}"
    exit 1
fi

# Restore database
echo -e "${YELLOW}🔄 Restoring database...${NC}"
psql "$DATABASE_URL" < "$TEMP_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database restored successfully${NC}"

    # Clean up temp file
    rm "$TEMP_FILE"

    echo -e "${GREEN}🎉 Restore complete!${NC}"
else
    echo -e "${RED}❌ Restore failed${NC}"
    rm "$TEMP_FILE"
    exit 1
fi

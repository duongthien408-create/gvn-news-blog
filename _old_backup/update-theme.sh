#!/bin/bash

# Update all HTML files to use GearVN red theme instead of blue

cd "/Users/thienduong/Documents/MVP - GVN Blogs"

# List of files to update
files=(
  "bookmarks.html"
  "following.html"
  "profile.html"
  "explore.html"
  "settings.html"
  "folders.html"
  "tags.html"
  "custom-feeds.html"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Updating $file..."

    # Replace blue colors with red (GearVN theme)
    sed -i '' 's/border-blue-500\/40/border-red-500\/40/g' "$file"
    sed -i '' 's/bg-blue-500\/10/bg-red-500\/10/g' "$file"
    sed -i '' 's/text-blue-300/text-red-300/g' "$file"
    sed -i '' 's/text-blue-200/text-red-200/g' "$file"
    sed -i '' 's/hover:bg-blue-500\/20/hover:bg-red-500\/20/g' "$file"
    sed -i '' 's/hover:border-blue-500\/40/hover:border-red-500\/40/g' "$file"
    sed -i '' 's/bg-blue-500/bg-red-500/g' "$file"
    sed -i '' 's/hover:bg-blue-600/hover:bg-red-600/g' "$file"
    sed -i '' 's/focus:border-blue-500/focus:border-red-500/g' "$file"
    sed -i '' 's/text-blue-400/text-red-400/g' "$file"
    sed -i '' 's/text-blue-500/text-red-500/g' "$file"

    # Update hub-surface to pure black
    sed -i '' 's/"hub-surface": "#0f172a"/"hub-surface": "#000000"/g' "$file"
    sed -i '' 's/"hub-panel": "#111a2e"/"hub-panel": "#0F0F0F"/g' "$file"
    sed -i '' 's/"hub-card": "#152038"/"hub-card": "#191919"/g' "$file"

    # Add class="dark" to html tag if not present
    sed -i '' 's/<html lang="vi">/<html lang="vi" class="dark">/g' "$file"

    # Add theme.js script before closing body tag if not present
    if ! grep -q "scripts/theme.js" "$file"; then
      sed -i '' 's|</body>|    <script type="module" src="./scripts/theme.js"></script>\
  </body>|g' "$file"
    fi

    echo "✓ Updated $file"
  fi
done

echo "All files updated successfully!"

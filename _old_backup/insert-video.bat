@echo off
echo Inserting E-Dra keyboard video...

curl -X POST "https://qibhlrsdykpkbsnelubz.supabase.co/rest/v1/posts" ^
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDc4NzEsImV4cCI6MjA3NzkyMzg3MX0.jmwZ8r_7dC8fU5hIlgXrFZUpJBxE07bZyBEuLoG1SrM" ^
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDc4NzEsImV4cCI6MjA3NzkyMzg3MX0.jmwZ8r_7dC8fU5hIlgXrFZUpJBxE07bZyBEuLoG1SrM" ^
  -H "Content-Type: application/json" ^
  -H "Prefer: resolution=merge-duplicates" ^
  -d "{\"id\":\"Wfba9YqU_Ro\",\"title\":\"Chỉ cần 500k là có ngay bàn phím cơ chính hãng ngon bổ rẻ rồi - E-Dra EK375v2\",\"excerpt\":\"Video giới thiệu bàn phím cơ E-Dra EK375 V2 với mức giá khoảng 500,000 VND. Bàn phím có layout 75%%, keycap PBT double-shot, switch linear, và thiết kế phối màu tương phản. Đây là lựa chọn phù hợp cho người mới tập chơi bàn phím cơ.\",\"cover_image\":\"https://i.ytimg.com/vi/Wfba9YqU_Ro/maxresdefault.jpg\",\"creator_id\":\"4\",\"creator_name\":\"Ngọc Sang\",\"category\":\"hardware\",\"tags\":[\"keyboard\",\"e-dra\",\"mechanical-keyboard\",\"budget\",\"review\"],\"read_time\":\"2 min read\",\"published\":true,\"content_type\":\"video\",\"video_url\":\"https://www.youtube.com/shorts/Wfba9YqU_Ro\",\"video_thumbnail\":\"https://i.ytimg.com/vi/Wfba9YqU_Ro/maxresdefault.jpg\",\"video_duration\":\"PT1M30S\",\"video_platform\":\"youtube\"}"

echo.
echo Done!
pause

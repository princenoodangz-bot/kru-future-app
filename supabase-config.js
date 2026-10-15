// ไฟล์ supabase-config.js
const SUPABASE_URL = 'https://eyrqvgdcgmgljtprjlrk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cnF2Z2RjZ21nbGp0cHJqbHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5MTAxMDAsImV4cCI6MjEwNzQ4NjEwMH0.9LY3TwcBwF-7V5Sy6D2N4u5VPOpbhYzjSJNIQpeq-Zg';

// เปลี่ยนมาใช้ window.supabase เพื่อบังคับให้ทุกไฟล์ HTML ดึงตัวเชื่อมต่อนี้ไปใช้งานได้อย่างสมบูรณ์
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
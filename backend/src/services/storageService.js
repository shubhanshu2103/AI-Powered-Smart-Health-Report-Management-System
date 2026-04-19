const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const BUCKET = 'medical-reports';

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some(b => b.name === BUCKET);
  if (!exists) {
    await supabase.storage.createBucket(BUCKET, { public: true });
  }
}

ensureBucket().catch(err => console.warn('Storage bucket check:', err.message));

async function uploadFile(buffer, originalName, mimeType, userId) {
  const ext = originalName.split('.').pop();
  const key = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await supabase.storage.from(BUCKET).upload(key, buffer, {
    contentType: mimeType,
    upsert: false,
  });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(key);
  return urlData.publicUrl;
}

async function downloadBuffer(publicUrl) {
  const res = await fetch(publicUrl);
  if (!res.ok) throw new Error(`Failed to download file: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

module.exports = { uploadFile, downloadBuffer };

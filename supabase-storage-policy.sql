-- leather-swatches Storage Bucket RLS 策略
-- 在 Supabase SQL Editor 中执行

-- 1. 允许匿名用户上传文件
CREATE POLICY "Allow anonymous uploads"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'leather-swatches');

-- 2. 允许匿名用户读取文件
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'leather-swatches');

-- 3. 允许匿名用户更新自己上传的文件
CREATE POLICY "Allow anonymous updates"
ON storage.objects
FOR UPDATE
TO anon
USING (bucket_id = 'leather-swatches');

-- 4. 允许匿名用户删除自己上传的文件
CREATE POLICY "Allow anonymous deletes"
ON storage.objects
FOR DELETE
TO anon
USING (bucket_id = 'leather-swatches');

import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  console.log('[Upload] Starting upload process...');
  
  try {
    // 检查 Vercel Blob 配置
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('[Upload] BLOB_READ_WRITE_TOKEN not configured');
      return NextResponse.json({ 
        error: 'Vercel Blob 未配置，请设置 BLOB_READ_WRITE_TOKEN 环境变量' 
      }, { status: 503 });
    }
    console.log('[Upload] BLOB token found');

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('[Upload] No file in request');
      return NextResponse.json({ error: '没有上传文件' }, { status: 400 });
    }
    console.log('[Upload] File received:', file.name, file.type, file.size);

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.error('[Upload] Invalid file type:', file.type);
      return NextResponse.json({ error: '只支持 JPG、PNG、GIF、WebP 格式' }, { status: 400 });
    }

    // 验证文件大小（限制 5MB）
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error('[Upload] File too large:', file.size);
      return NextResponse.json({ error: '文件大小不能超过 5MB' }, { status: 400 });
    }

    // 生成唯一文件名
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `uploads/${timestamp}_${randomStr}.${fileExt}`;
    console.log('[Upload] Generated filename:', fileName);

    // 上传到 Vercel Blob - 使用类型断言绕过 access 参数限制
    console.log('[Upload] Calling put()...');
    const blob = await put(fileName, file, {
      contentType: file.type,
      addRandomSuffix: false,
    } as any);
    console.log('[Upload] Upload successful:', blob.url);

    // 返回公开访问 URL
    return NextResponse.json({
      success: true,
      imageUrl: blob.url,
      fileName: blob.pathname,
      size: file.size,
      downloadUrl: blob.downloadUrl,
    });
  } catch (error) {
    console.error('[Upload] Error:', error);
    console.error('[Upload] Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json({ 
      error: '上传失败',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

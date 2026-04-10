import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 最大文件大小：50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// 生成安全的文件名（移除中文和特殊字符）
function sanitizeFilename(filename: string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  
  // 获取文件扩展名
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
  
  // 生成安全的文件名：时间戳_随机数。扩展名
  return `${timestamp}_${randomStr}.${ext}`;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ error: 'Missing filename' }, { status: 400 });
    }

    const body = await request.arrayBuffer();

    // 检查文件大小
    if (body.byteLength > MAX_FILE_SIZE) {
      const sizeMB = (body.byteLength / 1024 / 1024).toFixed(2);
      console.error(`File too large: ${sizeMB}MB (max: 50MB)`);
      return NextResponse.json(
        { 
          error: 'File too large',
          message: `文件大小为 ${sizeMB}MB，最大支持 50MB`,
          size: body.byteLength,
          maxSize: MAX_FILE_SIZE
        },
        { status: 413 }
      );
    }

    // 检查 Supabase 配置
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase configuration missing');
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      );
    }

    // 创建 Supabase 客户端
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 生成安全的文件名
    const safeFilename = sanitizeFilename(filename);

    // 上传到 Supabase Storage
    const { data, error } = await supabase.storage
      .from('leather-swatches')
      .upload(`product-images/${safeFilename}`, body, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/jpeg',
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    // 获取公开访问 URL
    const { data: urlData } = supabase.storage
      .from('leather-swatches')
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      pathname: data.path,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    
    // 处理 413 错误
    if (error.message?.includes('413') || error.statusCode === 413) {
      return NextResponse.json(
        { 
          error: 'File too large',
          message: '文件大小超过限制（最大 50MB）'
        },
        { status: 413 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Upload failed',
        message: error.message || '上传失败，请稍后重试'
      },
      { status: 500 }
    );
  }
}

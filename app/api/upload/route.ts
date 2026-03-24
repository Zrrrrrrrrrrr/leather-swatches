import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

// 最大文件大小：5MB (Vercel Blob 限制)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

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
      console.error(`File too large: ${sizeMB}MB (max: 5MB)`);
      return NextResponse.json(
        { 
          error: 'File too large',
          message: `文件大小为 ${sizeMB}MB，最大支持 5MB`,
          size: body.byteLength,
          maxSize: MAX_FILE_SIZE
        },
        { status: 413 }
      );
    }

    // 添加到 img/ 文件夹（Vercel Blob 使用路径前缀作为文件夹）
    const blobPath = `img/${filename}`;

    // 从环境变量获取 token
    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
      console.error('BLOB_READ_WRITE_TOKEN is not set');
      return NextResponse.json(
        { error: 'Blob token not configured' },
        { status: 500 }
      );
    }

    const blob = await put(blobPath, body, {
      access: 'public',
      token,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    
    // 处理 413 错误
    if (error.message?.includes('413') || error.statusCode === 413) {
      return NextResponse.json(
        { 
          error: 'File too large',
          message: '文件大小超过限制（最大 5MB）'
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

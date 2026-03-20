import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Missing filename' }, { status: 400 });
  }

  const body = await request.arrayBuffer();

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
}

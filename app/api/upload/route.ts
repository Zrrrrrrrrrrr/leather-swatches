import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Missing filename' }, { status: 400 });
  }

  const body = await request.arrayBuffer();

  // 不传 token，让库自动从 BLOB_READ_WRITE_TOKEN 环境变量读取
  const blob = await put(filename, body, {
    access: 'public',
  });

  return NextResponse.json({
    success: true,
    url: blob.url,
    downloadUrl: blob.downloadUrl,
    pathname: blob.pathname,
  });
}

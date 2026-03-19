import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Missing filename' }, { status: 400 });
  }

  const body = await request.arrayBuffer();

  const blob = await put(filename, body, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN!,
  });

  return NextResponse.json({
    url: blob.url,
    downloadUrl: blob.downloadUrl,
    pathname: blob.pathname,
    contentType: blob.contentType,
  });
}

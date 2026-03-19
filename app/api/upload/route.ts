import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Missing filename' }, { status: 400 });
  }

  // 读取请求体为 ArrayBuffer
  const body = await request.arrayBuffer();

  // 使用官方教程的标准方式
  const blob = await put(filename, body, {
    access: 'public',
  });

  return NextResponse.json(blob);
}

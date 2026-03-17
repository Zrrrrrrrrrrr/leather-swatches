import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// 获取色卡的产品展示图
export async function GET(request: NextRequest, { params }: { params: Promise<{ swatchId: string }> }) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Supabase 未配置' }, { status: 503 });
    }

    const { swatchId } = await params;
    
    const { data, error } = await supabase!
      .from('product_images')
      .select('*')
      .eq('swatch_id', parseInt(swatchId))
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Failed to fetch product images:', error);
    return NextResponse.json({ error: 'Failed to fetch product images' }, { status: 500 });
  }
}

// 添加产品展示图
export async function POST(request: NextRequest, { params }: { params: Promise<{ swatchId: string }> }) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Supabase 未配置' }, { status: 503 });
    }

    const { swatchId } = await params;
    const body = await request.json();
    const { product_type, image_url, description } = body;

    if (!product_type || !image_url) {
      return NextResponse.json({ error: 'Product type and image URL are required' }, { status: 400 });
    }

    const { data, error } = await supabase!
      .from('product_images')
      .insert({
        swatch_id: parseInt(swatchId),
        product_type,
        image_url,
        description: description || null,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Failed to add product image:', error);
    return NextResponse.json({ error: 'Failed to add product image' }, { status: 500 });
  }
}

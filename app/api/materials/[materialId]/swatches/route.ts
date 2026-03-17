import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// 获取材料的所有色卡
export async function GET(request: NextRequest, { params }: { params: Promise<{ materialId: string }> }) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Supabase 未配置' }, { status: 503 });
    }

    const { materialId } = await params;
    
    const { data, error } = await supabase!
      .from('swatches')
      .select('*')
      .eq('material_id', parseInt(materialId))
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Failed to fetch swatches:', error);
    return NextResponse.json({ error: 'Failed to fetch swatches' }, { status: 500 });
  }
}

// 添加色卡
export async function POST(request: NextRequest, { params }: { params: Promise<{ materialId: string }> }) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Supabase 未配置' }, { status: 503 });
    }

    const { materialId } = await params;
    const body = await request.json();
    const { color_name, color_code, description, price, stock } = body;

    if (!color_name) {
      return NextResponse.json({ error: 'Color name is required' }, { status: 400 });
    }

    const { data, error } = await supabase!
      .from('swatches')
      .insert({
        material_id: parseInt(materialId),
        color_name,
        color_code: color_code || null,
        description: description || null,
        price: price || null,
        stock: stock || 0,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Failed to create swatch:', error);
    return NextResponse.json({ error: 'Failed to create swatch' }, { status: 500 });
  }
}

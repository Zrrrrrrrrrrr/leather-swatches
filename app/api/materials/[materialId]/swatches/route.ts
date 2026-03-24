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

// 更新色卡
export async function PUT(request: NextRequest, { params }: { params: Promise<{ materialId: string }> }) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Supabase 未配置' }, { status: 503 });
    }

    const body = await request.json();
    const { id, color_name, color_code, description, price, stock } = body;

    if (!id) {
      return NextResponse.json({ error: 'Swatch ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (color_name !== undefined) updateData.color_name = color_name;
    if (color_code !== undefined) updateData.color_code = color_code || null;
    if (description !== undefined) updateData.description = description || null;
    if (price !== undefined) updateData.price = price || null;
    if (stock !== undefined) updateData.stock = stock || 0;

    const { data, error } = await supabase!
      .from('swatches')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to update swatch:', error);
    return NextResponse.json({ error: 'Failed to update swatch' }, { status: 500 });
  }
}

// 删除色卡
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ materialId: string }> }) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Supabase 未配置' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Swatch ID is required' }, { status: 400 });
    }

    // 先删除关联的产品图片（级联删除）
    const { error: imagesError } = await supabase!
      .from('product_images')
      .delete()
      .eq('swatch_id', parseInt(id));

    if (imagesError) {
      console.error('Failed to delete related product images:', imagesError);
    }

    // 删除色卡
    const { error } = await supabase!
      .from('swatches')
      .delete()
      .eq('id', parseInt(id));

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete swatch:', error);
    return NextResponse.json({ error: 'Failed to delete swatch' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// 获取所有材料（带产品图片）
export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Supabase 未配置，请检查环境变量' }, { status: 503 });
    }

    // 获取所有材料
    const { data: materials, error } = await supabase!
      .from('materials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // 为每个材料获取第一张产品图片
    const materialsWithImages = await Promise.all(
      materials.map(async (material) => {
        // 获取该材料的色卡
        const { data: swatches } = await supabase!
          .from('swatches')
          .select('id')
          .eq('material_id', material.id);

        if (swatches && swatches.length > 0) {
          const swatchIds = swatches.map(s => s.id);
          
          // 获取这些色卡的产品图片
          const { data: images } = await supabase!
            .from('product_images')
            .select('image_url')
            .in('swatch_id', swatchIds)
            .limit(1);

          return {
            ...material,
            cover_image: images && images.length > 0 ? images[0].image_url : null
          };
        }

        return { ...material, cover_image: null };
      })
    );

    return NextResponse.json(materialsWithImages);
  } catch (error) {
    console.error('Failed to fetch materials:', error);
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500 });
  }
}

// 创建新材料
export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Supabase 未配置' }, { status: 503 });
    }

    const body = await request.json();
    const { name, description, category } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const { data, error } = await supabase!
      .from('materials')
      .insert({
        name,
        description: description || null,
        category: category || null,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Failed to create material:', error);
    return NextResponse.json({ error: 'Failed to create material' }, { status: 500 });
  }
}

// 更新材料
export async function PUT(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Supabase 未配置' }, { status: 503 });
    }

    const body = await request.json();
    const { id, name, description, category } = body;

    if (!id) {
      return NextResponse.json({ error: 'Material ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description || null;
    if (category !== undefined) updateData.category = category || null;

    const { data, error } = await supabase!
      .from('materials')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to update material:', error);
    return NextResponse.json({ error: 'Failed to update material' }, { status: 500 });
  }
}

// 删除材料
export async function DELETE(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Supabase 未配置' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Material ID is required' }, { status: 400 });
    }

    // 先删除关联的色卡（级联删除）
    const { error: swatchesError } = await supabase!
      .from('swatches')
      .delete()
      .eq('material_id', parseInt(id));

    if (swatchesError) {
      console.error('Failed to delete related swatches:', swatchesError);
    }

    // 删除材料
    const { error } = await supabase!
      .from('materials')
      .delete()
      .eq('id', parseInt(id));

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete material:', error);
    return NextResponse.json({ error: 'Failed to delete material' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// 获取所有材料（带产品图片）
// 支持搜索参数：?search=关键词&category=分类
// 支持获取分类列表：?action=categories
export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Supabase 未配置，请检查环境变量' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    // 如果是获取分类列表
    if (action === 'categories') {
      const { data, error } = await supabase!
        .from('materials')
        .select('category')
        .not('category', 'is', null);

      if (error) throw error;

      // 去重并过滤空值
      const categories = [...new Set(data.map(m => m.category).filter(Boolean))];
      return NextResponse.json(categories);
    }
    
    // 否则执行正常的材料查询逻辑
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    // 构建查询
    let query = supabase!
      .from('materials')
      .select('*');

    // 添加搜索条件
    if (search) {
      // 搜索名称和描述（模糊匹配）
      // 使用 ilike 进行不区分大小写的模糊搜索
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // 添加分类筛选
    if (category) {
      query = query.eq('category', category);
    }

    const { data: materials, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    // 为每个材料获取第一张产品图片
    const materialsWithImages = await Promise.all(
      (materials || []).map(async (material) => {
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

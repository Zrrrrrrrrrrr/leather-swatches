import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// 删除产品展示图
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ swatchId: string; imageId: string }> }
) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Supabase 未配置' }, { status: 503 });
    }

    const { imageId } = await params;
    
    const { error } = await supabase!
      .from('product_images')
      .delete()
      .eq('id', parseInt(imageId));

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete product image:', error);
    return NextResponse.json({ error: 'Failed to delete product image' }, { status: 500 });
  }
}

import { createClient } from '@supabase/supabase-js';

// 检查环境变量是否存在（构建时可能不存在）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 仅在环境变量存在时创建客户端
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// 数据库类型定义
export interface Database {
  materials: {
    id: number;
    name: string;
    description: string | null;
    category: string | null;
    created_at: string;
  };
  swatches: {
    id: number;
    material_id: number;
    color_name: string;
    color_code: string | null;
    description: string | null;
    price: number | null;
    stock: number;
    created_at: string;
  };
  product_images: {
    id: number;
    swatch_id: number;
    product_type: string;
    image_url: string;
    description: string | null;
    created_at: string;
  };
}

// 检查 Supabase 是否已配置
export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}

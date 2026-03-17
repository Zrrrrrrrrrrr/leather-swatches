-- Supabase 数据库表结构
-- 在 Supabase Dashboard → SQL Editor 中执行此脚本

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 材料表
CREATE TABLE IF NOT EXISTS materials (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 色卡表
CREATE TABLE IF NOT EXISTS swatches (
  id BIGSERIAL PRIMARY KEY,
  material_id BIGINT REFERENCES materials(id) ON DELETE CASCADE,
  color_name VARCHAR(255) NOT NULL,
  color_code VARCHAR(20),
  description TEXT,
  price DECIMAL(10, 2),
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 产品图片表
CREATE TABLE IF NOT EXISTS product_images (
  id BIGSERIAL PRIMARY KEY,
  swatch_id BIGINT REFERENCES swatches(id) ON DELETE CASCADE,
  product_type VARCHAR(50) NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引以加速查询
CREATE INDEX IF NOT EXISTS idx_swatches_material_id ON swatches(material_id);
CREATE INDEX IF NOT EXISTS idx_product_images_swatch_id ON product_images(swatch_id);

-- 设置 Row Level Security (RLS)
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE swatches ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- 创建公开读取策略（允许匿名访问）
CREATE POLICY "Allow public read access on materials"
  ON materials FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on swatches"
  ON swatches FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on product_images"
  ON product_images FOR SELECT
  USING (true);

-- 创建公开写入策略（允许匿名插入 - 生产环境建议添加认证）
CREATE POLICY "Allow public insert on materials"
  ON materials FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public insert on swatches"
  ON swatches FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public insert on product_images"
  ON product_images FOR INSERT
  WITH CHECK (true);

-- 创建公开更新策略
CREATE POLICY "Allow public update on materials"
  ON materials FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public update on swatches"
  ON swatches FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public update on product_images"
  ON product_images FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 创建公开删除策略
CREATE POLICY "Allow public delete on materials"
  ON materials FOR DELETE
  USING (true);

CREATE POLICY "Allow public delete on swatches"
  ON swatches FOR DELETE
  USING (true);

CREATE POLICY "Allow public delete on product_images"
  ON product_images FOR DELETE
  USING (true);

-- 插入示例数据（可选）
-- INSERT INTO materials (name, description, category) VALUES 
--   ('意大利进口牛皮', '高品质意大利进口头层牛皮，纹理自然', '进口牛皮'),
--   ('国产羊皮', '柔软细腻的国产山羊皮', '国产皮料');

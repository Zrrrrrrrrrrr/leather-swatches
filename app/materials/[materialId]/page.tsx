'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Material {
  id: number;
  name: string;
  description: string | null;
  category: string | null;
}

interface Swatch {
  id: number;
  color_name: string;
  color_code: string | null;
  description: string | null;
  price: number | null;
  stock: number;
}

interface ProductImage {
  id: number;
  product_type: string;
  image_url: string;
  description: string | null;
}

// 图片放大 Modal 组件
function ImageModal({
  imageUrl,
  alt,
  onClose,
}: {
  imageUrl: string;
  alt: string;
  onClose: () => void;
}) {
  // 点击背景关闭
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // ESC 键关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl font-bold z-10"
        aria-label="关闭"
      >
        ×
      </button>
      <div className="max-w-5xl max-h-full">
        <img
          src={imageUrl}
          alt={alt}
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
        />
      </div>
    </div>
  );
}

export default function MaterialDetail() {
  const params = useParams();
  const materialId = params.materialId as string;

  const [material, setMaterial] = useState<Material | null>(null);
  const [swatches, setSwatches] = useState<Swatch[]>([]);
  const [selectedSwatch, setSelectedSwatch] = useState<Swatch | null>(null);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 调试：监听 selectedImage 变化
  useEffect(() => {
    console.log('selectedImage changed:', selectedImage);
  }, [selectedImage]);

  useEffect(() => {
    // 获取材料详情
    fetch('/api/materials')
      .then((res) => res.json())
      .then((materials: Material[]) => {
        const mat = materials.find((m) => m.id === parseInt(materialId));
        setMaterial(mat || null);
      });

    // 获取色卡选项
    fetch(`/api/materials/${materialId}/swatches`)
      .then((res) => res.json())
      .then((data: Swatch[]) => {
        setSwatches(data);
        if (data.length > 0) {
          setSelectedSwatch(data[0]);
        }
        setLoading(false);
      });
  }, [materialId]);

  useEffect(() => {
    if (selectedSwatch) {
      // 获取选中色卡的产品展示图
      fetch(`/api/swatches/${selectedSwatch.id}/images`)
        .then((res) => res.json())
        .then((data: ProductImage[]) => {
          setProductImages(data);
        });
    }
  }, [selectedSwatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-amber-700">加载中...</p>
        </div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-amber-900 text-xl mb-4">材料不存在</p>
          <Link href="/" className="text-amber-600 hover:underline">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/" className="text-amber-600 hover:underline mb-4 inline-block">
            ← 返回
          </Link>
          <h1 className="text-3xl font-bold text-amber-900">{material.name}</h1>
          {material.category && (
            <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm mt-2">
              {material.category}
            </span>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {material.description && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-amber-900 mb-3">材料介绍</h2>
            <p className="text-amber-700">{material.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 色卡选择 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-amber-900 mb-4">选择色卡</h2>
            {swatches.length === 0 ? (
              <p className="text-amber-700">暂无色卡选项</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {swatches.map((swatch) => (
                  <button
                    key={swatch.id}
                    onClick={() => setSelectedSwatch(swatch)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedSwatch?.id === swatch.id
                        ? 'border-amber-600 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    {swatch.color_code && (
                      <div
                        className="w-full h-12 rounded mb-2"
                        style={{ backgroundColor: swatch.color_code }}
                      ></div>
                    )}
                    <p className="font-medium text-amber-900">{swatch.color_name}</p>
                    {swatch.price && (
                      <p className="text-sm text-amber-600">¥{swatch.price}</p>
                    )}
                  </button>
                ))}
              </div>
            )}

            {selectedSwatch && (
              <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                <h3 className="font-semibold text-amber-900 mb-2">详细信息</h3>
                {selectedSwatch.description && (
                  <p className="text-amber-700 mb-2">{selectedSwatch.description}</p>
                )}
                <div className="text-sm text-amber-600">
                  {selectedSwatch.stock > 0 ? (
                    <p>库存：{selectedSwatch.stock}件</p>
                  ) : (
                    <p className="text-red-600">缺货</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 产品展示图 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-amber-900 mb-4">产品展示</h2>
            {productImages.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl">📷</span>
                <p className="text-amber-700 mt-4">暂无产品展示图</p>
              </div>
            ) : (
              <div className="space-y-4">
                {productImages.map((img) => (
                  <div key={img.id} className="border rounded-lg overflow-hidden">
                    <div
                      className="relative aspect-video bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer group"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('=== Click image ===');
                        console.log('Image URL:', img.image_url);
                        console.log('Setting selectedImage to:', img.image_url);
                        setSelectedImage(img.image_url);
                        console.log('selectedImage state after set:', selectedImage);
                      }}
                    >
                      <img
                        src={img.image_url}
                        alt={`${img.product_type}展示`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNlOGQ3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjQwIiBmaWxsPSIjZGNkM2JhIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+4pSpPC90ZXh0Pjwvc3ZnPg==';
                        }}
                      />
                      {/* 悬停时显示放大提示 */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center pointer-events-none">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 px-4 py-2 rounded-lg flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">点击放大</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm mb-2">
                        {img.product_type}
                      </span>
                      {img.description && (
                        <p className="text-amber-700 text-sm">{img.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 图片放大 Modal */}
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          alt="产品放大图"
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}

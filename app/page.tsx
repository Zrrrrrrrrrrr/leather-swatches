'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Material {
  id: number;
  name: string;
  description: string | null;
  category: string | null;
  cover_image: string | null;
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
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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

export default function Home() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/materials')
      .then((res) => res.json())
      .then((data) => {
        setMaterials(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch materials:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-amber-900">🎨 皮革色卡推荐</h1>
            <Link
              href="/merchant"
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              商家入口
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-amber-900 mb-2">选择皮革材料</h2>
          <p className="text-amber-700">浏览我们的优质皮革材料，点击查看详情和色卡选项</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-amber-700">加载中...</p>
          </div>
        ) : materials.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-amber-700 text-lg">暂无皮革材料</p>
            <p className="text-amber-600 mt-2">请从商家入口添加材料</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <Link
                key={material.id}
                href={`/materials/${material.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="relative h-48 bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center overflow-hidden group">
                  {material.cover_image ? (
                    <>
                      <img
                        src={material.cover_image}
                        alt={material.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      {/* 悬停时显示放大提示 */}
                      <div
                        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center cursor-zoom-in"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedImage(material.cover_image);
                        }}
                      >
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 px-4 py-2 rounded-lg flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">点击放大</span>
                        </div>
                      </div>
                    </>
                  ) : null}
                  <span className={`text-6xl ${material.cover_image ? 'hidden' : ''}`}>👜</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-amber-900 mb-2">{material.name}</h3>
                  {material.category && (
                    <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm mb-2">
                      {material.category}
                    </span>
                  )}
                  {material.description && (
                    <p className="text-amber-700 text-sm line-clamp-2">{material.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-white mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-amber-700">
          <p>© 2026 皮革色卡推荐系统</p>
        </div>
      </footer>

      {/* 图片放大 Modal */}
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          alt="材料封面放大图"
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}

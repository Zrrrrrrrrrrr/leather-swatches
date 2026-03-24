'use client';

import { useState, useEffect } from 'react';
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
  swatch_id: number;
  product_type: string;
  image_url: string;
  description: string | null;
}

export default function MerchantDashboard() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [swatches, setSwatches] = useState<Swatch[]>([]);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [showAddSwatch, setShowAddSwatch] = useState(false);
  
  // 编辑状态
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [editingSwatch, setEditingSwatch] = useState<Swatch | null>(null);
  const [editMaterialForm, setEditMaterialForm] = useState({ name: '', description: '', category: '' });
  const [editSwatchForm, setEditSwatchForm] = useState({
    color_name: '',
    color_code: '#8B4513',
    description: '',
    price: '',
    stock: '',
  });
  
  // 图片管理状态
  const [managingImageSwatch, setManagingImageSwatch] = useState<Swatch | null>(null);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [newImage, setNewImage] = useState({ product_type: 'bag', image_url: '', description: '' });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 表单状态
  const [newMaterial, setNewMaterial] = useState({ name: '', description: '', category: '' });
  const [newSwatch, setNewSwatch] = useState({
    color_name: '',
    color_code: '#8B4513',
    description: '',
    price: '',
    stock: '0',
  });

  // 组件挂载时加载材料列表
  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = () => {
    fetch('/api/materials')
      .then((res) => res.json())
      .then((data: Material[]) => {
        setMaterials(data);
      });
  };

  const loadSwatches = (materialId: number) => {
    fetch(`/api/materials/${materialId}/swatches`)
      .then((res) => res.json())
      .then((data: Swatch[]) => {
        setSwatches(data);
      });
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMaterial),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          alert('材料添加成功！');
          setNewMaterial({ name: '', description: '', category: '' });
          setShowAddMaterial(false);
          loadMaterials();
        } else {
          alert('添加失败：' + data.error);
        }
      });
  };

  const handleSelectMaterial = (material: Material) => {
    setSelectedMaterial(material);
    loadSwatches(material.id);
  };

  const handleAddSwatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial) return;

    fetch(`/api/materials/${selectedMaterial.id}/swatches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newSwatch,
        price: parseFloat(newSwatch.price) || null,
        stock: parseInt(newSwatch.stock) || 0,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          alert('色卡添加成功！');
          setNewSwatch({ color_name: '', color_code: '#8B4513', description: '', price: '', stock: '0' });
          setShowAddSwatch(false);
          loadSwatches(selectedMaterial.id);
        } else {
          alert('添加失败：' + data.error);
        }
      });
  };

  // 材料编辑功能
  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    setEditMaterialForm({
      name: material.name,
      description: material.description || '',
      category: material.category || '',
    });
  };

  const handleUpdateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMaterial) return;

    fetch('/api/materials', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingMaterial.id,
        ...editMaterialForm,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          alert('材料更新成功！');
          setEditingMaterial(null);
          loadMaterials();
          if (selectedMaterial?.id === editingMaterial.id) {
            setSelectedMaterial({ ...selectedMaterial, ...editMaterialForm });
          }
        } else {
          alert('更新失败：' + data.error);
        }
      });
  };

  const handleDeleteMaterial = (materialId: number, materialName: string) => {
    if (!confirm(`确定要删除材料"${materialName}"吗？\n注意：该材料下的所有色卡和产品图片也将被删除！`)) return;

    fetch(`/api/materials?id=${materialId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert('材料已删除');
          if (selectedMaterial?.id === materialId) {
            setSelectedMaterial(null);
            setSwatches([]);
          }
          loadMaterials();
        } else {
          alert('删除失败：' + data.error);
        }
      });
  };

  // 色卡编辑功能
  const handleEditSwatch = (swatch: Swatch) => {
    setEditingSwatch(swatch);
    setEditSwatchForm({
      color_name: swatch.color_name,
      color_code: swatch.color_code || '#8B4513',
      description: swatch.description || '',
      price: swatch.price?.toString() || '',
      stock: swatch.stock.toString(),
    });
  };

  const handleUpdateSwatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial || !editingSwatch) return;

    fetch(`/api/materials/${selectedMaterial.id}/swatches`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingSwatch.id,
        ...editSwatchForm,
        price: parseFloat(editSwatchForm.price) || null,
        stock: parseInt(editSwatchForm.stock) || 0,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          alert('色卡更新成功！');
          setEditingSwatch(null);
          loadSwatches(selectedMaterial.id);
        } else {
          alert('更新失败：' + data.error);
        }
      });
  };

  const handleDeleteSwatch = (swatchId: number, swatchName: string) => {
    if (!selectedMaterial) return;
    if (!confirm(`确定要删除色卡"${swatchName}"吗？\n注意：该色卡的所有产品图片也将被删除！`)) return;

    fetch(`/api/materials/${selectedMaterial.id}/swatches?id=${swatchId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert('色卡已删除');
          loadSwatches(selectedMaterial.id);
        } else {
          alert('删除失败：' + data.error);
        }
      });
  };

  // 图片管理函数
  const loadProductImages = (swatchId: number) => {
    fetch(`/api/swatches/${swatchId}/images`)
      .then((res) => res.json())
      .then((data: ProductImage[]) => {
        setProductImages(data);
      });
  };

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingImageSwatch) return;

    // 如果有选中的文件，先上传文件
    if (selectedFile) {
      setUploading(true);
      setUploadProgress('正在上传图片...');
      
      // 使用官方教程方式：直接发送文件，通过 query 参数传递文件名
      fetch(`/api/upload?filename=${selectedFile.name}`, {
        method: 'POST',
        body: selectedFile,
      })
        .then((res) => {
          // 检查 HTTP 状态码
          if (res.status === 413) {
            throw new Error('文件太大！最大支持 5MB。请压缩图片后重试。');
          }
          if (!res.ok) {
            throw new Error(`上传失败：${res.status} ${res.statusText}`);
          }
          return res.json();
        })
        .then((uploadData) => {
          if (uploadData.url) {
            setUploadProgress('上传成功，正在保存...');
            // 文件上传成功后，保存图片信息
            return fetch(`/api/swatches/${managingImageSwatch.id}/images`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                product_type: newImage.product_type,
                image_url: uploadData.url,
                description: newImage.description,
              }),
            });
          } else {
            throw new Error(uploadData.error || uploadData.message || '上传失败');
          }
        })
        .then((res) => res.json())
        .then((data) => {
          if (data.id) {
            alert('产品图片添加成功！');
            setNewImage({ product_type: 'bag', image_url: '', description: '' });
            setSelectedFile(null);
            setShowImageUpload(false);
            loadProductImages(managingImageSwatch.id);
          } else {
            alert('添加失败：' + (data.error || '未知错误'));
          }
        })
        .catch((err) => {
          console.error('Upload error:', err);
          // 显示友好的错误信息
          let errorMsg = '上传失败：';
          if (err.message?.includes('413') || err.message?.includes('文件太大')) {
            errorMsg = '❌ 文件太大！\n最大支持 5MB。\n\n建议：\n1. 使用图片压缩工具\n2. 或者拍摄更小的图片';
          } else if (err.message?.includes('token')) {
            errorMsg = '❌ 服务器配置错误\n请联系管理员检查 BLOB_READ_WRITE_TOKEN';
          } else {
            errorMsg += (err.message || '未知错误');
          }
          alert(errorMsg);
        })
        .finally(() => {
          setUploading(false);
          setUploadProgress('');
        });
    } else if (newImage.image_url) {
      // 如果没有文件，使用 URL 方式
      fetch(`/api/swatches/${managingImageSwatch.id}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newImage),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.id) {
            alert('产品图片添加成功！');
            setNewImage({ product_type: 'bag', image_url: '', description: '' });
            setShowImageUpload(false);
            loadProductImages(managingImageSwatch.id);
          } else {
            alert('添加失败：' + data.error);
          }
        });
    } else {
      alert('请选择图片或输入图片 URL');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 验证文件类型
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('只支持 JPG、PNG、GIF、WebP 格式');
        e.target.value = '';
        return;
      }
      // 验证文件大小（5MB）
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        const sizeMB = (file.size / 1024 / 1024).toFixed(2);
        alert(`文件太大！\n当前大小：${sizeMB}MB\n最大支持：5MB\n\n建议：\n1. 压缩图片后上传\n2. 或者使用更小的图片`);
        e.target.value = '';
        return;
      }
      // 显示文件信息
      const sizeKB = (file.size / 1024).toFixed(1);
      console.log('已选择文件:', {
        name: file.name,
        size: `${sizeKB} KB`,
        type: file.type
      });
      setSelectedFile(file);
    }
  };

  const handleDeleteImage = (imageId: number) => {
    if (!managingImageSwatch) return;
    if (!confirm('确定要删除这张产品图片吗？')) return;

    fetch(`/api/swatches/${managingImageSwatch.id}/images/${imageId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert('图片已删除');
          loadProductImages(managingImageSwatch.id);
        } else {
          alert('删除失败：' + data.error);
        }
      });
  };

  const openImageManager = (swatch: Swatch) => {
    setManagingImageSwatch(swatch);
    loadProductImages(swatch.id);
    setShowImageUpload(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🏪 商家管理后台</h1>
              <p className="text-gray-600 mt-1">管理皮革材料和色卡</p>
            </div>
            <Link
              href="/"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              返回用户端
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 材料列表 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">皮革材料</h2>
                <button
                  onClick={() => setShowAddMaterial(!showAddMaterial)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  {showAddMaterial ? '取消' : '+ 添加'}
                </button>
              </div>

              {showAddMaterial && (
                <form onSubmit={handleAddMaterial} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="材料名称 *"
                      value={newMaterial.name}
                      onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="分类"
                      value={newMaterial.category}
                      onChange={(e) => setNewMaterial({ ...newMaterial, category: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      placeholder="描述"
                      value={newMaterial.description}
                      onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                    >
                      确认添加
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    className={`group relative p-3 rounded-lg transition-colors ${
                      selectedMaterial?.id === material.id
                        ? 'bg-blue-50 border-blue-300 border'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <button
                      onClick={() => handleSelectMaterial(material)}
                      className="w-full text-left"
                    >
                      <p className="font-medium text-gray-900">{material.name}</p>
                      {material.category && (
                        <p className="text-sm text-gray-600">{material.category}</p>
                      )}
                    </button>
                    {/* 操作按钮 */}
                    <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditMaterial(material);
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="编辑"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMaterial(material.id, material.name);
                        }}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="删除"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 色卡管理 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              {selectedMaterial ? (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {selectedMaterial.name} - 色卡管理
                      </h2>
                      <p className="text-sm text-gray-600">管理该材料的颜色选项</p>
                    </div>
                    <button
                      onClick={() => setShowAddSwatch(!showAddSwatch)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      {showAddSwatch ? '取消' : '+ 添加色卡'}
                    </button>
                  </div>

                  {showAddSwatch && (
                    <form onSubmit={handleAddSwatch} className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="颜色名称 *"
                          value={newSwatch.color_name}
                          onChange={(e) => setNewSwatch({ ...newSwatch, color_name: e.target.value })}
                          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                        <input
                          type="color"
                          value={newSwatch.color_code}
                          onChange={(e) => setNewSwatch({ ...newSwatch, color_code: e.target.value })}
                          className="h-10 w-full border rounded-lg cursor-pointer"
                        />
                        <input
                          type="number"
                          placeholder="价格"
                          value={newSwatch.price}
                          onChange={(e) => setNewSwatch({ ...newSwatch, price: e.target.value })}
                          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <input
                          type="number"
                          placeholder="库存"
                          value={newSwatch.stock}
                          onChange={(e) => setNewSwatch({ ...newSwatch, stock: e.target.value })}
                          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <textarea
                          placeholder="描述"
                          value={newSwatch.description}
                          onChange={(e) => setNewSwatch({ ...newSwatch, description: e.target.value })}
                          className="col-span-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          rows={2}
                        />
                        <button
                          type="submit"
                          className="col-span-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
                        >
                          确认添加
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {swatches.map((swatch) => (
                      <div key={swatch.id} className="border rounded-lg p-4 bg-gray-50 relative group">
                        {/* 操作按钮 */}
                        <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditSwatch(swatch);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                            title="编辑"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSwatch(swatch.id, swatch.color_name);
                            }}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                            title="删除"
                          >
                            🗑️
                          </button>
                        </div>
                        <div
                          className="w-full h-20 rounded mb-3"
                          style={{ backgroundColor: swatch.color_code || '#ccc' }}
                        ></div>
                        <p className="font-semibold text-gray-900">{swatch.color_name}</p>
                        {swatch.price && <p className="text-green-600">¥{swatch.price}</p>}
                        <p className="text-sm text-gray-600">库存：{swatch.stock}</p>
                        {swatch.description && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{swatch.description}</p>
                        )}
                        <button
                          onClick={() => openImageManager(swatch)}
                          className="mt-3 text-sm text-blue-600 hover:underline"
                        >
                          管理产品图片 →
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <span className="text-6xl">👈</span>
                  <p className="text-gray-600 mt-4">请从左侧选择一个材料</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 材料编辑模态框 */}
        {editingMaterial && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">✏️ 编辑材料</h2>
                <form onSubmit={handleUpdateMaterial}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        材料名称 *
                      </label>
                      <input
                        type="text"
                        value={editMaterialForm.name}
                        onChange={(e) => setEditMaterialForm({ ...editMaterialForm, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        分类
                      </label>
                      <input
                        type="text"
                        value={editMaterialForm.category}
                        onChange={(e) => setEditMaterialForm({ ...editMaterialForm, category: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        描述
                      </label>
                      <textarea
                        value={editMaterialForm.description}
                        onChange={(e) => setEditMaterialForm({ ...editMaterialForm, description: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingMaterial(null)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition-colors"
                      >
                        取消
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                      >
                        保存
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* 色卡编辑模态框 */}
        {editingSwatch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">✏️ 编辑色卡</h2>
                <form onSubmit={handleUpdateSwatch}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        颜色名称 *
                      </label>
                      <input
                        type="text"
                        value={editSwatchForm.color_name}
                        onChange={(e) => setEditSwatchForm({ ...editSwatchForm, color_name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        颜色
                      </label>
                      <input
                        type="color"
                        value={editSwatchForm.color_code}
                        onChange={(e) => setEditSwatchForm({ ...editSwatchForm, color_code: e.target.value })}
                        className="h-10 w-full border rounded-lg cursor-pointer"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          价格
                        </label>
                        <input
                          type="number"
                          value={editSwatchForm.price}
                          onChange={(e) => setEditSwatchForm({ ...editSwatchForm, price: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          库存
                        </label>
                        <input
                          type="number"
                          value={editSwatchForm.stock}
                          onChange={(e) => setEditSwatchForm({ ...editSwatchForm, stock: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        描述
                      </label>
                      <textarea
                        value={editSwatchForm.description}
                        onChange={(e) => setEditSwatchForm({ ...editSwatchForm, description: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingSwatch(null)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition-colors"
                      >
                        取消
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
                      >
                        保存
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* 产品图片管理模态框 */}
        {managingImageSwatch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      📸 {managingImageSwatch.color_name} - 产品图片管理
                    </h2>
                    <p className="text-sm text-gray-600">
                      管理该款皮革色卡的产品展示图
                    </p>
                  </div>
                  <button
                    onClick={() => setManagingImageSwatch(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                {/* 添加图片按钮 */}
                <button
                  onClick={() => setShowImageUpload(!showImageUpload)}
                  className="mb-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {showImageUpload ? '取消添加' : '+ 添加产品图片'}
                </button>

                {/* 添加图片表单 */}
                {showImageUpload && (
                  <form onSubmit={handleAddImage} className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={newImage.product_type}
                        onChange={(e) => setNewImage({ ...newImage, product_type: e.target.value })}
                        className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="bag">手提包</option>
                        <option value="wallet">钱包</option>
                        <option value="belt">皮带</option>
                        <option value="shoes">鞋子</option>
                        <option value="jacket">夹克</option>
                        <option value="sofa">沙发</option>
                        <option value="chair">椅子</option>
                        <option value="car_interior">汽车内饰</option>
                        <option value="other">其他</option>
                      </select>
                      <div className="px-3 py-2 border rounded-lg bg-white">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          上传图片文件
                        </label>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          onChange={handleFileSelect}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {selectedFile && (
                          <p className="mt-2 text-sm text-green-600">
                            ✓ 已选择：{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                          </p>
                        )}
                      </div>
                      <div className="col-span-2 border-t pt-3 mt-2">
                        <p className="text-sm text-gray-600 mb-2">或者使用图片 URL：</p>
                        <input
                          type="url"
                          placeholder="图片 URL（可选，如果上传了文件则不需要）"
                          value={newImage.image_url}
                          onChange={(e) => setNewImage({ ...newImage, image_url: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <textarea
                        placeholder="描述（可选）"
                        value={newImage.description}
                        onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                        className="col-span-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                      />
                      <button
                        type="submit"
                        disabled={uploading}
                        className={`col-span-2 py-2 rounded-lg transition-colors ${
                          uploading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {uploading ? `⏳ ${uploadProgress}` : '确认添加'}
                      </button>
                    </div>
                  </form>
                )}

                {/* 图片列表 */}
                {productImages.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {productImages.map((img) => (
                      <div key={img.id} className="border rounded-lg overflow-hidden bg-gray-50">
                        <img
                          src={img.image_url}
                          alt={img.description || img.product_type}
                          className="w-full h-40 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTNlM2UzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==';
                          }}
                        />
                        <div className="p-3">
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">
                            {img.product_type}
                          </span>
                          {img.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">{img.description}</p>
                          )}
                          <button
                            onClick={() => handleDeleteImage(img.id)}
                            className="mt-2 text-sm text-red-600 hover:underline"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <span className="text-4xl">📷</span>
                    <p className="mt-2">暂无产品图片，点击上方按钮添加</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

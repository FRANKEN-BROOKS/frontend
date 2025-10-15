'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth/AuthContext';
import { categoryApi } from '@/lib/api/services';
import { Category, UserRole } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Plus, Edit, Trash2, Folder, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
}

export default function AdminCategoriesPage() {
  const { hasRole, isAuthenticated } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm<CategoryFormData>();

  useEffect(() => {
    if (!isAuthenticated || !hasRole(UserRole.ADMIN)) {
      router.push('/dashboard');
      return;
    }
    fetchCategories();
  }, [isAuthenticated]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    reset({ name: '', slug: '', description: '' });
    setShowModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    reset({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    });
    setShowModal(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await categoryApi.deleteCategory(categoryId);
      await fetchCategories();
      alert('Category deleted successfully!');
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category');
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    setSubmitting(true);
    try {
      if (selectedCategory) {
        await categoryApi.updateCategory(selectedCategory.id, data);
        alert('Category updated successfully!');
      } else {
        await categoryApi.createCategory(data);
        alert('Category created successfully!');
      }
      await fetchCategories();
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container-custom py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Category Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Organize courses into categories
                </p>
              </div>
              <Button onClick={handleAddCategory}>
                <Plus className="h-5 w-5 mr-2" />
                Add Category
              </Button>
            </div>
          </div>

          {/* Categories Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : categories.length === 0 ? (
            <div className="card p-12 text-center">
              <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No categories yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first category to organize courses
              </p>
              <Button onClick={handleAddCategory}>
                <Plus className="h-5 w-5 mr-2" />
                Add Category
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div key={category.id} className="card p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Folder className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>

                  {category.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  <div className="text-xs text-gray-500">
                    Slug: {category.slug}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Category Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedCategory ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Category Name"
            {...register('name', { required: true })}
            onChange={(e) => {
              setValue('slug', generateSlug(e.target.value));
            }}
            placeholder="e.g., Web Development"
          />

          <Input
            label="Slug"
            {...register('slug', { required: true })}
            placeholder="web-development"
            helperText="URL-friendly version of the name"
          />

          <Textarea
            label="Description"
            {...register('description')}
            rows={3}
            placeholder="Describe this category..."
          />

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {selectedCategory ? 'Update' : 'Create'} Category
            </Button>
          </div>
        </form>
      </Modal>

      <Footer />
    </div>
  );
}
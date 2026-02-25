"use client";

import {
  Plus,
  Search,
  Trash2,
  Edit,
  LayoutGrid
} from "lucide-react";
import { useEffect, useState } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/api/categories";
import toast from "react-hot-toast";
import CategoryModal, { Category, CategoryFormData } from "@/app/components/admin/CategoryModal";

export default function AdminCategories() {
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    status: "1",
  });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (category: Category | null = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || "",
        status: category.status ? category.status.toString() : "0",
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        description: "",
        status: "1",
      });
    }
    setImage(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("status", formData.status);

    if (image) {
      data.append("image", image);
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
        toast.success("Category updated successfully");
      } else {
        await createCategory(data);
        toast.success("Category added successfully");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Operation failed";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id);
      toast.success("Category deleted");
      fetchData();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Deletion failed";
      toast.error(errorMessage);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500">Manage your product categorization and icons.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex cursor-pointer items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm w-full focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Icon</th>
                <th className="px-6 py-4 font-semibold">Category Name</th>
                <th className="px-6 py-4 font-semibold">Description</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center">
                      {cat.images ? (
                        <img
                          src={`${API_URL?.replace("/api", "")}/${cat.images.replace(/\\/g, "/")}`}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <LayoutGrid size={20} className="text-gray-300" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">{cat.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{cat.description || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${Number(cat.status) === 1
                      ? "bg-green-50 text-green-600 border border-green-100"
                      : "bg-red-50 text-red-600 border border-red-100"
                      }`}>
                      {Number(cat.status) === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(cat)}
                        className="p-2 cursor-pointer text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-2 cursor-pointer text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingCategory={editingCategory}
        formData={formData}
        setFormData={setFormData}
        image={image}
        setImage={setImage}
      />
    </div>
  );
}

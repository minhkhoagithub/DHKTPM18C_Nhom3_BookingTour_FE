import React, { useEffect, useState } from "react";
import {
  getAllPostsAdmin,
  createGlobalPost,
  updatePost,
  deletePost,
} from "../../services/postService";

import { PlusCircle, Edit, Trash2, Eye } from "lucide-react";

import ArticleForm from "./ArticleForm";
import ArticlePreviewModal from "./ArticlePreviewModal";

const Articles = () => {
  const [posts, setPosts] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);

  // Modal
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const [previewPost, setPreviewPost] = useState(null);

  // ==========================
  // LOAD DATA
  // ==========================
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllPostsAdmin();

      setPosts(data);
      setFiltered(data);
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);


//   upload ảnh từ máy sau đó đẩy lên cloundinary
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "unsigned_preset"); // ĐỔI THEO PRESET CỦA BẠN

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dxi1bfgfw/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data.secure_url;
};

  // ==========================
  // SEARCH + FILTER
  // ==========================
  useEffect(() => {
    let data = [...posts];

    if (search.trim() !== "") {
      data = data.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "ALL") {
      data = data.filter((p) => p.status === statusFilter);
    }

    setFiltered(data);
  }, [search, statusFilter, posts]);

  // ==========================
  // DELETE
  // ==========================
  const handleDelete = async (postId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    try {
      await deletePost(postId);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================
  // START CREATE
  // ==========================
  const openCreate = () => {
    setEditingPost(null);
    setShowForm(true);
  };

  // ==========================
  // START EDIT
  // ==========================
  const openEdit = (post) => {
    setEditingPost(post);
    setShowForm(true);
  };

  if (loading)
    return <div className="text-center py-10">Đang tải danh sách bài viết...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Bài viết</h2>

        <button
          onClick={openCreate}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2"
        >
          <PlusCircle size={20} />
          <span>Viết bài mới</span>
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Tìm theo tiêu đề..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full sm:w-64"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">THUMBNAIL</th>
              <th className="px-4 py-2">TIÊU ĐỀ</th>
              <th className="px-4 py-2">TRẠNG THÁI</th>
              <th className="px-4 py-2 text-center">HÀNH ĐỘNG</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((post) => (
              <tr key={post.postId} className="border-b hover:bg-gray-50">

                <td className="px-4 py-2">
                    {post.thumbnailUrl ? (
                        <img
                        src={post.thumbnailUrl}
                        className="w-20 h-14 object-cover rounded"
                        />
                    ) : (
                        <div className="w-20 h-14 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded">
                        No Image
                        </div>
                    )}
                    </td>


                <td className="px-4 py-2 font-semibold">{post.title}</td>

                <td className="px-4 py-2">{post.status}</td>

                <td className="px-4 py-8 flex gap-3 justify-center">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => openEdit(post)}
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    className="text-green-600 hover:text-green-800"
                    onClick={() => setPreviewPost(post)}
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(post.postId)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALS */}
      {showForm && (
        <ArticleForm
          close={() => setShowForm(false)}
          reload={loadData}
          editing={editingPost}
          uploadImage={uploadImage}   
        />
      )}

      {previewPost && (
        <ArticlePreviewModal post={previewPost} close={() => setPreviewPost(null)} />
      )}

    </div>
  );
};

export default Articles;

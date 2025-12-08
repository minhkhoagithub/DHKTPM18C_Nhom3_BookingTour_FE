import React, { useState } from "react";
import { createGlobalPost, updatePost } from "../../services/postService";

const ArticleForm = ({ close, reload, editing }) => {
  const [title, setTitle] = useState(editing?.title || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(editing?.thumbnailUrl || "");
  const [content, setContent] = useState(editing?.content || "");
  const [status, setStatus] = useState(editing?.status || "PUBLISHED");

  // ======================
  // UPLOAD IMAGE TO CLOUDINARY
  // ======================
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_upload"); // Preset bạn tạo trong Cloudinary

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dxi1bfgfw/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (data.secure_url) return data.secure_url;

    console.error("Upload failed:", data);
    return "";
  };

  // ======================
  // SUBMIT FORM
  // ======================
  const handleSubmit = async () => {
    const postData = { title, thumbnailUrl, content, status };

    try {
      if (editing) {
        await updatePost(editing.postId, postData);
      } else {
        await createGlobalPost(postData);
      }
      reload();
      close();
    } catch (err) {
      console.error("Error saving post:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {editing ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
        </h2>

        {/* TITLE */}
        <label className="block mb-2">Tiêu đề</label>
        <input
          className="border px-3 py-2 rounded w-full mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* THUMBNAIL */}
        <label className="block mb-2">Thumbnail</label>

        <div className="flex items-center gap-3 mb-3">
          <input
            className="border px-3 py-2 rounded w-full"
            placeholder="Dán link ảnh hoặc upload…"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
          />

          <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Upload
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const url = await uploadImage(file);
                setThumbnailUrl(url);
              }}
            />
          </label>
        </div>

        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            className="w-full h-40 object-cover rounded border mb-3"
          />
        )}

        {/* CONTENT */}
        <label className="block mb-2">Nội dung</label>
        <textarea
          className="border px-3 py-2 rounded w-full h-40 mb-3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* STATUS */}
        <label className="block mb-2">Trạng thái</label>
        <select
          className="border px-3 py-2 rounded w-full mb-4"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
        </select>

        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={close}>
            Hủy
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSubmit}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleForm;

import { useEffect, useState } from "react";
import { getAllPosts } from "../../services/postService";
import { Link } from "react-router-dom";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  // Bỏ dấu + lowercase
  const normalize = (str) =>
    (str || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Không có dữ liệu";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Ngày không hợp lệ";

    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Load posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data);
        setFiltered(data);
      } catch (err) {
        console.error("Failed to load posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);


  useEffect(() => {
    const keyword = normalize(search.trim());

    if (!keyword) {
      setFiltered(posts);
      return;
    }

    const result = posts.filter((p) =>
      normalize(`${p.title} ${p.content} ${p.tourName || ""}`).includes(keyword)
    );

    setFiltered(result);
  }, [search, posts]);


  if (loading) {
    return <div className="text-center py-10">Đang tải bài viết...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Tất cả bài viết</h1>
      <input
        type="text"
        className="px-3 py-2 w-200 text-lg ml-50 mb-10 rounded-lg bg-white/60 backdrop-blur-md border border-gray-600 focus:ring-2 focus:ring-blue-400 outline-none transition"
        placeholder="Tìm bài viết, nội dung..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {posts.length === 0 && (
        <p className="text-center text-gray-500">Chưa có bài viết nào.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filtered.map((post) => (
          <Link
            key={post.postId}
            to={`/blog/${post.postId}`}
            className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
          >
            {post.thumbnailUrl && (
              <div className="overflow-hidden">
                <img
                  src={post.thumbnailUrl}
                  alt="thumbnail"
                  className="w-full h-68 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}

            <div className="p-5">
              <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>

              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {post.content?.length > 150
                  ? post.content.substring(0, 150) + "..."
                  : post.content}
              </p>

              <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
                <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-green-700 font-medium">
                  {post.status}
                </span>

                <span className="italic text-gray-500">
                  {post.tour
                    ? `Thuộc tour: ${post.tour?.title || post.tour?.tourId}`
                    : "Viết bởi Hà Như"}
                </span>
              </div>

              <span className="text-gray-400 block mt-2">
                🕒 {formatDate(post.createdAt)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

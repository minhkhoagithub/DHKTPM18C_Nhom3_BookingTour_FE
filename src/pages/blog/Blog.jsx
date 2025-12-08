import { useEffect, useState } from "react";
import { getAllPosts } from "../../services/postService";
import { Link } from "react-router-dom";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data);
      } catch (err) {
        console.error("Failed to load posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Đang tải bài viết...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Tất cả bài viết</h1>

      {posts.length === 0 && (
        <p className="text-center text-gray-500">Chưa có bài viết nào.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link
            key={post.postId}
            to={`/blog/${post.postId}`}
            className="
              group block bg-blue rounded-2xl overflow-hidden 
              shadow-md hover:shadow-xl 
              transition-all duration-300
            "
          >
            {/* Thumbnail */}
            {post.thumbnailUrl && (
              <div className="overflow-hidden">
                <img
                  src={post.thumbnailUrl}
                  alt="thumbnail"
                  className="
                    w-full h-68 object-cover 
                    transition-transform duration-300 
                    group-hover:scale-105
                  "
                />
              </div>
            )}

            <div className="p-5">
              {/* Title */}
              <h2
                className="
                    text-xl font-bold text-gray-900 
                    mb-2 
                    group-hover:text-blue-600 
                    transition-colors
                "
                >
                {post.title}
                </h2>


              {/* Short content */}
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {post.content?.length > 150
                  ? post.content.substring(0, 150) + "..."
                  : post.content}
              </p>

              {/* Footer info */}
              <div className="flex justify-between text-xs text-gray-500 ml-120">
                {/* <span className="bg-gray-100 px-2 py-1 rounded-lg"> */}
                  {/* {post.status} */}
                  {/* {"Xem chi tiết >>>"} */}
                {/* </span> */}

                <span className="italic">
                  {post.tour
                    ? `Tour: ${post.tour?.title || post.tour?.tourId}`
                    : "Viết bởi Hà Như"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

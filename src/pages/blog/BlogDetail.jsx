import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPostById } from "../../services/postService";
   import { Link } from "react-router-dom";

export default function BlogDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(postId);

        setPost(data);
      } catch (err) {
        console.error("Failed to load post detail:", err);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) return <div className="text-center py-10">Đang tải...</div>;
 


  return (
    <div className="max-w-4xl mx-auto py-10 px-4">

      {/* Thumbnail */}
      {post.thumbnailUrl && (
        <img
          src={post.thumbnailUrl}
          alt="thumbnail"
          className="w-full h-80 object-cover rounded mb-6"
        />
      )}

      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      {/* Created time */}
              <span className="text-gray-400 block mt-2">
                🕒 {formatDate(post.createdAt)}
              </span>
              {post.tourId && (
      <Link
        to={`/tour/${post.tourId}`}
        className="px-4 py-2 bg-blue-600 text-white rounded mt-6 inline-block"
      >
        Đặt tour ngay
      </Link>
    )}

<p className="text-gray-500 text-sm mb-4 mt-5">
  {post.tour
    ? `Thuộc tour: ${post.tour?.title || post.tour?.tourId}`
    : "Bài viết Global"}
</p>



      <div className="text-lg leading-relaxed whitespace-pre-line">
        {post.content}
      </div>

  <div className="text-lg leading-relaxed whitespace-pre-line">
  {post.content}
</div>






    </div>
    
  );
}

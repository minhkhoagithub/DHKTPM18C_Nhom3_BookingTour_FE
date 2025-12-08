import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPostById } from "../../services/postService";
   import { Link } from "react-router-dom";

export default function BlogDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(postId);
        console.log("BlogDetail render, id =", postId);

        setPost(data);
      } catch (err) {
        console.error("Failed to load post detail:", err);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) return <div className="text-center py-10">Đang tải...</div>;
  console.log("params =", useParams());


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

      <p className="text-gray-500 text-sm mb-4">
        {post.tour
          ? `Thuộc tour: ${post.tour?.title || post.tour?.tourId}`
          : "Bài viết Global"}
      </p>

      <div className="text-lg leading-relaxed whitespace-pre-line">
        {post.content}
      </div>
   


    </div>
    
  );
}

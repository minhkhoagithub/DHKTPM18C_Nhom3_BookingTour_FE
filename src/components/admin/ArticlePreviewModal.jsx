const ArticlePreviewModal = ({ post, close }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-auto shadow-xl">

        <h2 className="text-xl font-bold mb-2">{post.title}</h2>

        <img
          src={post.thumbnailUrl}
          className="w-full h-60 object-cover rounded mb-4"
        />

        <p className="text-gray-500 mb-4">{post.status}</p>

        <div className="whitespace-pre-line text-lg">
          {post.content}
        </div>

        <button
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded"
          onClick={close}
        >
          Đóng
        </button>

      </div>
    </div>
  );
};

export default ArticlePreviewModal;

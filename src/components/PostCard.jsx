import React from "react";
import PostActions from "./PostActions";
import { TrashIcon } from "@heroicons/react/24/outline";

const PostCard = ({ post, comments, onLike, onAddComment, currentUserId, onDelete }) => {
  // ✅ Safe fallback for user name and image
  console.log("post" ,post.userId );
  console.log("post" ,post.userId.image );

  
  const user = post.userId || {};
  console.log(post);
  console.log(user.image);
  
  const userImage = user.image
    ? `https://backend-mu-ten-26.vercel.app/uploads/${user.image}` // adjust if your user images are served from /uploads
    : null;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow">
      {/* Post header */}
      <div className="p-6 pb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {userImage ? (
            <img
              src={userImage}
              alt={user.name || "User"}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center ring-2 ring-gray-100">
              <span className="text-white font-semibold text-lg">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-gray-800">
              {user.name || "Anonymous"}
            </h3>
            <p className="text-gray-500 text-sm">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {isOwner && (
          <button
            onClick={() => onDelete(post._id)}
            className="text-gray-400 hover:text-red-500 cursor-pointer transition"
            title="Delete post"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        )}
      </div>


      {/* Post content */}
      <div className="px-6 pb-4">
        <p className="text-gray-800">{post.description}</p>
      </div>

      {/* Post images */}
      {post.images?.length > 0 && (
        <div className="relative overflow-hidden">
          {post.images.map((img, index) => (
            <img
              key={index}
              src={`https://backend-mu-ten-26.vercel.app/uploads/${img}`}
              alt={`Post image ${index + 1}`}
              className="w-full h-80 object-cover transition-transform duration-700 hover:scale-105"
            />
          ))}
        </div>
      )}

      {/* Post actions */}
      <PostActions
        post={post}
        likes={post.likes} // ✅ always use the updated post.likes
        comments={comments}
        onLike={onLike}
        onAddComment={onAddComment}
      />
    </div>
  );
};

export default PostCard;

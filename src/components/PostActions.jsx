import React from "react";
import LikeButton from "./LikeButton";
import CommentForm from "./CommentForm";

const PostActions = ({ post, comments, onLike, onAddComment }) => {
  const postComments = comments[post._id] || [];

  return (
    <div className="p-6 pt-4 border-t border-gray-100">
      {/* Like and comment count */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <LikeButton postId={post._id} likes={post.likes} onLike={onLike} />

          <span className="text-gray-600">
            💬 {postComments.length}
          </span>
        </div>
      </div>

      {/* Comment list */}
      <div className="space-y-3">
        {postComments.map((comment, index) => (
          <div
            key={comment._id || `local-${index}`}
            className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {comment.userId?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm">
                {comment.userId?.name || "User"}
              </p>
              <p className="text-gray-700 text-sm">{comment.text}</p>
              <p className="text-gray-400 text-xs">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Comment form */}
      <div className="mt-4">
        <CommentForm postId={post._id} onAddComment={onAddComment} />
      </div>
    </div>
  );
};

export default PostActions;

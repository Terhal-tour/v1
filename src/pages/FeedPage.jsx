import React, { useEffect, useState } from "react";
import axios from "axios";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import Spinner from "../components/Spinner";

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commentsByPost, setCommentsByPost] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("jwt");

        const postsRes = await axios.get("http://localhost:3000/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const commentsRes = await axios.get("http://localhost:3000/comments", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPosts(postsRes.data);

        const grouped = {};
        commentsRes.data.forEach((c) => {
          if (!grouped[c.postId]) grouped[c.postId] = [];
          grouped[c.postId].push(c);
        });
        setCommentsByPost(grouped);

      } catch (err) {
        console.error(err);
        alert("❌ Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLike = async (postId) => {
    try {
      const token = sessionStorage.getItem("jwt");
      await axios.put(
        `http://localhost:3000/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userId = JSON.parse(atob(token.split(".")[1])).id;

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            const alreadyLiked = post.likes.includes(userId);
            return {
              ...post,
              likes: alreadyLiked
                ? post.likes.filter((id) => id !== userId)
                : [...post.likes, userId],
            };
          }
          return post;
        })
      );
    } catch (err) {
      console.error(err);
      alert("❌ Error toggling like");
    }
  };

  const addLocalComment = (postId, comment) => {
    setCommentsByPost((prev) => ({
      ...prev,
      [postId]: prev[postId] ? [...prev[postId], comment] : [comment],
    }));
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <CreatePost />

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts yet.</p>
          </div>
        )}

        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            comments={commentsByPost}
            onLike={() => handleLike(post._id)}
            onAddComment={(comment) => addLocalComment(post._id, comment)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [profile, setProfile] = useState(null);


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
        // console.log("postsRes.data", postsRes.data);
        // console.log("Sample post:", postsRes.data[0]);


        setPosts(postsRes.data);

        const grouped = {};
        commentsRes.data.forEach((c) => {
          if (!grouped[c.postId]) grouped[c.postId] = [];
          grouped[c.postId].push(c);
        });
        setCommentsByPost(grouped);

        // ✅ Fetch profile too!
        const profileRes = await axios.get("http://localhost:3000/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // console.log("profileRes.data.user", profileRes.data.user);

        setProfile(profileRes.data.user);

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

  // const handlePostCreated = (newPost) => {
  //   setPosts((prev) => [newPost, ...prev]);
  // };

  const handlePostCreated = (newPost) => {
  if (newPost && newPost._id) {
    setPosts((prev) => [newPost, ...prev]);
  }
};  


  const handleDelete = async (postId) => {
  if (!window.confirm("Are you sure you want to delete this post?")) return;

  const token = sessionStorage.getItem("jwt");
  if (!token) return;

  try {
    await axios.delete(`http://localhost:3000/posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Remove post from UI:
    setPosts(posts.filter((p) => p._id !== postId));
    toast.success("Post deleted successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete post.");
  }
};


  if (loading || !profile) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <CreatePost onPostCreated={handlePostCreated} />

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts yet.</p>
          </div>
        )}

        {posts.filter(Boolean).map((post) => (
          <PostCard
            key={post._id}
            post={post}
            comments={commentsByPost}
            onLike={() => handleLike(post._id)}
            onAddComment={(comment) => addLocalComment(post._id, comment)}
            currentUserId={profile?._id}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedPage;

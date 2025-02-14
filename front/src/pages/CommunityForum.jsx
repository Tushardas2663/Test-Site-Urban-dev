import React, { useState, useEffect } from "react";
import axios from "axios";

const CommunityForum = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/comments");
      setComments(res.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handlePostComment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to post a comment.");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:5000/comments",
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      fetchComments(); // Refresh comments after posting
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h2>Community Forum</h2>

      {/* Input for new comment */}
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write your comment..."
        style={{ width: "100%", height: "50px", marginBottom: "10px" }}
      />
      <button onClick={handlePostComment}>Post</button>

      {/* Display comments */}
      <h3>Comments</h3>
      <div style={{ borderTop: "1px solid gray", paddingTop: "10px" }}>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} style={{ borderBottom: "1px solid lightgray", padding: "10px" }}>
              <p><strong>{comment.user}</strong>: {comment.content}</p>
              <p style={{ fontSize: "12px", color: "gray" }}>{new Date(comment.timestamp).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityForum;

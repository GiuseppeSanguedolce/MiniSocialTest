import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedBody, setEditedBody] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:3001/posts/byId/${id}`, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    }).then((response) => {
      setPostObject(response.data);
    });

    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, []);

  const addComment = () => {
    axios.post("http://localhost:3001/comments", {
      commentBody: newComment,
      PostId: id,
    }, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    }).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        const commentToAdd = { commentBody: newComment, username: authState.username };
        setComments([...comments, commentToAdd]);
        setNewComment("");
      }
    });
  };

  const deleteComment = (commentId) => {
    axios.delete(`http://localhost:3001/comments/${commentId}`, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    }).then(() => {
      setComments(comments.filter((c) => c.id !== commentId));
    });
  };

  const deletePost = () => {
    axios.delete(`http://localhost:3001/posts/${id}`, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    }).then(() => {
      alert("Post eliminato con successo");
      navigate("/");
    });
  };

  const updatePost = () => {
    axios.put(`http://localhost:3001/posts/${id}`, {
      title: editedTitle,
      postText: editedBody,
    }, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    }).then(() => {
      setPostObject({ ...postObject, title: editedTitle, postText: editedBody });
      setEditMode(false);
    });
  };

  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div className="title">
            {editMode ? (
              <input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
            ) : (
              postObject.title
            )}
          </div>
          <div className="body">
            {editMode ? (
              <textarea value={editedBody} onChange={(e) => setEditedBody(e.target.value)} />
            ) : (
              postObject.postText
            )}
          </div>
          <div className="footer">
            {postObject.User?.username}
            {authState.username === postObject.User?.username && (
              <>
                {!editMode ? (
                  <button onClick={() => {
                    setEditMode(true);
                    setEditedTitle(postObject.title);
                    setEditedBody(postObject.postText);
                  }}>
                    Modifica
                  </button>
                ) : (
                  <button onClick={updatePost}>Salva</button>
                )}
                <button onClick={deletePost}>Elimina</button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            autoComplete="off"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={addComment}>Aggiungi Commento</button>
        </div>

        <div className="listOfComments">
          {comments.map((comment, key) => (
            <div key={key} className="comment">
              {comment.commentBody}
              <label>Username: {comment.username}</label>
              {authState.username === comment.username && (
                <button onClick={() => deleteComment(comment.id)}>X</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Post;
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3001/auth/basicinfo/${id}`).then((res) => {
      setUsername(res.data.username);
    });

    axios.get(`http://localhost:3001/posts/byuserId/${id}`).then((res) => {
      setListOfPosts(res.data);
    });
  }, [id]);

  const likeAPost = (postId) => {
    axios
      .post(
        "http://localhost:3001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((res) => {
        alert(res.data);
      });
  };

  return (
    <div className="profilePageContainer">
      <div className="basicInfo">
        <h1>👤 Profilo di {username}</h1>
        {authState.username === username && (
          <button onClick={() => navigate("/changepassword")}>
            Cambia Password
          </button>
        )}
      </div>

      <div className="listOfPosts">
        {listOfPosts.map((value) => (
          <div className="post" key={value.id}>
            <div className="title">{value.title}</div>
            <div
              className="body"
              onClick={() => {
                navigate(`/post/${value.id}`);
              }}
            >
              {value.postText}
            </div>
            <div className="footer">
              {value.User?.username}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  likeAPost(value.id);
                }}
              >
                👍
              </button>
              <label>{value.Likes.length}</label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
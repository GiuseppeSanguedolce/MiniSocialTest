import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      axios.get("http://localhost:3001/posts").then((response) => {
        setListOfPosts(response.data);
      });
    }
  }, []);

  const likeAPost = (postId) => {
    axios.post(
      "http://localhost:3001/likes",
      { PostId: postId },
      { headers: { accessToken: localStorage.getItem("accessToken") } }
    ).then((response) => {
      alert(response.data);
      setListOfPosts(
        listOfPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              Likes: [...post.Likes, { UserId: authState.id }]
            };
          } else {
            return post;
          }
        })
      );
    });
  };

  return (
    <div>
      {listOfPosts.map((value) => {
        return (
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
              <Link
                to={`/profile/${value.UserId}`}
                
              >
                {value.User?.username}
              </Link>
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
        );
      })}
    </div>
  );
}

export default Home;
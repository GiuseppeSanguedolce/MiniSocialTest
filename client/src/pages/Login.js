import React, { useState, useContext } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useHistory} from "react-router-dom";
import {AuthContext} from"../helpers/AuthContext";

function Login() {
  // 🔐 Stati per memorizzare username e password inseriti dall’utente
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);


  const navigate = useNavigate();  // 🧠 Funzione che invia la richiesta al backend quando clicchi "Login"
  
  
  const login = () => {
    const data = { username: username, password: password };
    
    axios.post("http://localhost:3001/auth/login", data).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        // ✅ Salva solo il token nel localstorage
        localStorage.setItem("accessToken", response.data.token);
        setAuthState({username:response.data.username, id:response.data.id, status:true});
        navigate("/");        
      }
    });
  };

  return (
    <div className="loginContainer">
      <h2>Login</h2>

      <input 
        type="text"
        placeholder="Username"
        onChange={(event) => setUsername(event.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(event) => setPassword(event.target.value)}
      />

      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;
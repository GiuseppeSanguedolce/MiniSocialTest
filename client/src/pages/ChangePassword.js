import React, { useState } from "react";
import axios from "axios";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const changePassword = () => {
    axios
      .put("http://localhost:3001/auth/changepassword",
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          alert("Password aggiornata con successo!");
          setOldPassword("");
          setNewPassword("");
        }
      });
  };

  return (
    <div className="changePassword">
      <h1>Change Your Password</h1>
      <input
        type="password"
        placeholder="Old Password..."
        value={oldPassword}
        onChange={(event) => {
          setOldPassword(event.target.value);
        }}
      />
      <input
        type="password"
        placeholder="New Password..."
        value={newPassword}
        onChange={(event) => {
          setNewPassword(event.target.value);
        }}
      />
      <button onClick={changePassword}>Save Changes</button>
    </div>
  );
}

export default ChangePassword;
import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("")
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [recheckPassword, setRecheckPassword] = useState("");
  const navigate = useNavigate();

  const signupClick = async (event) => {
    event.preventDefault();

    // Kiểm tra tính khớp của mật khẩu
    if (password !== recheckPassword) {
      toast.error("パスワードが一致しません。再度確認してください。", {
        autoClose: 2500,
      });
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_DOMAIN}users/signup`, {
        name,
        gmail: userName,
        password,
        confirmPassword: recheckPassword,
        role: 'user',
        nationality: 'japanese'
      })
      toast.success("登録ができました。", {
        autoClose: 2500,
      });
      setTimeout(navigate("/login"), 1000);
    } catch (error) {
      console.error(error);
      toast.error("ユーザーが発生しました。", {
        autoClose: 2500,
      });
    }
  };

  return (
    <section className="signup">
      <div className="wrap">
        <div className="signup-image">
          <img
            src="kissaten.jpg"
            alt=""
          />
        </div>
        <div className="signup-form">
          <div className="heading">
            <div className="image">
              <img
                src="https://www.pngmart.com/files/1/Coffee-Logo-Transparent-Background.png"
                alt=""
                srcset=""
              />
            </div>
            <h3>サインアップ</h3>
          </div>
          <form onSubmit={signupClick}>
            <div className="form-group">
              <div className="title">お名前</div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <div className="title">ユーザー名</div>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <div className="title">パスワード</div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <div className="title">パスワードの再確認</div>
              <input
                type="password"
                value={recheckPassword}
                onChange={(e) => setRecheckPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <button type="submit" value="Submit">
                サインアップ
              </button>
            </div>
            <a href="/login">すでにメンバーですか？ログイン</a>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signup;

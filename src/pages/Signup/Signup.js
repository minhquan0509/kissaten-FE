import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
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
      const response = await fetch("https://localhost:7263/api/User/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          userName: userName,
          password: password,
          gmail: "",
        }),
      });

      if (response.status === 200) {
        toast.success("登録が成功しました。", {
          autoClose: 2500,
        });
        navigate("/login");
        console.log("signup added successfully");
      } else {
        toast.error("登録に失敗しました。登録情報を再確認してください。", {
          autoClose: 2500,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("ユーザー登録リクエストの送信中にエラーが発生しました。", {
        autoClose: 2500,
      });
    }
  };

  return (
    <section className="signup">
      <div className="wrap">
        <div className="signup-image">
          <img
            src="https://images.pexels.com/photos/683039/pexels-photo-683039.jpeg?cs=srgb&dl=pexels-afta-putta-gunawan-683039.jpg&fm=jpg"
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

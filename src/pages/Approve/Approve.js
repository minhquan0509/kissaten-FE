import React, { useState, useEffect } from "react";
import axios from "axios";
import Showrating from "../../components/Rating/showrating";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import "./approve.css";

const Approve = () => {
  const [shop, setShop] = useState([]);
  const navigate = useNavigate();
  const [change, setChange] = useState(false);

  useEffect(() => {
    const axiosGetshop = async () => {
      const response = await axios.post(
        `https://localhost:7263/api/CoffeeShop/SortCoffeeShopSortBy/All`
      );
      const data = await response.data;
      const filteredShop = data.filter((item) => item.approved === 0);
      setShop(filteredShop);
    };
    axiosGetshop();
    setChange(true);
  }, [change]);

  return (
    <section className="approve">
      <div className="wrap">
        <h2 className="approve-title">承認画面</h2>

        {shop.length > 0 ? (
          shop.map((item, index) => {
            const denyShop = (e) => {
              e.stopPropagation();
              try {
                const cancelShop = async () => {
                  const reponse = await axios.delete(
                    `https://localhost:7263/api/CoffeeShop/DeleteCoffeeShop/${item.id}`
                  );
                  if (reponse.status === 200) {
                    toast.success("拒否しました。", {
                      autoClose: 2500, // Đóng sau 2 giây
                    });
                    setChange(false);
                  } else {
                    toast.error("エラーが発生しました。", {
                      autoClose: 2500, // Đóng sau 2 giây
                    });
                  }
                };
                cancelShop();
              } catch (error) {
                toast.error("エラーが発生しました。", {
                  autoClose: 2500, // Đóng sau 2 giây
                });
              }
            };

            const approveShop = async (e) => {
              e.stopPropagation();
              try {
                const response = await fetch(
                  "https://localhost:7263/api/CoffeeShop/EditCoffeeShop",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Accept: "application/json",
                      "Access-Control-Allow-Origin": "*",
                    },

                    body: JSON.stringify({
                      id: item.id,
                      name: null,
                      address: null,
                      gmail: null,
                      contactNumber: null,
                      imageCover: null,
                      averageRating: null,
                      openHour: null,
                      closeHour: null,
                      service: item.service,
                      description: null,
                      status: item.status,
                      postedByUser: null,
                      approved: 1,
                    }),
                  }
                );
                if (response.status === 200) {
                  toast.success("編集を作成しました。", {
                    autoClose: 2500, // Đóng sau 2 giây
                  });
                  setChange(false);
                  //console.log("Shop added successfully");
                } else {
                  toast.error("エラーが発生しました。", {
                    autoClose: 2500, // Đóng sau 2 giây
                  });
                }
              } catch (error) {
                console.error(error);
                toast.error("エラーが発生しました。", {
                  autoClose: 2500, // Đóng sau 2 giây
                });
              }
            };
            return (
              <div
                className="approve-item"
                key={index}
                onClick={() => navigate(`/inforshop/${item.id}`)}
              >
                <div className="image">
                  <img src={item.imageCover} alt="" />
                </div>
                <div className="content">
                  <div className="name">{item.name}</div>
                  <div className="rating">
                    <Showrating rating={item.averageRating} />
                  </div>
                  <div className="description">
                    <i className="fa-solid fa-location-dot"></i>
                    {item.address}
                  </div>
                  <div className="description">
                    <i className="fa-solid fa-clock"></i>
                    {item.openHour}-{item.closeHour} 毎日
                  </div>
                </div>
                <div className="buttons">
                  <button className="green" onClick={approveShop}>
                    確認
                  </button>
                  <button className="red" onClick={denyShop}>
                    キャンセル
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-results">
            <br></br>
            <br></br>承認を待っている喫茶店がありません。
          </div>
        )}
      </div>
      {shop.length > 6 && (
        <div className="approve-pagination">
          <a className="page" href="!">
            <i className="fa-solid fa-chevron-left"></i>
          </a>
          <a className="page" href="!">
            1
          </a>
          <a className="page" href="!">
            2
          </a>
          <a className="page" href="!">
            3
          </a>
          <a className="page" href="!">
            <i className="fa-solid fa-chevron-right"></i>
          </a>
        </div>
      )}
    </section>
  );
};

export default Approve;

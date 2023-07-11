import React, { useState, useEffect } from "react";
import "./inforShop.css";

import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "axios";
import Showrating from "../../components/Rating/showrating";
import RatingStar from "../../components/Rating/ratingstar";
import UpdateStore from "../../components/Update/updateStore";
import DeletePopup from "../../components/DeletePopup/DeletePopup";
// import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import "react-slideshow-image/dist/styles.css";
import { Slide } from 'react-slideshow-image';

const InforShop = () => {
  const [shopInfo, setShopInfo] = useState(null);
  const [review, setReview] = useState([]);
  const [isDetailMode, setChange] = useState(true);
  const { id } = useParams();
  const numberId = parseInt(id);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const user = useSelector((state) => state.login.user);
  const token = useSelector((state) => state.login.token);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const bookmarkedItemIds = useSelector((state) => state.login.user.bookmarks);

// Lấy giá trị bookmarkedItemIds từ Redux store trong useEffect
  useEffect(() => {
    setIsBookmarked(bookmarkedItemIds?.includes(numberId));
  }, [bookmarkedItemIds, numberId]);

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isPopupOpen1, setPopupOpen1] = useState(false);

  const handleEditClick = () => {
    setPopupOpen(true);
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
  };

  const handleDeleteClick = () => {
    setPopupOpen1(true);
  };

  const handlePopupClose1 = () => {
    setPopupOpen1(false);
  };

  const axiosShopInfo = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_DOMAIN}coffees/${id}/reviews/`
    );
    const data = response.data.data.coffee;
    console.log(data);
    setShopInfo(data);
    setReview(data.reviews);
  };

  useEffect(() => {
    axiosShopInfo();
  }, [numberId]);

  const [username, setUsername] = useState("");

  // useEffect(() => {
  //   const axiosReview = async () => {
  //     const response = await axios.get(
  //       `https://localhost:7263/api/Review/getReviewCoffeeShop/${numberId}`
  //     );
  //     const data = await response.data;
  //     setReview(data);
  //     // Lặp qua các đánh giá và lấy tên người dùng từ API
  //     const usernames = await Promise.all(
  //       data.map(async (review) => {
  //         const userResponse = await axios.get(
  //           `https://localhost:7263/api/User/${review.userId}/getUserNameByUserId`
  //         );
  //         return userResponse.data;
  //       })
  //     );
  //     setUsername(usernames);
  //   };
  //   axiosReview();
  // }, [numberId,]);

  if (!shopInfo) {
    return <div>Loading...</div>;
  }

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleAddReview = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_DOMAIN}coffees/${id}/reviews`, {
        review: comment,
        rating
      }, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
      axiosShopInfo();
      setRating(0);
      setComment("");
      //window.location.reload();
    } catch (error) {
      //setMessage("Error");
      console.error(error);
    }
  };

  return (
    <section className="inforShop">
      <div className="wrap">
        {/* Truy cập và sử dụng thông tin quán cà phê trong shopInfo */}
        <div className="inforShop-left">
          <div className="image-container">
            {isBookmarked && (
              <div className="bookmark-icon">
                <i className="fa-solid fa-bookmark fa-shake fa-xl" style={{ color: '#fad000' }}></i>
              </div>
            )}
            <Slide>
              {shopInfo.coffeeImages?.map((item, index) => (
                <div className="each-slide-effect">
                  <div className="slide-item" style={{ backgroundImage: `url(${process.env.REACT_APP_SERVER_DOMAIN}${item.image})` }}>
                  </div>
                </div>
              ))}
            </Slide>
            <div style={{ display: 'flex', marginBottom: '50px' }} className="">
              {
                shopInfo.coffeeImages?.map((item) => (
                  <div className="" style={{ width: '100%', padding: '10px', height: '100px'}}>
                    <img
                      src={`${process.env.REACT_APP_SERVER_DOMAIN}` + item.image}
                      style={{ width: '100%', height: '100%', margin: '0 5px', cursor: 'pointer', objectFit: 'contain', borderRadius: '2px' }}
                    />
                  </div>
                ))
              }
            </div>
            {/* <img src={`${process.env.REACT_APP_SERVER_DOMAIN}` + shopInfo.coffeeImages[0].image} alt="" /> */}
          </div>
          <div className="service">
            <h3 className="type">サービス</h3>
            <div className="buttons">
              {shopInfo.air_conditioner === true ? (
                <button className="btn">エアコン</button>
              ) : (
                <button className="btn">エアコンがない</button>
              )}
            </div>
            <div className="title">
              <h4>状態</h4>
              {shopInfo.is_crowded === true ? (
                <button className="btn">混んでいる</button>
              ) : (
                <button className="btn" style={{ background: "#3EB410"}}>混んでいない</button>
              )}
            </div>

            {(user?.username === "admin" || user?.id === shopInfo.posted_user) && (
              <div className="service">
                <h3>編集</h3>
                <div className="buttons">
                  <button
                    className="btn"
                    style={{ background: "#3EB489", marginRight: 0 }}
                    onClick={handleEditClick}
                  >
                    情報を編集
                  </button>
                  <button
                    className="btn"
                    style={{ background: "red" }}
                    onClick={handleDeleteClick}
                  >
                    喫茶店消去
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="inforShop-right">
          <h2>{shopInfo.name}</h2>
          {/* Hiển thị rating */}
          <div className="list-info title">エアコンの品質</div>
          <div className="rating">
            <Showrating rating={shopInfo.average_rating} />
          </div>
          <div className="buttons">
            {/* Đổi tên biến change thành isDetailMode để thể hiện chế độ hiển thị */}
            <button
              className={isDetailMode ? "btn active" : "btn"}
              onClick={() => setChange(true)}
            >
              ディテール
            </button>
            <button
              className={!isDetailMode ? "btn active" : "btn"}
              onClick={() => setChange(false)}
            >
              レビュー
            </button>
          </div>
          {/* Hiển thị thông tin quán hoặc nhận xét dựa trên chế độ */}
          {isDetailMode ? (
            <div className="list-info">
              <div className="info">
                <div className="title">アドレス</div>
                <p className="content">{shopInfo.address}</p>
              </div>
              <div className="info">
                <div className="title">営業時間</div>
                <p className="content">
                  {shopInfo.open_hour.slice(0, 5)}-{shopInfo.close_hour.slice(0, 5)} 毎日
                </p>
              </div>
              <div className="info">
                <div className="title">詳細な情報</div>
                <p className="content">{shopInfo.description}</p>
              </div>
            </div>
          ) : (
            <div className="comments">
              <div className="list">
                {review.map((review, index) => (
                  <div className="item" key={index}>
                    <div className="image">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                        alt=""
                      />
                    </div>
                    <div className="content">
                      <div className="top">
                        <div className="name">{review.user.name}</div>
                        <div className="status">
                          <div className="icon">
                            <span>(0)</span>{" "}
                            <i className="fa-solid fa-thumbs-up purple"></i>
                          </div>
                          <div className="icon">
                            <span>(0)</span>{" "}
                            <i className="fa-solid fa-thumbs-down red"></i>
                          </div>
                        </div>
                      </div>
                      <div className="bottom">
                        <div className="rating">
                          <Showrating rating={review.rating} />
                        </div>
                        <div className="text">{review.review}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="input-comment">
                <div className="list-info title">エアコンの評価</div>
                <RatingStar value={rating} onClick={handleRatingChange} />
                <textarea
                  name=""
                  id=""
                  cols="30"
                  rows="10"
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="エアコンの品質とコメントを評価してください。。。"
                ></textarea>
                <button className="btn" onClick={handleAddReview}>
                  投稿
                </button>
              </div>
            </div>
          )}
        </div>
        {isPopupOpen && <UpdateStore handlePopupClose={handlePopupClose} id={numberId} storeInfo={shopInfo}/>}
        {isPopupOpen1 && (
          <DeletePopup handlePopupClose1={handlePopupClose1} id={numberId} />
        )}
      </div>
    </section>
  );
};

export default InforShop;

import React, { useState, useEffect } from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";
import Bookmark from "../../components/Bookmark/bookmark";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Showrating from "../../components/Rating/showrating";
import { updateBookmarkedItemIds } from "../Login/loginActions";

const Home = () => {
  const user = useSelector((state) => state.login.user);
  const bookmarkedItemIds = useSelector(
    (state) => state.login.bookmarkedItemIds
  );
  const dispatch = useDispatch();

  const [shop, setShop] = useState([]);
  const [pulldown, setPulldown] = useState('All');

  useEffect(() => {
    const axiosGetshop = async () => {
      const response = await axios.post(
        `https://localhost:7263/api/CoffeeShop/SortCoffeeShopSortBy/${pulldown}`
      );
      const data = await response.data;
      const filteredShop = data.filter(item => item.approved === 1);
      setShop(filteredShop);
    };
    axiosGetshop();
  }, [pulldown]);

  const handlePulldownChange = (event) => {
    const selectedValue = event.target.value;
    setPulldown(selectedValue);
  };

  useEffect(() => {
    const axiosGetBookmarkedItemIds = async () => {
      if (user) {
        const response = await axios.post(
          `https://localhost:7263/api/BookMark/${user?.uid}/getListBookMark`
        );
        const data = await response.data;
        const bookmarkedItemIds = data.map((item) => item.id);
        dispatch(updateBookmarkedItemIds(bookmarkedItemIds));
      }
    };
    axiosGetBookmarkedItemIds();
  }, [user, dispatch]);

  const handleBookmarkClick = async (itemId) => {
    if (bookmarkedItemIds.includes(itemId)) {
      await axios.delete(
        `https://localhost:7263/api/BookMark/DeleteBookMarkById/${user?.uid}/${itemId}`
      );
      dispatch(
        updateBookmarkedItemIds(bookmarkedItemIds.filter((id) => id !== itemId))
      );
    } else {
      await axios.post(
        `https://localhost:7263/api/BookMark/${user?.uid}/AddBookMark/${itemId}`
      );
      dispatch(updateBookmarkedItemIds([...bookmarkedItemIds, itemId]));
    }
  };

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const shopsPerPage = 6;

  // Tính chỉ số các shop trong danh sách cần hiển thị trên trang hiện tại
  const indexOfLastShop = currentPage * shopsPerPage;
  const indexOfFirstShop = indexOfLastShop - shopsPerPage;
  const currentShops = shop.slice(indexOfFirstShop, indexOfLastShop);

  // Tạo mảng phân trang dựa trên số lượng coffee shop và số lượng shop trên mỗi trang
  const pageNumbers = Array.from(
    { length: Math.ceil(shop.length / shopsPerPage) },
    (_, index) => index + 1
  );

  // Hàm chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (!shop) {
    return <div>Loading...</div>;
  }

  return (
    <section className="home">
      <div className="wrap">
        <div className="home-heading">
          <h2 className="title">ホームページ</h2>
          <div className="filter">
            <label>Sort by</label>
            <select name="" id="" value={pulldown} onChange={handlePulldownChange}>
  <option value="All">全部</option>
  <option value="Rating">平均評価 ↑</option>
  <option value="RatingDown">平均評価 ↓</option>
</select>
          </div>
        </div>
        <div className="home-list">
          {currentShops.map((item, index) => {
            return (
              user ? (<div
                className="home-item"
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
                  <Bookmark
                    isBookmarked={bookmarkedItemIds.includes(item.id)}
                    handleBookmarkClick={handleBookmarkClick}
                    itemId={item.id}
                  />
              </div>):(<div
                className="home-item"
                key={index}
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
              </div>)
            );
          })}
        </div>
        {shop.length > 6 && <div className="home-pagination">
          <div className="page">
            <i className="fa-solid fa-chevron-left"></i>
          </div>
          {pageNumbers.map((number) => (
            <div
              className={`page${number === currentPage ? " active" : ""}`}
              key={number}
              onClick={() => paginate(number)}
            >
              {number}
            </div>
          ))}
          <div className="page">
            <i className="fa-solid fa-chevron-right"></i>
          </div>
        </div>}
      </div>
    </section>
  );
};

export default Home;

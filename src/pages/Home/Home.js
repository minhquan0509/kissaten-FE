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
  const token = useSelector((state) => state.login.token);
  const bookmarkedItemIds = useSelector(
    (state) => state.login.bookmarkedItemIds
  );
  const dispatch = useDispatch();

  const [shop, setShop] = useState([]);
  const [initialShop, setInitialShop] = useState([]);
  const [pulldown, setPulldown] = useState('All');

  useEffect(() => {
    const getCoffeeShops = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_DOMAIN}coffees`
      );
      const data = await response.data.data.coffees;
      setShop(data);
      setInitialShop(data);
    };
    getCoffeeShops();
    console.log(process.env.REACT_APP_SERVER_DOMAIN)
  }, []);

  const handlePulldownChange = (event) => {
    const selectedValue = event.target.value;
    setPulldown(selectedValue);
    if(selectedValue == "RatingDown") {
      const modifiedList = initialShop.sort((a, b) => b.average_rating - a.average_rating);
      setShop(modifiedList);
    } else if (selectedValue == "All")
      setShop(initialShop);
    else if (selectedValue == "Rating") {
      const modifiedList = initialShop.sort((a, b) => a.average_rating - b.average_rating);
      setShop(modifiedList)
    }
  };

  useEffect(() => {
    const axiosGetBookmarkedItemIds = async () => {
      if (user) {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_DOMAIN}users/${user?.id}/bookmarks`
        );
        const data = await response.data.data.user.Bookmarks;
        const bookmarkedItemIds = data.length ? data.map((item) => item.coffee_id) : [];
        dispatch(updateBookmarkedItemIds(bookmarkedItemIds));
      }
    };
    axiosGetBookmarkedItemIds();
  }, [user, dispatch]);

  const handleBookmarkClick = async (itemId) => {
    if (bookmarkedItemIds.includes(itemId)) {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_DOMAIN}coffees/${itemId}/bookmarks`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );
      dispatch(
        updateBookmarkedItemIds(bookmarkedItemIds.filter((id) => id !== itemId))
      );
    } else {
      await axios.post(
        `${process.env.REACT_APP_SERVER_DOMAIN}coffees/${itemId}/bookmarks`, {}, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
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
                  <img src={process.env.REACT_APP_SERVER_DOMAIN + item.CoffeeImages[0].image} alt="" />
                </div>
                <div className="content">
                  <div className="name">{item.name}</div>
                  <div className="rating">
                    <Showrating rating={item.average_rating} />
                  </div>
                  <div className="description">
                    <i className="fa-solid fa-location-dot"></i>
                    {item.address}
                  </div>
                  <div className="description">
                    <i className="fa-solid fa-clock"></i>
                    {item.open_hour.slice(0, 5)} - {item.close_hour.slice(0, 5)} 毎日
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
                  <img src={`${process.env.REACT_APP_SERVER_DOMAIN}` + item.CoffeeImages[0].image} alt="" />
                </div>
                <div className="content">
                  <div className="name">{item.name}</div>
                  <div className="rating">
                    <Showrating rating={item.average_rating} />
                  </div>
                  <div className="description">
                    <i className="fa-solid fa-location-dot"></i>
                    {item.address}
                  </div>
                  <div className="description">
                    <i className="fa-solid fa-clock"></i>
                    {item.open_hour.slice(0, 5)} - {item.close_hour.slice(0, 5)} 毎日
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

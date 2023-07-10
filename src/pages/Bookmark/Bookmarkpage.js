import React, {useState, useEffect} from 'react'
import './bookmark.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Showrating from '../../components/Rating/showrating';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { deleteBookmark } from '../Login/loginActions';
import { updateBookmarkedItemIds } from "../Login/loginActions";
import Bookmark from '../../components/Bookmark/bookmark';


const Bookmarkpage = () => {
  const user = useSelector((state) => state.login.user);
  const bookmarkedItemIds = useSelector(state => state.login.bookmarkedItemIds);
  const token = useSelector(state => state.login.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [shop, setShop]= useState([]);
  const [initialShop, setInitialShop]= useState([]);
  const [pulldown, setPulldown] = useState([]);

  const axiosGetshop = async () => {
    const response = await axios.get(`http://localhost:3001/users/${user.id}/bookmarks`);
    const data = await response.data.data.user.Bookmarks;
    setShop(data.map(item => item.Coffee));
    setInitialShop(data.map(item => item.Coffee));
  }
  useEffect(() => {
    axiosGetshop();
  }, [user?.id]);

  useEffect(() => {
    const axiosGetBookmarkedItemIds = async () => {
      if (user) {
        const response = await axios.get(
          `http://localhost:3001/users/${user?.id}/bookmarks`
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
        `http://localhost:3001/coffees/${itemId}/bookmarks`, {
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
        `http://localhost:3001/coffees/${itemId}/bookmarks`, {}, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );
      dispatch(updateBookmarkedItemIds([...bookmarkedItemIds, itemId]));
    }
  };

  const handleOpeningHour = (e) => {
    if(e.target.value == 'isOpen') {
      const currentDateTime = new Date();
      const filteredData = shop.filter(coffeeShop => {
        const openTime = new Date(currentDateTime.toDateString() + ' ' + coffeeShop.open_hour);
        const closeTime = new Date(currentDateTime.toDateString() + ' ' + coffeeShop.close_hour);
        return currentDateTime >= openTime && currentDateTime <= closeTime;
      });
      setShop(filteredData)
    } else axiosGetshop();
  }

  const handleIsCrowed = (e) => {
    if(e.target.value == 'crowed') {
      const filteredData = initialShop.filter(coffeeShop => coffeeShop.is_crowded)
      setShop(filteredData)
    } else {
      const filteredData = initialShop.filter(coffeeShop => !coffeeShop.is_crowded)
      setShop(filteredData)
    }
  }

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

  return (
    <section className='bookmark'>
      <div className="wrap">
        <h2 className='bookmark-title'>
          ブックマーク
        </h2>
        <div className="filter">
          <label>Sort by</label>
          <select name="" id="" value={pulldown} onChange={handlePulldownChange}>
            <option value="All">全部</option>
            <option value="Rating">平均評価 ↑</option>
            <option value="RatingDown">平均評価 ↓</option>
          </select>
        </div>
        <div className="bookmark-content">
          <div className="bookmark-filter">
            <div className="box">
              <p className="title">フイルター</p>
              <i className="fa-solid fa-filter"></i>
            </div>
            <div className="filter">
              <div className="title">営業時間</div>
              <div className="form-control">
                <input value='all' id='row-1' type="radio" name='radio-1' defaultChecked onChange={handleOpeningHour}/>
                <label htmlFor="row-1"></label>
                <p className="text">すべて</p>
              </div>
              <div className="form-control">
                <input value='isOpen' id='row-2' type="radio" name='radio-1' onChange={handleOpeningHour}/>
                <label htmlFor="row-2"></label>
                <p className="text">開いています</p>
              </div>
            </div>
            <div className="filter">
              <div className="title">状況</div>
              <div className="form-control">
                <input value='crowed' id='row-3' type="radio" name='radio-2' defaultChecked onChange={handleIsCrowed}/>
                <label htmlFor="row-3"></label>
                <p className="text">混んでいる</p>
              </div>
              <div className="form-control">
                <input value='notCrowed' id='row-4' type="radio" name='radio-2' onChange={handleIsCrowed}/>
                <label htmlFor="row-4"></label>
                <p className="text">混んでいない</p>
              </div>
            </div>
          </div>
          <div className="bookmark-list">
            {currentShops.map((item, index) => {
            return (
              <div
                className="home-item"
                key={index}
                onClick={() => navigate(`/inforshop/${item.id}`)}
              >
                <div className="image">
                  <img src={'http://localhost:3001/' + item.CoffeeImages[0].image} alt="" />
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
                    {item.open_hour.slice(0, 5)}-{item.close_hour.slice(0, 5)} 毎日
                  </div>
                </div>
                <Bookmark
                  isBookmarked={bookmarkedItemIds.includes(item.id)}
                  handleBookmarkClick={handleBookmarkClick}
                  itemId={item.id}
                />
              </div>
            );
          })}
          </div>
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
  )
}

export default Bookmarkpage
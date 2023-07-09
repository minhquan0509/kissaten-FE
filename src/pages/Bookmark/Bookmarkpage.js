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

  return (
    <section className='bookmark'>
      <div className="wrap">
        <h2 className='bookmark-title'>
          ブックマーク
        </h2>
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
            {shop.map((item, index) => {
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
                    {item.open_hour}-{item.close_hour} 毎日
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
        {shop.length > 6 && <div className="approve-pagination">
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
        </div>}
      </div>
    </section>
  )
}

export default Bookmarkpage
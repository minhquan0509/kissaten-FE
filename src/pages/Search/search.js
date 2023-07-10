import React, { useState, useEffect } from 'react';
import './search.css'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import Showrating from '../../components/Rating/showrating';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Bookmark from '../../components/Bookmark/bookmark';
import { updateBookmarkedItemIds } from '../Login/loginActions';

const Search = () => {
  const user = useSelector((state) => state.login.user);
  const token = useSelector(state => state.login.token);
  const bookmarkedItemIds = useSelector(state => state.login.bookmarkedItemIds)
  const dispatch = useDispatch()
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const name = searchParams.get('name');
  const address = searchParams.get('address');
  const air_conditioner = searchParams.get('air_conditioner');
  const current_hour = searchParams.get('current_hour');
  const navigate = useNavigate();
  const [shopInfo, setShopInfo] = useState([]);


  const [currentPage, setCurrentPage] = useState(1);
  const shopsPerPage = 6;

  // Tính chỉ số các shop trong danh sách cần hiển thị trên trang hiện tại
  const indexOfLastShop = currentPage * shopsPerPage;
  const indexOfFirstShop = indexOfLastShop - shopsPerPage;
  const currentShops = shopInfo.slice(indexOfFirstShop, indexOfLastShop);

  // Tạo mảng phân trang dựa trên số lượng coffee shop và số lượng shop trên mỗi trang
  const pageNumbers = Array.from(
    { length: Math.ceil(shopInfo.length / shopsPerPage) },
    (_, index) => index + 1
  );

  // Hàm chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const axiosShopInfo = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/coffees/', {
            params: {
              name,
              address,
              air_conditioner,
              current_hour
            }
          }
        );
        if (response.status === 200) {
          const data = response.data.data.coffees;

          setShopInfo(data);
        } else {
          setShopInfo([]);
        }
      } catch (error) {
        console.error(error);
        setShopInfo([]);
      }
    };

    axiosShopInfo();
  }, [name, address, air_conditioner, current_hour]);

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

  return (
    <section className='search'>
      <div className='wrap'>
        <div className='search-heading'>
          <h2 className='title'>検索結果</h2>
        </div>
        <div className='search-list'>
          {currentShops.length > 0 ? (
            currentShops.map((item, index) => (
              <div
                className='home-item'
                key={index}
                onClick={() => (user && navigate(`/inforshop/${item.id}`))}
              >
                <div className='image'>
                  <img src={`http://localhost:3001/` + item.CoffeeImages[0].image} alt='' />
                </div>
                <div className='content'>
                  <div className='name'>{item.name}</div>
                  <div className='rating'>
                    <Showrating rating={item.average_rating} />
                  </div>
                  <div className='description'>
                    <i className='fa-solid fa-location-dot'></i>
                    {item.address}
                  </div>
                  <div className='description'>
                    <i className='fa-solid fa-clock'></i>
                    {item.open_hour}-{item.close_hour} 毎日
                  </div>
                </div>
                <Bookmark
                  isBookmarked={bookmarkedItemIds.includes(item.id)}
                  handleBookmarkClick={handleBookmarkClick}
                  itemId={item.id}
                />
              </div>
            ))
          ) : (
            <div className='no-results'>検索結果が見つかりません。</div>
          )}
        </div>
        {shopInfo.length > 6 && <div className="home-pagination">
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

export default Search;

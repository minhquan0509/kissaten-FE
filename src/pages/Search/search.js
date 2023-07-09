import React, { useState, useEffect } from 'react';
import './search.css'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import Showrating from '../../components/Rating/showrating';
import { useSelector } from 'react-redux';

const Search = () => {
  const user = useSelector((state) => state.login.user);
  const navigate = useNavigate();
  const [shopInfo, setShopInfo] = useState([]);
  const { cafeName, area, service, status } = useParams();
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();
  const formattedTime = `${currentHour}:${currentMinute < 10 ? '0' : ''}${currentMinute}`;

  const address = area === 'no' ? '' : area;
  const booleanValue = Boolean(service);

  useEffect(() => {
    const search = {
      name: cafeName,
      address: address,
      service: booleanValue,
    };

    const axiosShopInfo = async () => {
      try {
        const response = await axios.post(
          'https://localhost:7263/api/CoffeeShop/SearchCoffeeShop',
          JSON.stringify(search),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.status === 200) {
          const data = await response.data;
          let filteredShopInfo = data;

          if (status === null) {
            // Hiển thị tất cả quán
            filteredShopInfo = data;
          } else if (status === 'open') {
            // Kiểm tra điều kiện closeHour > formattedTime
            filteredShopInfo = data.filter((item) => item.closeHour.localeCompare(formattedTime, 'en', { numeric: true }) > 0);
          }

          setShopInfo(filteredShopInfo);
        } else {
          setShopInfo([]);
        }
      } catch (error) {
        console.error(error);
        setShopInfo([]);
      }
    };

    axiosShopInfo();
  }, [cafeName, address, booleanValue, status, formattedTime]);

  return (
    <section className='search'>
      <div className='wrap'>
        <div className='search-heading'>
          <h2 className='title'>検索結果</h2>
        </div>
        <div className='search-list'>
          {shopInfo.length > 0 ? (
            shopInfo.map((item, index) => (
              <div
                className='home-item'
                key={index}
                onClick={() => (user && navigate(`/inforshop/${item.id}`))}
              >
                <div className='image'>
                  <img src={item.imageCover} alt='' />
                </div>
                <div className='content'>
                  <div className='name'>{item.name}</div>
                  <div className='rating'>
                    <Showrating rating={item.averageRating} />
                  </div>
                  <div className='description'>
                    <i className='fa-solid fa-location-dot'></i>
                    {item.address}
                  </div>
                  <div className='description'>
                    <i className='fa-solid fa-clock'></i>
                    {item.openHour}-{item.closeHour} 毎日
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='no-results'>検索結果が見つかりませんでした。</div>
          )}
        </div>
        {shopInfo.length > 6 && (
          <div className='approve-pagination'>
            <a className='page' href='!'>
              <i className='fa-solid fa-chevron-left'></i>
            </a>
            <a className='page' href='!'>
              1
            </a>
            <a className='page' href='!'>
              2
            </a>
            <a className='page' href='!'>
              3
            </a>
            <a className='page' href='!'>
              <i className='fa-solid fa-chevron-right'></i>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default Search;

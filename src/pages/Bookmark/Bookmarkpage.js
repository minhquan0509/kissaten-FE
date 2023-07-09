import React, {useState, useEffect} from 'react'
import './bookmark.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Showrating from '../../components/Rating/showrating';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { deleteBookmark } from '../Login/loginActions';


const Bookmarkpage = () => {
  const user = useSelector((state) => state.login.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const [shop,setShop]= useState([]);
  useEffect(() => {
    const axiosGetshop = async () => {
    const response = await axios.post(`https://localhost:7263/api/BookMark/${user?.uid}/getListBookMark`);
    const data = await response.data;
    setShop(data);}
    axiosGetshop();
    }, [user?.uid]);

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
                <input id='row-1' type="radio" name='radio-1' defaultChecked />
                <label htmlFor="row-1"></label>
                <p className="text">すべて</p>
              </div>
              <div className="form-control">
                <input id='row-2' type="radio" name='radio-1' />
                <label htmlFor="row-2"></label>
                <p className="text">開いています</p>
              </div>
            </div>
            <div className="filter">
              <div className="title">サービス</div>
              <div className="form-control">
                <input id='row-3' type="radio" name='radio-2' defaultChecked />
                <label htmlFor="row-3"></label>
                <p className="text">すべて</p>
              </div>
              <div className="form-control">
                <input id='row-4' type="radio" name='radio-2' />
                <label htmlFor="row-4"></label>
                <p className="text">エアコン</p>
              </div>
            </div>
          </div>
          <div className="bookmark-list">
            {shop.map((item, index) => {
              const handleDeleteMark = (e) => {
                e.stopPropagation();
                const axiosDeleteMark = async () => {
                  await axios.delete(`https://localhost:7263/api/BookMark/DeleteBookMarkById/${user?.uid}/${item.id}`);
                };
                axiosDeleteMark();
                dispatch(deleteBookmark(item.id));
                window.location.reload();
              };
            return (
              <div
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
                <div className="icon">
                <i
                  className="fa-solid fa-bookmark fa-shake fa-xl"
                  style={{ color: "#fad000" }}
                  onClick={handleDeleteMark}
                ></i></div>
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
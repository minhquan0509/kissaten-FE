import React, { useState } from 'react';
import './header.css'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MenuDropdown from '../MenuDropdown/MenuDropdown'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Header = () => {
  const user = useSelector((state) => state.login.user);
  const token = useSelector(state => state.login.token);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [cafeName, setCafeName] = useState("");
  const [area, setArea] = useState("");
  const [hasAC, setHasAC] = useState(false);
  
  const [status, setStatus] = useState("open");
  const navigate = useNavigate();
  

  const handleSearchClick = () => {
    setPopupOpen(true);
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
  };

  const handleStatusChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === "open") {
      setStatus("open");
    } else {
      setStatus(null);
    }
  };

  const handleHasACChange = (e) => {
    if (e.target.checked) {
      setHasAC(true);
    } else {
      setHasAC(false);
    }
  };

  const handleSearchSubmit = () => {
    setPopupOpen(false);
    const date = new Date().toLocaleTimeString('en-US', { hour12: false });
    // navigate(`/search/${cafeName}/${area}/${hasAC}/${status}`);
    navigate(`/search?` + (cafeName.length > 0 ? `name=${cafeName}&` : '') + (area.length > 0 ? `address=${area}&` : '') + (hasAC == true ? `air_conditioner=true&` : '') + (status === "open" ? `current_hour=${date}&` : ''))
  }; 

  const handleAddClick = () => {
    setPopupOpen1(true);
  };

  const handlePopupClose1 = () => {
    setPopupOpen1(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
    const reader = new FileReader();

    reader.onload = () => {
      setImageCover(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const [isPopupOpen1, setPopupOpen1] = useState(false);
  const [imageCover, setImageCover] = useState(null);
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [open_hour, setopen_hour] = useState('');
  const [close_hour, setclose_hour] = useState('');
  const [description, setDescription] = useState('');
  const [service, setService] = useState('');
  const [address, setAddress] = useState('');
  const boolservice = (service.toLowerCase() === "true");

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      // const response = await fetch(
      //   "https://localhost:7263/api/CoffeeShop/AddCoffeeShop",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Accept: "application/json",
      //       "Access-Control-Allow-Origin": "*",
      //     },

      //     body: JSON.stringify({
      //       name: name,
      //       address: address,
      //       gmail: "string",
      //       contactNumber: 0,
      //       imageCover: imageCover,
      //       average_rating: 0,
      //       open_hour: open_hour,
      //       close_hour: close_hour,
      //       service: boolservice,
      //       description: description,
      //       status: false,
      //       postedByUser: user.id,
      //       approved: 0,
      //     }),
      //   }
      // );
      const formattedName = name.replace(/\s+/g, '').toLowerCase();
      const email = `${formattedName}@gmail.com`;

      const formData = new FormData();
      formData.append("name", name);
      formData.append("address", address);
      formData.append("contactNumber", '0123456789');
      formData.append("open_hour", open_hour);
      formData.append("close_hour", close_hour);
      formData.append("air_conditioner", service == 'true');
      formData.append("description", description);
      formData.append("email", email);
      formData.append("images", image);

      const response = await axios.post(`http://localhost:3001/coffees`, formData, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
      toast.success('喫茶店が追加を作成しました。', {
        autoClose: 2500, // Đóng sau 2 giây
      });
      setPopupOpen1(false)
      setTimeout(() => {
        navigate('/');
      }, 1000)
    } catch (error) {
      console.error(error);
      toast.error('喫茶店の追加中にエラーが発生しました。',{
        autoClose: 2500, // Đóng sau 2 giây
      });
    }
  };

  return (
    <header className="header">
      <div className="wrapper">
        <div className="header-logo" onClick={() => navigate(`/`)}>
          <div className="image">
            <img
              src="	https://www.pngmart.com/files/1/Coffee-Logo-Transparent-Background.png"
              alt=""
            />
          </div>
          <div className="name">KISSATEN</div>
        </div>
        {user ? (<div className="header-search">
          <div className="form-input">
            <input type="text" placeholder="検索" />
            <button className="btn" onClick={handleSearchClick}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>):(<div className="preheader-search">
          <div className="form-input">
            <input type="text" placeholder="検索" />
            <button className="btn" onClick={handleSearchClick}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>)}
        <div className="header-login">
          {user? (
          <MenuDropdown username={user?.name}/>):(
          <button className="btn" onClick={() => navigate(`/login`)}>
            <i className="fa-solid fa-user"></i> <strong>ログイン</strong>
          </button>)}
        </div>
        {user&& <div className="header-add">
          <button className="btn" onClick={handleAddClick}>
            <i className="fa-solid fa-plus"> 喫茶店</i>
          </button>
        </div>}
      </div>
      {isPopupOpen && (
        <div className="search-popup">
          <div className="popup-content">
            <h2>検索</h2>
            <button className="close-button" onClick={handlePopupClose}>
              <i className="fa-sharp fa-solid fa-xmark"></i>
            </button>
            <form onSubmit={handleSearchSubmit}>
              <div className="form-group">
                <label htmlFor="cafe-name">喫茶店の名:</label>
                <input
                  type="text"
                  id="cafe-name"
                  value={cafeName}
                  onChange={(e) => setCafeName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="area">検索エリア:</label>
                <input
                  type="text"
                  id="area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  
                />
              </div>

              <div className="left-section">
                <li>
                  <label>営業時間:</label>
                  <section>
                    <input
                      type="radio"
                      className="form-check-input"
                      name="status"
                      id="status1"
                      value="open"
                      checked={status === "open"}
                      onChange={handleStatusChange}
                    />
                    <label className="form-check-label" htmlFor="status1">
                      開いている
                    </label>
                  </section>
                  <section>
                    <input
                      type="radio"
                      className="form-check-input"
                      name="status"
                      id="status2"
                      value="all"
                      checked={status !== "open"}
                      onChange={handleStatusChange}
                    />
                    <label className="form-check-label" htmlFor="status2">
                      すべて
                    </label>
                  </section>
                </li>
              </div>

              <div className="right-section">
                <li>
                  <label>サービス:</label>
                  <section>
                    <input
                      type="checkbox"
                      className="checkbox"
                      id="has-ac"
                      checked={hasAC}
                      onChange={handleHasACChange}
                    />
                    <label className="checkbox-label" htmlFor="has-ac">
                      エアコン
                    </label>
                  </section>
                </li>
              </div>

              <div className="button-group">
                <button type="submit">検索</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPopupOpen1 && (
        <div className="search-popup">
          <div className="popup-content">
            <h2>Thêm Quán</h2>
            <form>
              <button className="close-button" onClick={handlePopupClose1}>
                <i className="fa-sharp fa-solid fa-xmark"></i>
              </button>
              <div className="left-section1">
                <div className="form-group">
                  <label htmlFor="name">Tên quán:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group time">
                  <label htmlFor="opening-time">Giờ mở cửa:</label>
                  <select
                    id="opening-time"
                    name="opening-time"
                    required
                    value={open_hour}
                    onChange={(e) => setopen_hour(e.target.value)}
                  >
                    <option value="">Chọn giờ mở</option>
                  <option value="08:00">08:00</option>
                    <option value="08:30">08:30</option>
                    <option value="09:00">09:00</option>
                    <option value="09:30">09:30</option>
                    <option value="10:00">10:00</option>
                  </select>
                </div>
                <div className="form-group time">
                  <label htmlFor="closing-time">Giờ đóng cửa:</label>
                  <select
                    id="closing-time"
                    name="closing-time"
                    required
                    value={close_hour}
                    onChange={(e) => setclose_hour(e.target.value)}
                  >
                    <option value="">Chọn giờ đóng</option>
                  <option value="20:00">20:00</option>
                    <option value="20:30">20:30</option>
                    <option value="21:00">21:00</option>
                    <option value="21:30">21:30</option>
                    <option value="22:00">22:00</option>
                    <option value="22:30">22:30</option>
                    <option value="23:00">23:00</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="description-label" htmlFor="description">
                    Giới thiệu:
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    cols="30"
                    rows="10"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="right-section1">
                <div className="form-group">
                  <label htmlFor="service">Dịch vụ:</label>
                  <select
                    id="service"
                    name="service"
                    required
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                  >=
                    <option value="true">Có điều hòa</option>
                    <option value="false">Không có điều hòa</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="address">Địa chỉ:</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  ></input>
                </div>
                <div className="form-group">
                  <label htmlFor="image">Hình ảnh:</label>
                </div>
                <div className="square form-group">
                  {imageCover ? (
                    <div className="image-square">
                      <img src={imageCover} alt="Uploaded" className="image" />
                    </div>
                  ) : (
                    <label htmlFor="image-upload" className="upload-label">
                      <div className="plus">+</div>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="file-input"
                        required
                      />
                    </label>
                  )}
                </div>

                <button
                  className="add-button"
                  type="submit"
                  onClick={handleAddSubmit}
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header
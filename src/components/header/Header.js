import React, { useState } from 'react';
import './header.css'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MenuDropdown from '../MenuDropdown/MenuDropdown'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
  const user = useSelector((state) => state.login.user);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [cafeName, setCafeName] = useState("");
  const [area, setArea] = useState(" ");
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
    if(area===" ") {setArea("no")};
    if(status===null) {setStatus("all")};
    navigate(`/search/${cafeName}/${area}/${hasAC}/${status}`);
  }; 

  const handleAddClick = () => {
    setPopupOpen1(true);
  };

  const handlePopupClose1 = () => {
    setPopupOpen1(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImageCover(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const [isPopupOpen1, setPopupOpen1] = useState(false);
  const [imageCover, setImageCover] = useState(null);
  const [name, setName] = useState('');
  const [openHour, setOpenHour] = useState('');
  const [closeHour, setCloseHour] = useState('');
  const [description, setDescription] = useState('');
  const [service, setService] = useState('');
  const [address, setAddress] = useState('');
  const boolservice = (service.toLowerCase() === "true");

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://localhost:7263/api/CoffeeShop/AddCoffeeShop",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },

          body: JSON.stringify({
            name: name,
            address: address,
            gmail: "string",
            contactNumber: 0,
            imageCover: imageCover,
            averageRating: 0,
            openHour: openHour,
            closeHour: closeHour,
            service: boolservice,
            description: description,
            status: false,
            postedByUser: user.uid,
            approved: 0,
          }),
        }
      );
      if (response.status === 200) {
        toast.success('喫茶店が追加を作成しました。', {
          autoClose: 2500, // Đóng sau 2 giây
        });
        console.log("Shop added successfully");
      } else {
        toast.error('喫茶店の追加中にエラーが発生しました。',{
          autoClose: 2500, // Đóng sau 2 giây
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('喫茶店の追加中にエラーが発生しました。',{
        autoClose: 2500, // Đóng sau 2 giây
      });
    }
  };

  return (
    <header className="header">
      <div className="wrap">
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
          <MenuDropdown username={user?.username}/>):(
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
                  required
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
                    value={openHour}
                    onChange={(e) => setOpenHour(e.target.value)}
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
                    value={closeHour}
                    onChange={(e) => setCloseHour(e.target.value)}
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
                  >
                    <option value=""></option>
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
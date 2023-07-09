import React, { useState , useEffect } from "react";

import axios from "axios";
import { toast } from 'react-toastify';
import "./updateStore.css";

const UpdateStore = ({ handlePopupClose,id,uid }) => {
  const [shopInfo, setShopInfo] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState(''); // Giá trị ban đầu của ô địa chỉ
  const [service, setService] = useState(''); 
  const [open, setOpenHour] = useState('');
  const [close, setCloseHour] = useState('');

  useEffect(() => {
    const axiosShopInfo = async () => {
      const response = await axios.post(
        `https://localhost:7263/api/CoffeeShop/GetInfoCoffeeShop/${id}`
      );
      const data = await response.data;
      setShopInfo(data);
      //console.log(data);
    };
    axiosShopInfo();
  }, [id]);

  useEffect(() => {
      setImageUrl(shopInfo&& shopInfo.imageCover ?shopInfo.imageCover:'');
      setProductName(shopInfo&& shopInfo.name?shopInfo.name:'');
      setDescription(shopInfo&& shopInfo.description?shopInfo.description:'');
      setAddress(shopInfo&& shopInfo.address?shopInfo.address:'');
      setOpenHour(shopInfo&& shopInfo.openHour?shopInfo.openHour:'');
      setCloseHour(shopInfo&& shopInfo.closeHour?shopInfo.closeHour:'');
      setService(shopInfo&& shopInfo.service?shopInfo.service:'');
      setStatus(shopInfo&& shopInfo.status?shopInfo.status:'');
  }, [shopInfo]); 

  //console.log(open);
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImageUrl(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleProductNameChange = (event) => {
    setProductName(event.target.value); // Cập nhật giá trị tên sản phẩm khi người dùng thay đổi ô input
  };
 // Giá trị ban đầu của ô giới thiệu

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value); // Cập nhật giá trị ô giới thiệu khi người dùng thay đổi ô input
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value); // Cập nhật giá trị địa chỉ khi người dùng thay đổi ô input
  };

  const handleOpenChange = (event) => {
    setOpenHour(event.target.value); // Cập nhật giá trị địa chỉ khi người dùng thay đổi ô input
  };
  
  const handleCloseChange = (event) => {
    setCloseHour(event.target.value); // Cập nhật giá trị địa chỉ khi người dùng thay đổi ô input
  };

  const handleStatusChange = (e) => {
    if (e.target.checked) {
      setStatus(true);
    } else {
      setStatus(false);
    }
  };

  const handleClick = (e) => {
    e.preventDefault(); // Ngăn chặn lan truyền sự kiện onclick
    handlePopupClose();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://localhost:7263/api/CoffeeShop/EditCoffeeShop",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },

          body: JSON.stringify({
            id: id,
            name: productName,
            address: address,
            gmail: "string",
            contactNumber: 0,
            imageCover: imageUrl,
            averageRating: null,
            openHour: open,
            closeHour: close,
            service: service,
            description: description,
            status: status,
            postedByUser: null,
            approved: null,
          }),
        }
      );
      if (response.status === 200) {
        toast.success('編集を作成しました。', {
          autoClose: 2500, // Đóng sau 2 giây
        });
        window.location.reload();
        //console.log("Shop added successfully");
      } else {
        toast.error('エラーが発生しました。',{
          autoClose: 2500, // Đóng sau 2 giây
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('エラーが発生しました。',{
        autoClose: 2500, // Đóng sau 2 giây
      });
    }
  };

  return (
    <section className="updatePopup">
      <div className="update-popup">
        <div className="update-content">
          <h2>Chỉnh sửa quán</h2>
          <button className="close-button" onClick={handleClick}>
              <i className="fa-sharp fa-solid fa-xmark"></i>
            </button>
          <form>
            <div className="left-section">
              <div className="form-group">
                <label htmlFor="name">Tên quán:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={productName}
                  onChange={handleProductNameChange}
                  required
                />
              </div>
              <div className="form-group time">
                <label htmlFor="opening-time">Giờ mở cửa:</label>
                <select id="opening-time" name="opening-time" onChange={handleOpenChange} value={open} >
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
                <select id="closing-time" name="closing-time" onChange={handleCloseChange} value={close}>
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
                  value={description}
                  onChange={handleDescriptionChange}
                  required
                ></textarea>
              </div>
            </div>
            <div className="right-section">
              <div className="form-group">
                <label htmlFor="service">Dịch vụ:</label>
                <select id="service" name="service" value={service} required>
                  <option value="">Chọn dịch vụ</option>
                  <option value={true}>Có điều hòa</option>
                    <option value={false}>Không có điều hòa</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="address">Địa chỉ:</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={address}
                  onChange={handleAddressChange}
                  required
                ></input>
              </div>
              <div className="form-group">
                <label htmlFor="image">Hình ảnh:</label>
              </div>
              <div className="square form-group">
                {imageUrl ? (
                  <div className="image-square">
                    <img src={imageUrl} alt="Uploaded" className="image" />
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
              <div className="form-group">
                <label htmlFor="status" id="status-label">
                  Tình trạng:
                </label>
                Quán đông
                <input type="checkbox" id="status" name="status" checked={status}
                      onChange={handleStatusChange}></input>
              </div>
            </div>
          </form>
          <button className="add-button" onClick={handleEditSubmit}>Update</button>
        </div>
      </div>
    </section>
  );
};

export default UpdateStore;

import { useNavigate } from "react-router-dom";
import "./DeletePopup.css";
import { toast } from 'react-toastify';

import axios from "axios";
import { useSelector } from "react-redux";

const DeletePopup = ({handlePopupClose1,id}) => {
  const token = useSelector(state => state.login.token)
  const navigate = useNavigate();
  const onClose = () => {
      handlePopupClose1();
    };
  const onDelete = () => {
    const cancelShop = async () => {
        try {
          const response = await axios.delete(`http://localhost:3001/coffees/${id}`, {
            headers: {
              Authorization: 'Bearer ' + token
            }
          });
          toast.success('削除ができまました。', {
            autoClose: 2500, // Đóng sau 2 giây
          });
          navigate("/");
        } catch (error) {
          toast.error('エラーが発生しました。',{
              autoClose: 2500, // Đóng sau 2 giây
            });
        }
      };
    cancelShop();
  };
  return (
    <div className="delete-popup">
      <div className="delete-content">
        <h3>Bạn chắc chắn muốn xóa quán?</h3>
        <button className="close-button" onClick={onClose}>
            <i className="fa-sharp fa-solid fa-xmark"></i>
          </button>
          <div className="button-container">
          <button className="delete-button" onClick={onDelete}>
            Xóa
          </button>
          <button className="cancel-button" onClick={onClose}>
            Hủy
          </button>
          </div>
      </div>
    </div>
  );
};

export default DeletePopup;
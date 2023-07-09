import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const login = (username, password, navigateToHome) => {
  return async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });

    try {
      const response = await axios.post('http://localhost:3001/users/login', {
        gmail: username,
        password: password,
      });

      if (response.status === 200) {
        // Đăng nhập thành công
        const user = response.data.data.currentUser;
        const token = response.data.token

        // Lưu thông tin đăng nhập vào localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', JSON.stringify(token));

        dispatch({ type: LOGIN_SUCCESS, payload: {user, token} });
        toast.success('ログインに成功しました。', {
          autoClose: 2500, // Đóng sau 2 giây
        });
        navigateToHome();
      } else {
        // Xử lý lỗi đăng nhập
        dispatch({ type: LOGIN_FAILURE, error: response.message });
        toast.error(response.message, {
          autoClose: 2500, // Đóng sau 2 giây
        });
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu đăng nhập:', error);
      // Xử lý lỗi và dispatch action LOGIN_FAILURE
      dispatch({ type: LOGIN_FAILURE, error: error });
      // Hiển thị popup thông báo lỗi
      toast.error('ログインリクエストの送信中にエラーが発生しました。',{
        autoClose: 2500, // Đóng sau 2 giây
      });
    }
  };
};

export const logout = () => {
  // Xóa thông tin đăng nhập khỏi localStorage
  localStorage.removeItem('user');

  return { type: 'LOGOUT' };
};

export const deleteBookmark = (itemId) => {
  return {
    type: 'DELETE_BOOKMARK',
    payload: itemId,
  };
};

export const updateBookmarkedItemIds = (bookmarkedItemIds) => {
  return {
    type: 'UPDATE_BOOKMARKED_ITEM_IDS',
    payload: bookmarkedItemIds,
  };
};
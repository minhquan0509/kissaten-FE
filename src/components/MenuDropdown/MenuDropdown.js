import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { logout } from '../../pages/Login/loginActions';
import './MenuDropdown.css';

const MenuDropdown = ({ username }) => {
  const user = useSelector((state) => state.login.user);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const handleMenuClick = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate(`/`);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="menu-dropdown" ref={menuRef}>
      <button className="btn" onClick={handleMenuClick}>
        <i className="fa-solid fa-user"></i> <strong>{username}</strong>
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <ul>
          {(user?.username === "admin") && (
            <li onClick={() => navigate('/approve')}><strong>Approve</strong></li>
            )}
            <li onClick={() => navigate('/bookmark')}><strong>Bookmark</strong></li>
            <li onClick={handleLogout}><strong>Logout</strong></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MenuDropdown;

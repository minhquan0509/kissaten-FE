import React from 'react'
import { Routes, Route  } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

import Header from './components/header/Header';
import InforShop from './pages/InforShop/InforShop';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Bookmarkpage from './pages/Bookmark/Bookmarkpage';
import Approve from './pages/Approve/Approve';
import Search from './pages/Search/search';

import './App.css';

const App = () => {
  const user = useSelector((state) => state.login.user);

  return (
    <div className="App">
       <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        {user&& <Route
          path="/inforshop/:id"
          element={
            <div>
              <Header/>
              <InforShop />
            </div>
          }
        />}
        {user&&<Route
          path="/bookmark"
          element={
            <div>
              <Header/>
              <Bookmarkpage />
            </div>
          }
        />}
        {user?.username === 'admin' && <Route
          path="/approve"
          element={
            <div>
              <Header/>
              <Approve />
            </div>
          }
        />}
        <Route
          path="/search/:cafeName/:area/:service/:status"
          element={
            <div>
              <Header/>
              <Search />
            </div>
          }
        />
        <Route
          path="/signup"
          element={
            <div>
              <Signup />
            </div>
          }
        />
        <Route
          path="/"
          element={
            <div>
              <Header/>
              <Home />
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default App;

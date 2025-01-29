import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Navbar from "./components/Navbar";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";

export const serverURL = import.meta.env.VITE_BACKEND_URL ;
const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);
  return (
    <div className='min-h-screen w-full'>
      <ToastContainer/>
      {token ? (
        <>
          {" "}
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full  gap-10 '>
            <Sidebar />
            <div className='py-5 w-full'>
              <Routes>
                <Route
                  path='/add'
                  element={<Add token={token} />}
                />
                <Route path='/list' element={<List token={token} />} />
                <Route
                  path='/orders'
                  element={<Orders token={token} />}
                />
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <>
          <Login setToken={setToken} />
        </>
      )}
    </div>
  );
};

export default App;
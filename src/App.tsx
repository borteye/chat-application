import React, { FC } from "react";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import { useSelector } from "react-redux";
import { selectDisplayName } from "./features/userSlice";

const App: FC = () => {
  const user = useSelector(selectDisplayName);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create-account" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

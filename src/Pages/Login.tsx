import React, { FC, useState } from "react";
import loginImage from "../assets/loginImg.jpg";
import loading from "../assets/loading.gif";
import {
  UserIcon,
  KeyIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/24/solid";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GitHubLoginAuth, NormalLoginAuth } from "../auth/auth";

const Login: FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [normalLoginLoading, setNormalLoginLoading] = useState<boolean>(false);
  const [gitLoginLoading, setGitLoginLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //* This function allows the user to login
  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    NormalLoginAuth(dispatch, navigate, email, password, setNormalLoginLoading);
  };

  const handleGithubLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    GitHubLoginAuth(dispatch, navigate, setGitLoginLoading);
  };
  return (
    <div className="bg-ultimate md:bg-none bg-cover bg-center h-screen  flex justify-center items-center">
      <img
        src={loginImage}
        alt="loginImage"
        loading="lazy"
        className="w-6/12 h-screen object-cover hidden md:block"
      />
      <section className="w-full h-screen flex flex-col  justify-center bg-[#00000096] md:bg-[white] relative ">
        <h1 className="font-bold flex justify-center text-4xl text-white md:text-black">
          User Login
        </h1>
        <form
          className="my-12 flex flex-col gap-6 justify-center items-center"
          onSubmit={handleUserLogin}
        >
          <div className="flex min-w-[15rem] items-center justify-center   bg-white md:bg-[#d5aadb79] gap-2 px-3 rounded-xl">
            <UserIcon className="small-tablet:w-6 small-tablet:h-6 w-4 h-4 text-[#975ba1] " />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent   w-[16rem] outline-none py-2 px-1  text-xl"
            />
          </div>

          <div className="flex min-w-[15rem] items-center  bg-white md:bg-[#d5aadb79] gap-2 px-3 rounded-xl">
            <KeyIcon className="small-tablet:w-6 small-tablet:h-6 w-4 h-4  text-[#975ba1]" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent w-[14.2rem] outline-none py-2 px-1 text-xl"
            />
            {showPassword ? (
              <EyeIcon
                className="w-5 h-5  md:w-6 md:h-6 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <EyeSlashIcon
                className="w-5 h-5  md:w-6 md:h-6 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
          <h1 className="text-center  text-xl  text-white md:text-black">or</h1>
          <div className="flex items-center justify-center ">
            <svg
              onClick={handleGithubLogin}
              className="w-12 h-12 md:w-16 md:h-16 fill-current text-white md:text-black cursor-pointer"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>GitHub Icon</title>
              <rect width="24" height="24" fill="none" />
              <path d="M12,2A10,10,0,0,0,8.84,21.5c.5.08.66-.23.66-.5V19.31C6.73,19.91,6.14,18,6.14,18A2.69,2.69,0,0,0,5,16.5c-.91-.62.07-.6.07-.6a2.1,2.1,0,0,1,1.53,1,2.15,2.15,0,0,0,2.91.83,2.16,2.16,0,0,1,.63-1.34C8,16.17,5.62,15.31,5.62,11.5a3.87,3.87,0,0,1,1-2.71,3.58,3.58,0,0,1,.1-2.64s.84-.27,2.75,1a9.63,9.63,0,0,1,5,0c1.91-1.29,2.75-1,2.75-1a3.58,3.58,0,0,1,.1,2.64,3.87,3.87,0,0,1,1,2.71c0,3.82-2.34,4.66-4.57,4.91a2.39,2.39,0,0,1,.69,1.85V21c0,.27.16.59.67.5A10,10,0,0,0,12,2Z" />
            </svg>
          </div>

          <button
            type="submit"
            className="bg-[#975ba1] min-w-[19rem] flex items-center justify-center text-center border-none py-3 text-white font-medium text-lg rounded-xl"
          >
            LOGIN
          </button>
        </form>
        <a
          href="/create-account"
          className="flex items-center gap-1 justify-center cursor-pointer text-white md:text-black"
        >
          Create Your Account <ArrowLongRightIcon className="h-7 w-8" />
        </a>
        {normalLoginLoading ? (
          <p className="absolute top-0 h-screen w-full flex justify-center items-center text-white bg-[#000000d7]">
            <div className="flex items-center text-[1.25rem] font-bold">
              <img
                src={loading}
                loading="lazy"
                alt=""
                className="w-[4rem] h-[4rem]"
              />{" "}
              Logging in
            </div>
          </p>
        ) : gitLoginLoading ? (
          <p className="absolute top-0 h-screen w-full flex justify-center items-center text-white bg-[#000000d7]">
            <div className="flex items-center text-[1.25rem] font-bold">
              <img
                src={loading}
                loading="lazy"
                alt=""
                className="w-[4rem] h-[4rem]"
              />{" "}
              Logging in
            </div>
          </p>
        ) : (
          false
        )}
      </section>
    </div>
  );
};

export default Login;

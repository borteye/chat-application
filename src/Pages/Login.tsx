import React, { FC, useState } from "react";
import loginImage from "../assets/loginImg.jpg";
import githubIcon from "../assets/github.svg";
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

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //* This function allows the user to login
  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    NormalLoginAuth(dispatch, navigate, email, password);
  };

  const handleGithubLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    GitHubLoginAuth(dispatch, navigate);
  };
  return (
    <div className=" flex ">
      <img
        src={loginImage}
        alt="loginImage"
        className="w-6/12 h-full object-cover"
      />
      <section className="w-6/12 flex flex-col items-center justify-center">
        <h1 className="font-bold text-4xl text-gray-800">User Login</h1>
        <form className="mt-12 mb-12" onSubmit={handleUserLogin}>
          <div className="mb-6 flex items-center bg-[#d5aadb79] gap-2 pr-3 pl-3 rounded-xl">
            <UserIcon className="w-6 h-6 text-[#975ba1] " />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-none outline-none pt-2 pb-2 pr-1 pl-1 text-xl"
            />
          </div>

          <div className="mb-6 flex items-center bg-[#d5aadb79] gap-2 pr-3 pl-3 rounded-xl">
            <KeyIcon className="w-6 h-6 text-[#975ba1]" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border-none outline-none pt-2 pb-2 pr-1 pl-1 text-xl"
            />
            {showPassword ? (
              <EyeIcon
                className="w-6 h-6 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <EyeSlashIcon
                className="w-6 h-6 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
          <h1 className="text-center text-xl mb-6">or</h1>
          <div className="flex items-center justify-center">
            <img
              src={githubIcon}
              alt=""
              className="w-10 h-10 mb-6 cursor-pointer"
              onClick={handleGithubLogin}
            />
          </div>

          <button
            type="submit"
            className="bg-[#975ba1] flex items-center justify-center text-center w-full border-none pt-3 pb-3 text-white font-medium text-lg rounded-xl"
          >
            LOGIN
          </button>
        </form>
        <a
          href="/create-account"
          className="flex items-center gap-1 cursor-pointer"
        >
          Create Your Account <ArrowLongRightIcon className="h-7 w-8" />
        </a>
      </section>
    </div>
  );
};

export default Login;

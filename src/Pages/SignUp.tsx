import React, { FC, useState } from "react";
import loginImage from "../assets/loginImg.jpg";
import loading from "../assets/loading.gif";
import {
  UserIcon,
  KeyIcon,
  ArrowLongRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/solid";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { BasicUserInfo } from "../typings";
import firebase from "firebase/compat/app";
import {
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import db from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { GitHubSignupAuth, NormalSignupAuth } from "../auth/auth";

const SignUp: FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmal] = useState<string>("");
  const [occupation, setOccupation] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [normalSignupLoading, setNormalSignupLoading] =
    useState<boolean>(false);
  const [gitSignupLoading, setGitSignupLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const provider = new GithubAuthProvider();

  //* This function adds a user to the firestore
  async function addUserToFirestore(user: BasicUserInfo) {
    await db.collection("users").doc(user.uid).set(
      {
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid: user.uid,
        displayName: username,
        phoneNumber: phone,
        email: email,
        occupation: occupation,
        password: password,
      },
      { merge: true }
    );
  }

  async function addUserToFirestoreGithub(user: BasicUserInfo) {
    await db.collection("users").doc(user.uid).set(
      {
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid: user.uid,
        displayName: user.displayName,
        phoneNumber: phone,
        email: user.email,
        occupation: occupation,
        password: password,
      },
      { merge: true }
    );
  }

  //* This function creates an account for the user
  const handleUserRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      password !== confirmPassword ||
      !username ||
      !phone ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setError("Passwords do not match or fields are empty");
      return;
    }
    NormalSignupAuth(
      email,
      password,
      username,
      addUserToFirestore,
      navigate,
      setNormalSignupLoading
    );
  };

  const handleGithubRegistration = (e: React.MouseEvent) => {
    e.preventDefault();
    GitHubSignupAuth(addUserToFirestoreGithub, navigate, setGitSignupLoading);
  };

  return (
    <div className="bg-ultimate md:bg-none bg-cover bg-center h-full  flex justify-center items-center md:justify-normal md:items-start no-scrollbar ">
      <section className="w-full h-full md:w-6/12 py-6 flex flex-col relative  items-center justify-center  bg-[#00000096] md:bg-[white] no-scrollbar">
        <h1 className="font-bold text-4xl text-white md:text-black">
          Create an account
        </h1>
        <form
          className="my-12 flex flex-col gap-6 justify-center items-center "
          onSubmit={handleUserRegistration}
        >
          <div className=" min-w-[15rem]  flex items-center bg-white md:bg-[#d5aadb79] gap-2 px-3 rounded-xl">
            <UserIcon className="small-tablet:w-6 small-tablet:h-6 w-4 h-4 text-[#975ba1] " />
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-transparent  w-[16rem] border-none outline-none py-2 px-1  text-xl"
            />
          </div>

          <div className=" min-w-[15rem]  flex items-center bg-white md:bg-[#d5aadb79] gap-2 px-3 rounded-xl">
            <PhoneIcon className="small-tablet:w-6 small-tablet:h-6 w-4 h-4 text-[#975ba1] " />
            <input
              type="text"
              placeholder="Phone Number"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              pattern="[0-9]*"
              title="Please enter only numeric characters"
              className="bg-transparent  w-[16rem] border-none outline-none pt-2 pb-2 pr-1 pl-1 text-xl"
            />
          </div>

          <div className=" min-w-[15rem]  flex items-center bg-white md:bg-[#d5aadb79] gap-2 px-3 rounded-xl">
            <EnvelopeIcon className="small-tablet:w-6 small-tablet:h-6 w-4 h-4 text-[#975ba1] " />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmal(e.target.value)}
              className="bg-transparent  w-[16rem] border-none outline-none pt-2 pb-2 pr-1 pl-1 text-xl"
            />
          </div>
          <div className=" min-w-[15rem]  flex items-center bg-white md:bg-[#d5aadb79] gap-2 px-3 rounded-xl">
            <BriefcaseIcon className="small-tablet:w-6 small-tablet:h-6 w-4 h-4 text-[#975ba1] " />
            <input
              type="text"
              placeholder="Occupation"
              required
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="bg-transparent  w-[16rem] border-none outline-none pt-2 pb-2 pr-1 pl-1 text-xl"
            />
          </div>

          <div className=" min-w-[15rem]  flex items-center bg-white md:bg-[#d5aadb79] gap-2 px-3 rounded-xl">
            <KeyIcon className="small-tablet:w-6 small-tablet:h-6 w-4 h-4 text-[#975ba1]" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent  w-[14.2rem] border-none outline-none pt-2 pb-2 pr-1 pl-1 text-xl"
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

          <div className=" min-w-[15rem]  flex items-center bg-white md:bg-[#d5aadb79] gap-2 px-3 rounded-xl">
            <KeyIcon className="small-tablet:w-6 small-tablet:h-6 w-4 h-4 text-[#975ba1]" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confrim password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-transparent  w-[16rem] border-none outline-none pt-2 pb-2 pr-1 pl-1 text-xl"
            />
          </div>

          <h1 className="text-center text-xl  text-white md:text-black">or</h1>
          <div className="flex items-center justify-center  ">
            <svg
              onClick={handleGithubRegistration}
              className="w-12 h-12 md:w-16 md:h-16 fill-current text-white md:text-black cursor-pointer"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>GitHub Icon</title>
              <rect width="24" height="24" fill="none" />
              <path d="M12,2A10,10,0,0,0,8.84,21.5c.5.08.66-.23.66-.5V19.31C6.73,19.91,6.14,18,6.14,18A2.69,2.69,0,0,0,5,16.5c-.91-.62.07-.6.07-.6a2.1,2.1,0,0,1,1.53,1,2.15,2.15,0,0,0,2.91.83,2.16,2.16,0,0,1,.63-1.34C8,16.17,5.62,15.31,5.62,11.5a3.87,3.87,0,0,1,1-2.71,3.58,3.58,0,0,1,.1-2.64s.84-.27,2.75,1a9.63,9.63,0,0,1,5,0c1.91-1.29,2.75-1,2.75-1a3.58,3.58,0,0,1,.1,2.64,3.87,3.87,0,0,1,1,2.71c0,3.82-2.34,4.66-4.57,4.91a2.39,2.39,0,0,1,.69,1.85V21c0,.27.16.59.67.5A10,10,0,0,0,12,2Z" />
            </svg>
          </div>

          <button className="bg-[#975ba1] flex items-center justify-center text-center w-full border-none pt-3 pb-3 text-white font-medium text-lg rounded-xl">
            SIGN UP
          </button>
        </form>

        <a
          href="/"
          className="flex items-center gap-1 cursor-pointer text-white md:text-black"
        >
          Already have an account? Login
          <ArrowLongRightIcon className="h-7 w-8" />
        </a>
        {normalSignupLoading ? (
          <p className="absolute top-0 h-full w-full flex justify-center items-center text-white bg-[#000000d7]">
            <div className="flex items-center text-[1.25rem] font-bold">
              <img src={loading} alt="" className="w-[4rem] h-[4rem]" />
              Creating account
            </div>
          </p>
        ) : gitSignupLoading ? (
          <p className="absolute top-0 h-full w-full flex justify-center items-center text-white bg-[#000000d7]">
            <div className="flex items-center text-[1.25rem] font-bold">
              <img src={loading} alt="" className="w-[4rem] h-[4rem]" />
              Creating account
            </div>
          </p>
        ) : (
          false
        )}
      </section>
      <img
        src={loginImage}
        alt="loginImage"
        className=" md:fixed md:top-0 md:right-0 w-6/12 h-full object-cover hidden md:block"
      />
    </div>
  );
};

export default SignUp;

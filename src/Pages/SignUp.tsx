import React, { FC, useState } from "react";
import loginImage from "../assets/loginImg.jpg";
import githubIcon from "../assets/github.svg";
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

const SignUp: FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmal] = useState<string>("");
  const [occupation, setOccupation] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
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
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        updateProfile(user, {
          displayName: username,
        });
        addUserToFirestore(user);
        navigate("/");
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const handleGithubRegistration = (e: React.MouseEvent) => {
    e.preventDefault();

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;

        // The signed-in user info.
        const user = result.user;
        addUserToFirestoreGithub(user);
        navigate("/");
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GithubAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <div className=" flex ">
      <section className="w-6/12 flex flex-col items-center justify-center">
        <h1 className="font-bold text-4xl text-gray-800">Create an account</h1>
        <form className="mt-12 mb-12" onSubmit={handleUserRegistration}>
          <div className="mb-6 flex items-center bg-[#d5aadb79] gap-2 pr-3 pl-3 rounded-xl">
            <UserIcon className="w-6 h-6 text-[#975ba1] " />
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-transparent border-none outline-none pt-2 pb-2 pr-1 pl-1 text-xl"
            />
          </div>

          <div className="mb-6 flex items-center bg-[#d5aadb79] gap-2 pr-3 pl-3 rounded-xl">
            <PhoneIcon className="w-6 h-6 text-[#975ba1] " />
            <input
              type="text"
              placeholder="Phone Number"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              pattern="[0-9]*"
              title="Please enter only numeric characters"
              className="bg-transparent border-none outline-none pt-2 pb-2 pr-1 pl-1 text-xl"
            />
          </div>

          <div className="mb-6 flex items-center bg-[#d5aadb79] gap-2 pr-3 pl-3 rounded-xl">
            <EnvelopeIcon className="w-6 h-6 text-[#975ba1] " />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmal(e.target.value)}
              className="bg-transparent border-none outline-none pt-2 pb-2 pr-1 pl-1 text-xl"
            />
          </div>
          <div className="mb-6 flex items-center bg-[#d5aadb79] gap-2 pr-3 pl-3 rounded-xl">
            <BriefcaseIcon className="w-6 h-6 text-[#975ba1] " />
            <input
              type="text"
              placeholder="Occupation"
              required
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
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

          <div className="mb-6 flex items-center bg-[#d5aadb79] gap-2 pr-3 pl-3 rounded-xl">
            <KeyIcon className="w-6 h-6 text-[#975ba1]" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confrim password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-transparent border-none outline-none pt-2 pb-2 pr-1 pl-1 text-xl"
            />
          </div>

          <h1 className="text-center text-xl mb-6">or</h1>
          <div className="flex items-center justify-center">
            <img
              src={githubIcon}
              alt=""
              className="w-10 h-10 mb-6 cursor-pointer"
              onClick={handleGithubRegistration}
            />
          </div>

          <button className="bg-[#975ba1] flex items-center justify-center text-center w-full border-none pt-3 pb-3 text-white font-medium text-lg rounded-xl">
            SIGN UP
          </button>
        </form>

        <a href="/" className="flex items-center gap-1 cursor-pointer">
          Already have an account? Login{" "}
          <ArrowLongRightIcon className="h-7 w-8" />
        </a>
      </section>
      <img
        src={loginImage}
        alt="loginImage"
        className="w-6/12 h-full object-cover"
      />
    </div>
  );
};

export default SignUp;

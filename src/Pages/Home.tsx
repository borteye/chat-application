import React, { FC, useState } from "react";
import profile_picture from "../assets/profile.jpg";
import chat_profile from "../assets/chat_profile.jpg";
import {
  ChatBubbleLeftEllipsisIcon,
  ArrowLeftEndOnRectangleIcon,
  ArrowLeftIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  UsersIcon,
  XMarkIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/solid";
import {
  selectDisplayName,
  selectOccupation,
  selectPhoneNumber,
  setUserLogoutState,
} from "../features/userSlice";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setNonActiveFriend,
  selectFDisplayName,
  selectEmail,
  selectFOccupation,
  selectFriendSince,
  selectFPhoneNumber,
} from "../features/friendSlice";
import ChatCard from "../component/ChatCard";
import { auth } from "../firebaseConfig";
import DiscoverConnections from "../component/DiscoverConnections";
import Requests from "../component/Requests";
import NewGroup from "../component/NewGroup";
import {
  selectAdminMail,
  selectAdminName,
  selectGroupCreatedAt,
  selectGroupName,
} from "../features/groupSlice";
import SendMessage from "../component/SendMessage";
import Messages from "../component/Messages";
import { requestLength } from "../features/requestsSlice";
import Update from "../component/Update";

const Home: FC = () => {
  const [isRightBarOpen, setIsRightBarOpen] = useState<boolean>(false);
  const [isDFOpen, setIsDFOpen] = useState<boolean>(false);
  const [isROpen, setIsROpen] = useState<boolean>(false);
  const [isNGOpen, setIsNGOpen] = useState<boolean>(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState<boolean>(false);
  const [key, setKey] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //* Current User info
  const displayName = useSelector(selectDisplayName);
  const occupation = useSelector(selectOccupation);
  const phoneNumber = useSelector(selectPhoneNumber);

  //* Friend info
  const fDisplayName = useSelector(selectFDisplayName);
  const fEmail = useSelector(selectEmail);
  const fOccupation = useSelector(selectFOccupation);
  const friendSince = useSelector(selectFriendSince);
  const fPhoneNumber = useSelector(selectFPhoneNumber);

  //* Group info
  const groupName = useSelector(selectGroupName);
  const AdminName = useSelector(selectAdminName);
  const AdminMail = useSelector(selectAdminMail);
  const groupCreatedAt = useSelector(selectGroupCreatedAt);

  //* Total Requests
  const totalRequests = useSelector(requestLength);

  //* Sign user out of session
  const signOut = async () => {
    auth.signOut();
    dispatch(setUserLogoutState());
    dispatch(setNonActiveFriend());
    navigate("/");
  };

  return (
    <div className="bg-[#55254b] h-screen">
      <nav
        className={`flex items-center justify-between bg-[#975ba1] pt-2 pb-2 pr-4 pl-4 ${
          key ? "hidden small-laptop:flex" : "block "
        }`}
      >
        <div className="gap-3 hidden medium-tablet:flex ">
          <img
            src={profile_picture}
            alt="profile picture"
            className="w-[45px] h-[45px] rounded-[50%] object-cover"
          />
          <div>
            <div className="text-white font-medium">
              {displayName && displayName}
            </div>
            <p className="mt-[-4px] text-sm text-gray-100">
              {occupation && occupation}
            </p>
          </div>
        </div>

        <div className="flex items-center small-tablet:gap-x-6 gap-x-5 py-3 text-gray-200">
          <div
            onClick={() => {
              setIsDFOpen(true);
              setIsROpen(false);
              setIsLogoutOpen(false);
            }}
            className="small-tablet:hidden flex items-center justify-center gap-1 cursor-pointer bg-[#55254b] pt-[1.5px] pb-[1.5px] pr-4 pl-4 rounded-2xl text-sm"
          >
            Connections <UsersIcon className="w-4 h-4" />
          </div>
          <div
            onClick={() => {
              setIsDFOpen(true);
              setIsROpen(false);
              setIsLogoutOpen(false);
            }}
            className="small-tablet:flex hidden items-center justify-center gap-1 cursor-pointer bg-[#55254b] pt-[1.5px] pb-[1.5px] pr-4 pl-4 rounded-2xl"
          >
            Discover Connections <UsersIcon className="w-5 h-5 " />
          </div>
          <div
            onClick={() => {
              setIsROpen(true);
              setIsDFOpen(false);
              setIsLogoutOpen(false);
            }}
            className="flex items-center mr-8 small-laptop:mr-0 justify-center gap-1 cursor-pointer bg-[#55254b] py-[1.5px] px-4 rounded-2xl text-sm small-tablet:text-base"
          >
            Requests
            <ChatBubbleLeftEllipsisIcon className="small-tablet:w-5 small-tablet:h-5  w-4 h-4" />
            <p>{totalRequests}</p>
          </div>
          <div className="absolute right-0 mr-3 small-laptop:hidden cursor-pointer">
            {isLogoutOpen ? (
              <EllipsisVerticalIcon
                className="w-6 h-6 small-tablet:w-8 small-tablet:h-8"
                onClick={() => setIsLogoutOpen(false)}
              />
            ) : (
              <EllipsisVerticalIcon
                className="w-6 h-6 small-tablet:w-8 small-tablet:h-8"
                onClick={() => {
                  setIsLogoutOpen(true);
                  setIsDFOpen(false);
                  setIsROpen(false);
                }}
              />
            )}

            <div
              className={`absolute  ${
                isLogoutOpen ? "top-6" : "top-[-1000%]"
              } duration-500 right-0 bg-[#9954a5] cursor-pointer font-medium text-lg text-white w-[35vw] text-center py-2 mt-4 flex items-center justify-center gap-x-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-lg`}
              onClick={signOut}
            >
              <ArrowLeftEndOnRectangleIcon className="w-6 h-6 small-tablet:w-8 small-tablet:h-8" />
              Logout
            </div>
          </div>
        </div>
      </nav>
      {!displayName || !occupation || !phoneNumber ? <Update /> : false}

      <DiscoverConnections isDFOpen={isDFOpen} setIsDFOpen={setIsDFOpen} />
      <Requests isROpen={isROpen} setIsROpen={setIsROpen} />
      <main className="h-fit small-laptop:h-[calc(100vh-66px)] medium-tablet:flex ">
        <section className=" bg-[#975ba1] w-[50px]  small-laptop:h-[calc(100vh-68px)] hidden  small-laptop:flex justify-center items-end ">
          <ArrowLeftEndOnRectangleIcon
            className="w-7 h-7 text-white mb-4 cursor-pointer"
            onClick={signOut}
          />
        </section>

        <section
          className={`w-full small-laptop:w-[calc(100vw-50px)] small-laptop:mt-4 flex justify-center items-center ${
            key ? "px-0  small-laptop:px-4" : "px-4"
          }  gap-6 `}
        >
          <div
            className={`w-full mt-4 small-laptop:mt-0 small-laptop:w-[40%] medium-laptop:w-[25%] ${
              key ? "hidden small-laptop:block h-fit " : "block "
            }`}
          >
            <NewGroup isNGOpen={isNGOpen} setIsNGOpen={setIsNGOpen} />
            <div className="bg-[#975ba1]  pr-4 pl-4 pt-6 pb-6 rounded-lg">
              <div className="flex items-end justify-between ">
                <h1 className="text-white text-2xl font-normal">Chats</h1>

                <div
                  className="flex items-center  text-gray-100 cursor-pointer"
                  onClick={() => setIsNGOpen(true)}
                >
                  <UserGroupIcon className="w-6 h-6 " />
                  <p className="font-medium">New Group</p>
                </div>
              </div>
              <div className="mt-6 bg-[#55254b] flex items-center pt-[0.125rem] pb-[0.125] pr-3 pl-3 rounded-2xl">
                <MagnifyingGlassIcon className="w-[1.2rem] h-[1.2rem] text-white" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="search chat... "
                  className="bg-transparent outline-none w-full  pr-3 pl-3 text-base text-white"
                />
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-4 h-[calc(100vh-250px)] overflow-y-scroll no-scrollbar">
              <ChatCard key={key} setKey={setKey} search={search} />
            </div>
          </div>
          <div
            className={`bg-[#975ba1] ${
              isRightBarOpen ? " hidden " : "w-[80%] small-laptop:block "
            }  p-4 duration-500 ease medium-laptop:block  small-laptop:rounded-lg
            ${key ? "block w-full h-screen small-laptop:h-[95%]" : "hidden "}
            `}
          >
            <nav className="flex items-center gap-x-12 justify-between mb-2 ">
              <div className="flex items-center gap-6 ">
                <ArrowLeftIcon
                  className="w-6 h-6 small-laptop:hidden"
                  onClick={() => setKey("")}
                />
                {fDisplayName ? (
                  <div
                    className="flex  gap-2 min-w-[10rem] cursor-pointer"
                    onClick={() => setIsRightBarOpen(true)}
                  >
                    <img
                      src={chat_profile}
                      alt="chat profile"
                      className="small-tablet:w-[45px] w-[35px] small-tablet:h-[45px]  h-[35px] rounded-[50%] object-cover"
                    />
                    <p className="text-white text-sm font-semibold">
                      {fDisplayName && fDisplayName}
                    </p>
                  </div>
                ) : (
                  false
                )}
                {groupName ? (
                  <div
                    className="flex  gap-2 min-w-[10rem] cursor-pointer"
                    onClick={() => setIsRightBarOpen(true)}
                  >
                    <img
                      src={chat_profile}
                      alt="chat profile"
                      className="small-tablet:w-[45px] w-[30px] small-tablet:h-[45px]  h-[30px] rounded-[50%] object-cover"
                    />
                    <p className="text-white text-sm font-semibold">
                      {groupName && groupName}
                    </p>
                  </div>
                ) : (
                  false
                )}
              </div>

              <div className=" bg-[#55254b] flex items-center max-w-[50%] pt-[0.125rem] pb-[0.125] pr-3 pl-3 rounded-2xl">
                <MagnifyingGlassIcon className="w-[1.5rem] h-[1.5rem] text-white" />
                <input
                  type="text"
                  className="bg-transparent outline-none w-full  pr-4 pl-4 text-lg text-white"
                />
              </div>
            </nav>
            <hr className="bg-[#55254b] border-none h-[1px]" />
            <Messages />
            <section className="bg-[#55254b] p-4 gap-2 rounded-xl flex items-center justify-evenly">
              <PhotoIcon className="w-7 h-7 text-gray-200 cursor-pointer " />
              <SendMessage />
            </section>
          </div>
          <div
            className={`bg-[#975ba1] medium-laptop:w-[calc(100%-75%)] p-4 small-laptop:rounded-lg small-laptop:h-[95%] relative duration-500 ease-in-out ${
              isRightBarOpen ? "block w-full h-[100vh]  " : "hidden"
            } `}
          >
            <p className="text-[1.85rem] text-white text-center">
              Contact info
            </p>
            <div className="mt-4">
              <p className="text-xl text-white">
                {fDisplayName && "About Friend"} {groupName && "About Group"}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <img
                  src={chat_profile}
                  alt="chat profile"
                  className="w-[75px] h-[75px] rounded-[50%] object-cover"
                />
                <div>
                  <p className="text-white text-xl font-medium">
                    {fDisplayName && fDisplayName}
                    {groupName && groupName}
                  </p>
                  <p className="text-gray-100 ">
                    {fOccupation && fOccupation} {AdminName && AdminName}
                  </p>
                </div>
              </div>
              <div className=" mt-6 flex flex-col gap-6">
                <div>
                  {fPhoneNumber ? (
                    <>
                      <label className="text-gray-200">Phone number</label>
                      <p className="text-xl text-white">{fPhoneNumber}</p>
                    </>
                  ) : (
                    false
                  )}
                </div>
                <div className="max-w-[300px]">
                  <label className="text-gray-200">
                    {fDisplayName && "Email"} {groupName && "Admin Mail"}
                  </label>
                  <p className="text-[1.125rem] whitespace-normal text-white max-w-[300px]">
                    {fEmail && fEmail} {AdminMail && AdminMail}
                  </p>
                </div>
                <div>
                  {friendSince ? (
                    <>
                      <label className="text-gray-200">Friends Since</label>
                      <p className="text-xl text-white">{friendSince}</p>
                    </>
                  ) : (
                    false
                  )}
                  {groupCreatedAt ? (
                    <>
                      <label className="text-gray-200">Created At</label>
                      <p className="text-xl text-white">{groupCreatedAt}</p>
                    </>
                  ) : (
                    false
                  )}
                </div>
              </div>
            </div>
            <XMarkIcon
              className="w-6 h-6  text-white position: absolute top-7 right-4 cursor-pointer"
              onClick={() => setIsRightBarOpen(false)}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;

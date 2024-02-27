import React, { FC, useEffect, useRef, useState } from "react";
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
  PaperAirplaneIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";
import {
  selectUid,
  selectDisplayName,
  selectOccupation,
  selectPhoneNumber,
  setUserLogoutState,
  selectEmail,
} from "../features/userSlice";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setNonActiveFriend,
  selectFDisplayName,
  selectFOccupation,
  selectFriendSince,
  selectFPhoneNumber,
  selectCombinedUid,
} from "../features/friendSlice";
import ChatCard from "../component/ChatCard";
import db, { auth } from "../firebaseConfig";
import DiscoverConnections from "../component/DiscoverConnections";
import Requests from "../component/Requests";
import NewGroup from "../component/NewGroup";
import {
  selectAdminMail,
  selectAdminName,
  selectGroupCreatedAt,
  selectGroupName,
  selectGroupUid,
} from "../features/groupSlice";
import SendMessage from "../component/SendMessage";
import Messages from "../component/Messages";
import { requestLength } from "../features/requestsSlice";
import Update from "../component/Update";
import {
  selectChatId,
  selectMessage,
  selectMessageId,
  setDoneEditing,
} from "../features/editMessageSlice";
import loginImage from "../assets/loginImage.jpg";
import { sendFriendChatMessage } from "../utils";
import { editMessageToggle, isVisible } from "../features/togglesSlice";
import FriendMessages from "../component/FriendMessages";

const Home: FC = () => {
  const [isRightBarOpen, setIsRightBarOpen] = useState<boolean>(false);
  const [isNGOpen, setIsNGOpen] = useState<boolean>(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [messageSearch, setMessageSearch] = useState<string>("");
  const [imageViewer, setImageViewer] = useState<string>("");
  const [chatSelected, setChatSelected] = useState(false);
  const [editMessage, setEditMessage] = useState<string>("");
  const [imageURL, setImageURL] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [progress, setProgress] = useState<number | null>(null);
  const [text, setText] = useState<string>("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //* toggles
  const editMsg = useSelector(editMessageToggle);

  //* Current User info
  const currentUserEmail = useSelector(selectEmail);
  const displayName = useSelector(selectDisplayName);
  const occupation = useSelector(selectOccupation);
  const phoneNumber = useSelector(selectPhoneNumber);

  //* Friend info
  const fDisplayName = useSelector(selectFDisplayName);
  const fEmail = useSelector(selectEmail);
  const fOccupation = useSelector(selectFOccupation);
  const friendSince = useSelector(selectFriendSince);
  const fPhoneNumber = useSelector(selectFPhoneNumber);
  const combinedUid = useSelector(selectCombinedUid);

  //* Group info
  const groupName = useSelector(selectGroupName);
  const AdminName = useSelector(selectAdminName);
  const AdminMail = useSelector(selectAdminMail);
  const groupCreatedAt = useSelector(selectGroupCreatedAt);
  const groupUid = useSelector(selectGroupUid);

  //* Total Requests
  const totalRequests = useSelector(requestLength);

  //* Edit Message Details
  const messageId = useSelector(selectMessageId);
  const message = useSelector(selectMessage);
  const chatId = useSelector(selectChatId);

  //* handle Edit function
  const handleEditMessage: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (chatId === combinedUid) {
      db.collection("conversations")
        .doc(chatId)
        .collection("messages")
        .doc(messageId)
        .set(
          {
            message: editMessage,
          },
          { merge: true }
        );
    }
    dispatch(
      isVisible({
        editMessageToggle: false,
      })
    );
  };

  console.log(imageURL);

  //* send message function
  const sendMessage: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (combinedUid) {
      sendFriendChatMessage(
        combinedUid,
        currentUserEmail,
        text,
        setText,
        imageURL,
        setImageURL,
        setProgress
      );
      setImagePreview("");
    }
  };

  //* Sign user out of session
  const signOut = async () => {
    auth.signOut();
    dispatch(setUserLogoutState());
    dispatch(setNonActiveFriend());
    navigate("/");
  };

  return (
    <div className="bg-[#55254b] h-screen overflow-y-hidden no-scrollbar">
      <nav
        className={`flex items-center justify-between bg-[#975ba1] pt-2 pb-2 pr-4 pl-4 ${
          chatSelected ? "hidden small-laptop:flex" : "block "
        }`}
      >
        <div className="gap-3 hidden medium-tablet:flex ">
          <img
            src={profile_picture}
            alt="profile picture"
            loading="lazy"
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
              dispatch(
                isVisible({
                  connectionsToggle: true,
                  requetsToggle: false,
                })
              );
            }}
            className="small-tablet:hidden flex items-center justify-center gap-1 cursor-pointer bg-[#55254b] pt-[1.5px] pb-[1.5px] pr-4 pl-4 rounded-2xl text-sm"
          >
            Connections <UsersIcon className="w-4 h-4" />
          </div>
          <div
            onClick={() => {
              dispatch(
                isVisible({
                  connectionsToggle: true,
                  requetsToggle: false,
                })
              );
            }}
            className="small-tablet:flex hidden items-center justify-center gap-1 cursor-pointer bg-[#55254b] pt-[1.5px] pb-[1.5px] pr-4 pl-4 rounded-2xl"
          >
            Discover Connections <UsersIcon className="w-5 h-5 " />
          </div>
          <div
            onClick={() => {
              dispatch(
                isVisible({
                  requestsToggle: true,
                  connectionsToggle: false,
                })
              );
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

      <DiscoverConnections />
      <Requests />
      <main className="h-fit small-laptop:h-[calc(100vh-66px)] medium-tablet:flex ">
        <section className=" bg-[#975ba1] w-[50px]  small-laptop:h-[calc(100vh-68px)] hidden  small-laptop:flex justify-center items-end ">
          <ArrowLeftEndOnRectangleIcon
            className="w-7 h-7 text-white mb-4 cursor-pointer"
            onClick={signOut}
          />
        </section>

        <section
          className={`w-full small-laptop:w-[calc(100vw-50px)] small-laptop:mt-4 flex justify-center items-center ${
            chatSelected ? "px-0  small-laptop:px-4" : "px-4"
          }  gap-6 `}
        >
          <div
            className={`w-full mt-4 small-laptop:mt-0 small-laptop:w-[40%] medium-laptop:w-[25%] ${
              chatSelected ? "hidden small-laptop:block h-fit " : "block "
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
              <ChatCard search={search} setChatSelected={setChatSelected} />
            </div>
          </div>
          <div
            className={`bg-[#975ba1] ${
              (editMsg && "relative ") || (imagePreview && "relative")
            } ${
              isRightBarOpen ? " hidden " : "w-[80%] small-laptop:block "
            }  p-4 duration-500 ease medium-laptop:block  small-laptop:rounded-lg
            ${
              chatSelected
                ? "block w-full h-screen small-laptop:h-[95%]"
                : "hidden "
            }
            `}
          >
            <nav className="flex items-center gap-x-12 justify-between mb-2 ">
              <div className="flex items-center gap-6 ">
                <ArrowLeftIcon
                  className="w-6 h-6 text-white small-laptop:hidden"
                  onClick={() => setChatSelected(false)}
                />
                {fDisplayName ? (
                  <div
                    className="flex  gap-2 min-w-[10rem] cursor-pointer"
                    onClick={() => setIsRightBarOpen(true)}
                  >
                    <img
                      src={chat_profile}
                      alt="chat profile"
                      loading="lazy"
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
                      loading="lazy"
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
                  value={messageSearch}
                  onChange={(e) => setMessageSearch(e.target.value)}
                />
              </div>
            </nav>
            <hr className="bg-[#55254b] border-none h-[1px]" />
            <div className=" w-ful small-laptop:h-[calc(100vh-270px)] h-[calc(100vh-(150px+1rem))] flex flex-col gap-12 overflow-y-scroll  no-scrollbar ">
              {combinedUid ? (
                <FriendMessages
                  messageSearch={messageSearch}
                  setEditMessage={setEditMessage}
                  setImageViewer={setImageViewer}
                />
              ) : (
                false
              )}
            </div>

            {!editMsg && (
              <SendMessage
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                imageURL={imageURL}
                setImageURL={setImageURL}
                setProgress={setProgress}
                progress={progress}
              />
            )}

            {/* ---------- Image Preview Start ----------- */}

            <div
              className={`absolute ${
                imagePreview ? "flex" : "hidden"
              } top-0 left-0 flex-col justify-between gap-2  bg-black p-3 h-full w-full`}
            >
              <p
                onClick={() => {
                  setImageURL("");
                  setProgress(null);
                  setImagePreview("");
                }}
                className="bg-[#2c2b2b] rounded-[50%] w-fit p-2 cursor-pointer"
              >
                <XMarkIcon className="w-6 h-6 text-white " />
              </p>

              <div className="flex justify-center h-[65vh] w-full">
                <img
                  src={imagePreview}
                  alt=""
                  className="w-fit object-contain"
                />
              </div>

              <form
                onSubmit={sendMessage}
                className="flex flex-col small-laptop:flex-row small-laptop:items-center items-end  px-2 gap-4 w-full"
              >
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Add a caption..."
                  className="bg-[#975ba1] normal-text italic-placeholder w-full px-4 py-2 rounded-3xl outline-none text-white "
                />
                <button
                  type="submit"
                  className=" bg-[#55254b] border-none rounded-[50%] p-2"
                >
                  <PaperAirplaneIcon className="w-7 h-7 font-bold text-white cursor-pointer " />
                </button>
              </form>
            </div>

            {/* ---------- Image Preview End ---------- */}

            {/* ----------- Edit Message Start ----------- */}
            <div
              className={` ${
                editMsg ? "flex" : "hidden"
              } editMessage flex flex-col  justify-between bg-[#0000009c] absolute top-0 left-0 rounded-lg h-full w-full`}
            >
              <p className="text-white flex items-center gap-2 bg-black rounded-lg py-5 px-2 text-xl">
                <ArrowLeftIcon
                  onClick={() => {
                    dispatch(
                      isVisible({
                        editMessageToggle: false,
                      })
                    );
                    dispatch(setDoneEditing());
                  }}
                  className="w-6 h-6 cursor-pointer"
                />
                Edit Message
              </p>
              <div className="flex flex-col gap-2 justify-end items-end">
                <p className=" bg-[#f9b142] text-white py-1 mr-1 px-2 text-left font-medium  rounded-s-md ">
                  {message && message}
                </p>
                <form
                  onSubmit={handleEditMessage}
                  className="flex items-center mb-8 px-2 gap-4 w-full"
                >
                  <input
                    type="text"
                    value={editMessage}
                    onChange={(e) => setEditMessage(e.target.value)}
                    className="bg-[#975ba1] normal-text italic-placeholder w-full px-4 py-2 rounded-3xl outline-none text-white "
                  />
                  <button
                    type="submit"
                    className=" bg-black border-none rounded-[50%] p-2"
                  >
                    <CheckIcon className="w-7 h-7 font-bold text-white cursor-pointer " />
                  </button>
                </form>
              </div>
            </div>
            {/* ----------- Edit Message End ----------- */}
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
                  loading="lazy"
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
      <div
        className={` ${imageViewer ? "flex" : "hidden"} bg-[#3b3b3b] absolute 
        top-0 left-0 h-screen  w-screen p-[2rem] flex items-center justify-center`}
      >
        <img
          src={imageViewer}
          alt=""
          loading="lazy"
          className="w-[95%] small-tablet:w-auto small-tablet:h-[95%] "
        />
        <XMarkIcon
          onClick={() => setImageViewer("")}
          className="absolute top-4 left-4 w-8 h-8 text-white"
        />
      </div>
    </div>
  );
};

export default Home;

import React, { FC, useState } from "react";
import chat_profile from "../assets/chat_profile.jpg";
import { useDispatch, useSelector } from "react-redux";
import { setActiveFriend, setNonActiveFriend } from "../features/friendSlice";
import { selectDisplayName, selectUid } from "../features/userSlice";
import db from "../firebaseConfig";
import { ChatInfo } from "../typings";
import { setActiveGroup, setNonActiveGroup } from "../features/groupSlice";
import { useDocument } from "react-firebase-hooks/firestore";

interface Props {
  search: string;
}

const ChatCard: FC<Props> = ({ search }) => {
  const [key, setKey] = useState<string | undefined>("");

  const dispatch = useDispatch();

  //* current user uid
  const currentUserUid = useSelector(selectUid);
  const currentUserDisplayName = useSelector(selectDisplayName);

  //* select a chat
  const selectChat = (chat: ChatInfo) => {
    if (chat?.groupName) {
      dispatch(setNonActiveFriend());
      dispatch(
        setActiveGroup({
          uid: chat?.uid,
          groupName: chat?.groupName,
          createdAt: chat?.createdAt,
          adminName: chat?.adminName,
          adminMail: chat?.adminMail,
        })
      );
    } else if (chat?.displayName) {
      if (currentUserUid && chat?.uid) {
        const combinedUid =
          currentUserUid < chat?.uid
            ? currentUserUid + chat?.uid
            : chat?.uid + currentUserUid;
        dispatch(setNonActiveGroup());
        dispatch(
          setActiveFriend({
            uid: chat?.uid,
            displayName: chat?.displayName,
            email: chat?.email,
            phoneNumber: chat?.phoneNumber,
            friendSince: chat?.friendSince,
            occupation: chat?.occupation,
            combinedUid: combinedUid,
          })
        );
      }
    }
  };

  let friends: ChatInfo[] = [];
  let groups: ChatInfo[] = [];

  const friendgroupRef: any = db.collection("chat").doc(currentUserUid);
  const [friendgroupSnapshot, loading, error] = useDocument(friendgroupRef);

  if (friendgroupSnapshot?.exists) {
    friends = friendgroupSnapshot?.data()?.friends || [];
    groups = friendgroupSnapshot?.data()?.groups || [];
  }
  const chat = [...friends, ...groups];

  return (
    <>
      {chat
        ?.filter((val) => {
          if (search == "") {
            return val;
          } else if (
            val.displayName?.toLowerCase().includes(search.toLowerCase()) ||
            val.groupName?.toLowerCase().includes(search.toLowerCase())
          ) {
            return val;
          }
        })
        ?.map((chat) => {
          if (chat?.adminName) {
            return (
              <div
                className={`${
                  key === chat?.uid ? "bg-[#f9b142]" : "bg-[#975ba1]"
                } p-3 rounded-lg cursor-pointer `}
                key={chat?.uid}
                onClick={() => {
                  setKey(chat?.uid);
                  selectChat(chat);
                }}
              >
                <div className="flex items-end mb-3 gap-2">
                  <img
                    src={chat_profile}
                    alt="chat profile"
                    className="w-[45px] h-[45px] rounded-[50%] object-cover"
                  />
                  <div>
                    <h1 className="text-white">{chat?.groupName}</h1>
                    <p className="text-gray-300">
                      Admin:{" "}
                      {chat?.adminName === currentUserDisplayName
                        ? "Me"
                        : chat?.adminName}
                    </p>
                  </div>
                </div>
                <p className="text-gray-100 font-thin text-[0.93rem] leading-none">
                  There is a lot of exiting stuff going on in the stars
                </p>
              </div>
            );
          } else if (chat?.displayName) {
            return (
              <div
                className={`${
                  key === chat?.uid ? "bg-[#f9b142]" : "bg-[#975ba1]"
                } p-3 rounded-lg cursor-pointer `}
                key={chat?.uid}
                onClick={() => {
                  setKey(chat?.uid);
                  selectChat(chat);
                }}
              >
                <div className="flex items-end mb-3 gap-2">
                  <img
                    src={chat_profile}
                    alt="chat profile"
                    className="w-[45px] h-[45px] rounded-[50%] object-cover"
                  />
                  <div>
                    <h1 className="text-white">{chat?.displayName}</h1>
                    <p className="text-gray-300">{chat?.phoneNumber}</p>
                  </div>
                </div>
                <p className="text-gray-100 font-thin text-[0.93rem] leading-none">
                  There is a lot of exiting stuff going on in the stars
                </p>
              </div>
            );
          }
        })}
    </>
  );
};

export default ChatCard;

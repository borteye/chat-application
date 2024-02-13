import React, { FC, useEffect, useRef, useState } from "react";
import chat_profile from "../assets/chat_profile.jpg";
import { useSelector } from "react-redux";
import { selectGroupUid } from "../features/groupSlice";
import { selectCombinedUid } from "../features/friendSlice";
import db from "../firebaseConfig";
import { MessageInfo } from "../typings";
import { selectEmail } from "../features/userSlice";
import { useCollection } from "react-firebase-hooks/firestore";

const Messages: FC = () => {
  const messagesEndRef = useRef(null);

  //* current user info
  const currentUserEmail = useSelector(selectEmail);

  //* active group uid
  const groupUid = useSelector(selectGroupUid);

  //* combined uid of friend and current user
  const combinedUid = useSelector(selectCombinedUid);

  const FriendConvoWidget = () => {
    const conversationRef = db
      .collection("conversations")
      .doc(combinedUid)
      .collection("messages")
      .orderBy("createdAt");

    const [friendConvoSnapshot] = useCollection(conversationRef);

    const conversation = friendConvoSnapshot?.docs.map(
      (doc) => doc?.data() as MessageInfo
    );

    useEffect(() => {
      if (messagesEndRef?.current) {
        (messagesEndRef?.current as HTMLElement).scrollIntoView({
          behavior: "smooth",
        });
      }
    }, [conversation]);

    return (
      <>
        {conversation?.map((conversation) => {
          // Convert Firebase timestamp to a formatted time string
          const formattedTime: string | undefined = conversation?.createdAt
            ? new Date(conversation.createdAt.toMillis()).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )
            : undefined;

          return (
            <div
              className={
                conversation?.senderEmail === currentUserEmail
                  ? "flex flex-row-reverse gap-2"
                  : "flex gap-2"
              }
            >
              <img
                src={chat_profile}
                alt="chat profile"
                className="w-[32px] h-[32px] rounded-[50%] object-cover"
              />

              <div className="max-w-[85%] small-laptop:max-w-[55%]">
                <p className="bg-[#f9b142]  flex items-center justify-center text-white text-sm pt-1 pb-1 pr-4 pl-4 rounded-xl">
                  {conversation?.message}
                </p>
                <p
                  className={`text-[0.7rem] text-gray-200 ${
                    conversation?.senderEmail === currentUserEmail
                      ? "flex flex-row-reverse"
                      : false
                  }`}
                >
                  {formattedTime}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </>
    );
  };

  const GroupConvoWidget = () => {
    const conversationRef = db
      .collection("conversations")
      .doc(groupUid)
      .collection("messages")
      .orderBy("createdAt");

    const [groupConvoSnapshot] = useCollection(conversationRef);

    const conversation =
      groupConvoSnapshot?.docs?.map((doc) => doc?.data()) || [];

    useEffect(() => {
      if (messagesEndRef?.current) {
        (messagesEndRef?.current as HTMLElement).scrollIntoView({
          behavior: "smooth",
        });
      }
    }, [conversation]);
    return (
      <>
        {conversation?.map((conversation) => {
          // Convert Firebase timestamp to a formatted time string
          const formattedTime: string | undefined = conversation?.createdAt
            ? new Date(conversation.createdAt.toMillis()).toLocaleTimeString(
                [],
                { hour: "2-digit", minute: "2-digit" }
              )
            : undefined;

          return (
            <div
              className={
                conversation?.senderEmail === currentUserEmail
                  ? "flex flex-row-reverse gap-2"
                  : "flex gap-2 "
              }
            >
              <div className="flex flex-col justify-center items-center">
                <img
                  src={chat_profile}
                  alt="chat profile"
                  className="w-[32px] h-[32px] rounded-[50%] object-cover"
                />
                <p className="text-[#33142c] font-medium text-sm">
                  {conversation?.senderName}
                </p>
              </div>

              <div className="max-w-[60%]">
                <p className="bg-[#f9b142]  flex items-center justify-center text-white text-sm pt-1 pb-1 pr-4 pl-4 rounded-xl">
                  {conversation?.message}
                </p>
                <p
                  className={`text-[0.7rem] text-gray-200 ${
                    conversation?.senderEmail === currentUserEmail
                      ? "flex flex-row-reverse"
                      : false
                  }`}
                >
                  {formattedTime}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </>
    );
  };

  return (
    <section className="w-full small-laptop:h-[calc(100vh-270px)] h-[calc(100vh-(150px+1rem))] flex flex-col gap-12  mt-4 overflow-y-scroll no-scrollbar ">
      {combinedUid ? (
        <FriendConvoWidget />
      ) : groupUid ? (
        <GroupConvoWidget />
      ) : (
        false
      )}
    </section>
  );
};

export default Messages;

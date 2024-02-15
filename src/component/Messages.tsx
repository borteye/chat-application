import React, { FC, useEffect, useRef, useState } from "react";
import chat_profile from "../assets/chat_profile.jpg";
import { useSelector } from "react-redux";
import { selectGroupUid } from "../features/groupSlice";
import { selectCombinedUid } from "../features/friendSlice";
import db from "../firebaseConfig";
import { MessageInfo } from "../typings";
import { selectEmail } from "../features/userSlice";
import { useCollection } from "react-firebase-hooks/firestore";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { dateConverter, groupMessagesByDate } from "../utils";

interface Props {
  messageSearch: string;
  setImageViewer: React.Dispatch<React.SetStateAction<string>>;
}

const Messages: FC<Props> = ({ messageSearch, setImageViewer }) => {
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
      (doc) => (doc?.data() as MessageInfo) || []
    );

    const groupedMessages = groupMessagesByDate(conversation);

    useEffect(() => {
      if (messagesEndRef?.current) {
        (messagesEndRef?.current as HTMLElement).scrollIntoView({
          behavior: "smooth",
        });
      }
    }, [conversation]);

    return (
      <>
        {groupedMessages?.map((item) => {
          return (
            <div>
              {item?.date !== "NaN/NaN/NaN" ? (
                <p className="mb-4 w-fit m-auto p-2 text-sm rounded-lg font-medium bg-[#33142c] text-white ">
                  {item?.date}
                </p>
              ) : (
                false
              )}

              <div className="flex flex-col gap-10">
                {item?.messages
                  ?.filter((val) => {
                    if (messageSearch == "") {
                      return val;
                    } else if (
                      val?.message
                        .toLowerCase()
                        .includes(messageSearch.toLowerCase())
                    ) {
                      return val;
                    }
                  })
                  .map((conversation) => {
                    const formattedTime: string | undefined =
                      conversation?.createdAt
                        ? new Date(
                            conversation.createdAt.toMillis()
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
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
                          loading="lazy"
                          className="w-[32px] h-[32px] rounded-[50%] object-cover"
                        />

                        <div className="max-w-[75%] small-laptop:max-w-[55%]  ">
                          <p
                            className={` ${
                              conversation?.senderEmail === currentUserEmail
                                ? "bg-[#f9b142]"
                                : "bg-white text-black"
                            }    ${
                              conversation?.message && conversation?.image
                                ? "flex flex-col"
                                : "flex items-center"
                            } font-normal justify-center py-1 text-base px-1 rounded-lg text-wrap `}
                          >
                            {conversation?.image && (
                              <img
                                src={conversation?.image}
                                alt=""
                                loading="lazy"
                                onClick={() =>
                                  setImageViewer(conversation?.image)
                                }
                                className="w-[15rem] medium-tablet:w-[20rem] medium-laptop:w-[25rem] cursor-pointer rounded-lg"
                              />
                            )}
                            {conversation?.message && (
                              <p className=" w-full px-1 break-words text-left">
                                {conversation?.message}
                              </p>
                            )}
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
              </div>
            </div>
          );
        })}
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
      groupConvoSnapshot?.docs?.map((doc) => doc?.data() as MessageInfo) || [];

    const groupedMessages = groupMessagesByDate(conversation);

    useEffect(() => {
      if (messagesEndRef?.current) {
        (messagesEndRef?.current as HTMLElement).scrollIntoView({
          behavior: "smooth",
        });
      }
    }, [conversation]);
    return (
      <>
        {groupedMessages?.map((item) => {
          return (
            <div>
              {item?.date !== "NaN/NaN/NaN" ? (
                <p className="mb-4 w-fit m-auto p-2 text-sm rounded-lg font-medium bg-[#33142c] text-white ">
                  {item?.date}
                </p>
              ) : (
                false
              )}

              <div className="flex flex-col gap-10">
                {item?.messages
                  ?.filter((val) => {
                    if (messageSearch == "") {
                      return val;
                    } else if (
                      val?.message
                        .toLowerCase()
                        .includes(messageSearch.toLowerCase())
                    ) {
                      return val;
                    }
                  })
                  .map((conversation) => {
                    const formattedTime: string | undefined =
                      conversation?.createdAt
                        ? new Date(
                            conversation.createdAt.toMillis()
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : undefined;
                    return (
                      <div
                        className={
                          conversation?.senderEmail === currentUserEmail
                            ? "flex flex-row-reverse gap-2"
                            : "flex gap-2"
                        }
                      >
                        <div className="flex flex-col justify-center items-center">
                          <img
                            src={chat_profile}
                            alt="chat profile"
                            loading="lazy"
                            className="w-[32px] h-[32px] rounded-[50%] object-cover"
                          />
                          <p className="text-[#33142c] font-medium text-sm">
                            {conversation?.senderName}
                          </p>
                        </div>

                        <div className="max-w-[75%] small-laptop:max-w-[55%]  ">
                          <p
                            className={` ${
                              conversation?.senderEmail === currentUserEmail
                                ? "bg-[#f9b142]"
                                : "bg-white text-black"
                            }    ${
                              conversation?.message && conversation?.image
                                ? "flex flex-col"
                                : "flex items-center"
                            } font-normal justify-center py-1 text-base px-1 rounded-lg text-wrap `}
                          >
                            {conversation?.image && (
                              <img
                                src={conversation?.image}
                                alt=""
                                loading="lazy"
                                onClick={() =>
                                  setImageViewer(conversation?.image)
                                }
                                className="w-[15rem] medium-tablet:w-[20rem] medium-laptop:w-[25rem] cursor-pointer rounded-lg"
                              />
                            )}
                            {conversation?.message && (
                              <p className=" w-full px-1 break-words text-left">
                                {conversation?.message}
                              </p>
                            )}
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
              </div>
            </div>
          );
        })}
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

import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import chat_profile from "../assets/chat_profile.jpg";
import { useSelector } from "react-redux";
import { selectGroupUid } from "../features/groupSlice";
import { selectCombinedUid } from "../features/friendSlice";
import db from "../firebaseConfig";
import { MessageInfo } from "../typings";
import { selectEmail } from "../features/userSlice";
import { useCollection } from "react-firebase-hooks/firestore";
import { dateFormatter, groupMessagesByDate } from "../utils";
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useDispatch } from "react-redux";
import { setBeginEditing } from "../features/editMessageSlice";
import firebase from "firebase/compat";

interface Props {
  messageSearch: string;
  setImageViewer: React.Dispatch<React.SetStateAction<string>>;
  setIsEMOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditMessage: React.Dispatch<React.SetStateAction<string>>;
}

const Messages: FC<Props> = ({
  messageSearch,
  setImageViewer,
  setIsEMOpen,
  setEditMessage,
}) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false);
  const [key, setKey] = useState<string | undefined>("");

  const dispatch = useDispatch();

  const messagesEndRef = useRef(null);

  //* current user info
  const currentUserEmail = useSelector(selectEmail);

  //* active group uid
  const groupUid = useSelector(selectGroupUid);

  //* combined uid of friend and current user
  const combinedUid = useSelector(selectCombinedUid);

  const date = new Date();
  const todaysDate = dateFormatter(date);

  const selectMessageToEdit = (
    id: string | undefined,
    message: string,
    chatId: string | undefined
  ) => {
    setIsOptionsOpen(false);
    setKey("");
    setEditMessage(message);
    dispatch(
      setBeginEditing({
        id: id,
        message: message,
        chatId: chatId,
      })
    );
    setIsEMOpen(true);
  };

  const handleDeleteMessage = (
    id: string | undefined,
    chatId: string | undefined
  ) => {
    setIsOptionsOpen(false);
    setKey("");
    db.collection("conversations")
      .doc(chatId)
      .collection("messages")
      .doc(id)
      .delete();
  };

  // //* scroll position

  let scrollPositionValue: number | undefined = 0;

  const scrollRef = document.querySelector(".getScrollPosition");

  const GroupConvoWidget = () => {
    const conversationRef = db
      .collection("conversations")
      .doc(groupUid)
      .collection("messages")
      .orderBy("createdAt");

    const [groupConvoSnapshot] = useCollection(conversationRef);

    const conversation =
      groupConvoSnapshot?.docs?.map((doc) => doc?.data() as MessageInfo) || [];

    const groupedMessages = useMemo(() => {
      return groupMessagesByDate(conversation);
    }, [conversation]);

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
                  {item?.date === todaysDate ? "Today" : item?.date}
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

                        <>
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
                          {conversation?.senderEmail === currentUserEmail && (
                            <EllipsisVerticalIcon
                              onClick={() => {
                                selectMessageToEdit(
                                  conversation?.id,
                                  conversation?.message,
                                  groupUid
                                );
                              }}
                              className={`w-6 h-6 text-[#e4e4e4] cursor-pointer ${
                                conversation?.senderEmail === currentUserEmail
                                  ? "mr-[-10px]"
                                  : "ml-[-10px]"
                              }`}
                            />
                          )}
                        </>
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
    <div className="getScrollPosition w-ful small-laptop:h-[calc(100vh-270px)] h-[calc(100vh-(150px+1rem))] flex flex-col gap-12 overflow-y-scroll  no-scrollbar "></div>
  );
};

export default React.memo(Messages);

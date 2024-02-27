import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { dateFormatter, groupMessagesByDate } from "../utils";
import { MessageInfo } from "../typings";
import { useDispatch, useSelector } from "react-redux";
import db from "../firebaseConfig";
import { selectEmail } from "../features/userSlice";
import { selectGroupUid } from "../features/groupSlice";
import { selectCombinedUid } from "../features/friendSlice";
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { setBeginEditing } from "../features/editMessageSlice";
import chat_profile from "../assets/chat_profile.jpg";
import { isVisible } from "../features/togglesSlice";

interface Props {
  messageSearch: string;
  setImageViewer: React.Dispatch<React.SetStateAction<string>>;
  setEditMessage: React.Dispatch<React.SetStateAction<string>>;
}

const FriendMessages: FC<Props> = ({
  messageSearch,
  setEditMessage,
  setImageViewer,
}) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false);
  const [key, setKey] = useState<string | undefined>("");

  const dispatch = useDispatch();

  // const scrollRef = useRef<HTMLDivElement>(null);

  // const scrollToPosition = () => {
  //   if (scrollRef.current) {
  //     const scrollHeight = scrollRef.current.scrollHeight;
  //     const scrollTo = scrollHeight;
  //     scrollRef.current.scrollTop = scrollTo;

  //     console.log(`scrollHeight:${scrollHeight} , scrollTo${scrollTo}`);
  //   }
  // };
  // Add scroll event listener to trigger scrollToPosition
  // useEffect(() => {
  //   const handleScroll = () => {
  //     scrollToPosition();
  //   };
  // });

  //* current user info
  const currentUserEmail = useSelector(selectEmail);

  //* uid
  const combinedUid = useSelector(selectCombinedUid);

  //* date
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
    dispatch(
      isVisible({
        editMessageToggle: true,
      })
    );
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

  const conversationRef = db
    .collection("conversations")
    .doc(combinedUid)
    .collection("messages")
    .orderBy("createdAt");

  const [friendConvoSnapshot] = useCollection(conversationRef);

  const conversation = friendConvoSnapshot?.docs.map(
    (doc) => (doc?.data() as MessageInfo) || []
  );

  const containerRef = useRef<HTMLDivElement>(null);
  // const scrollPosition = useScrollPosition(conversation, containerRef);
  // console.log(scrollPosition);
  // console.log("scrollPosition: ", scrollPosition);

  const groupedMessages = groupMessagesByDate(conversation);

  const scrollRef = document.querySelector(".getScrollPosition");
  let scrollHeight = scrollRef?.scrollHeight;
  let scrollTop = scrollRef?.scrollTop;

  const getScrollPosition = () => {
    if (scrollTop !== undefined && scrollHeight !== undefined) {
      const result = scrollHeight - scrollTop;
      console.log("result: ", result);
      if (result === scrollRef?.clientHeight) {
        containerRef.current?.scrollIntoView({ behavior: "smooth" });
        console.log("hello, i scrolled");
      }
    }
  };

  useEffect(() => {
    getScrollPosition();
  }, [conversation]);

  // const messagesEndRef = useRef(null);
  // console.log(messagesEndRef.current);

  // useEffect(() => {
  //   if (messagesEndRef?.current) {
  //     (messagesEndRef?.current as HTMLElement).scrollIntoView({
  //       behavior: "auto",
  //     });
  //   }
  // }, [conversation]);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const container = containerRef.current;
  //     if (container) {
  //       const scrollPosition = container.scrollTop;
  //       const clientHeight = container.clientHeight;

  //       if (scrollPosition === clientHeight) {
  //         console.log(scrollPosition, clientHeight);
  //         // Scroll to view
  //         container.scrollIntoView({ behavior: "smooth" });
  //       }
  //     }
  //   };
  //   handleScroll();
  // }, [conversation]);

  return (
    <div className="getScrollPosition overflow-y-scroll">
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
                      <img
                        src={chat_profile}
                        alt="chat profile"
                        loading="lazy"
                        className="w-[32px] h-[32px] rounded-[50%] object-cover"
                      />
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
                          <div className="relative">
                            {isOptionsOpen && key === conversation?.id ? (
                              <EllipsisVerticalIcon
                                onClick={() => {
                                  setIsOptionsOpen(false);
                                  setKey("");
                                }}
                                className={`w-6 h-6 text-[#ff4747] cursor-pointer ${
                                  conversation?.senderEmail === currentUserEmail
                                    ? "mr-[-10px]"
                                    : "ml-[-10px]"
                                }`}
                              />
                            ) : (
                              <EllipsisVerticalIcon
                                onClick={() => {
                                  setIsOptionsOpen(true);
                                  setKey(conversation?.id);
                                }}
                                className={`w-6 h-6 text-[#e4e4e4] cursor-pointer ${
                                  conversation?.senderEmail === currentUserEmail
                                    ? "mr-[-10px]"
                                    : "ml-[-10px]"
                                }`}
                              />
                            )}

                            <div
                              className={`${
                                key === conversation?.id ? "block" : "hidden"
                              } absolute top-10 right-[-3rem] bg-[#55254b] z-50  rounded-lg text-white shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]`}
                            >
                              <ul className="list-none text-center cursor-pointer">
                                <li
                                  onClick={() => {
                                    selectMessageToEdit(
                                      conversation?.id,
                                      conversation?.message,
                                      combinedUid
                                    );
                                  }}
                                  className="px-5 gap-2 flex items-center small-tablet:px-10 py-2 rounded-md hover:bg-[#975ba1]"
                                >
                                  <PencilSquareIcon className="w-5 h-5" /> Edit
                                </li>
                                <li
                                  onClick={() =>
                                    handleDeleteMessage(
                                      conversation?.id,
                                      combinedUid
                                    )
                                  }
                                  className="px-5 gap-2 flex items-center small-tablet:px-10 py-2 rounded-md hover:bg-[#975ba1]"
                                >
                                  <TrashIcon className="w-5 h-5" /> Delete
                                </li>
                              </ul>
                            </div>
                          </div>
                        )}
                      </>
                    </div>
                  );
                })}
              <div className="mb-9" ref={containerRef} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FriendMessages;

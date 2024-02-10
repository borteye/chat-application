import chat_profile from "../assets/chat_profile.jpg";
import React, { FC, useEffect, useState } from "react";
import {
  selectDisplayName,
  selectEmail,
  selectOccupation,
  selectPhoneNumber,
  selectUid,
} from "../features/userSlice";
import {
  requetsState,
  setDecreaseTimer,
  setPurgeRequest,
  setRequestAccepted,
  setTotalRequests,
} from "../features/requestsSlice";
import firebase from "firebase/compat/app";
import "firebase/firestore";
import db from "../firebaseConfig";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { useSelector, useDispatch } from "react-redux";
import { AcceptRequestInfo, BasicUserInfo, RequestInfo } from "../typings";
import {
  addGroupDetailsToRequester,
  addRequesterToGroupParticipants,
  addRequesterToUserFriends,
  addUserToRequesterFriends,
  removeGroupDetailsFromRequester,
  removeRequesterFromGroupParticipants,
  removeRequesterFromUserFriends,
  removeUserFromRequesterFriends,
} from "../utils";

interface Props {
  isROpen: boolean;
  setIsROpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Requests: FC<Props> = ({ isROpen, setIsROpen }) => {
  const fiveMinutesInSeconds = 60;
  const fiveMinutesInMilliseconds = 1 * 60 * 1000;

  const dispatch = useDispatch();

  //* current user's info
  const currentUserUid = useSelector(selectUid);
  const currentUserDisplayName = useSelector(selectDisplayName);
  const currentUserEmail = useSelector(selectEmail);
  const currentUserOccupation = useSelector(selectOccupation);
  const currentUserPhoneNumber = useSelector(selectPhoneNumber);

  //* Request State
  const reqState = useSelector(requetsState);

  // * timer to delete an accepted requests
  // useEffect(() => {
  //   const timerInterval = setInterval(() => {
  //     reqState?.forEach((object) => {
  //       dispatch(setDecreaseTimer(object));
  //     });
  //   }, 1000);

  //   return () => clearInterval(timerInterval);
  // }, [dispatch, reqState]);

  // * time formatter
  // const displayTime = (timeInSeconds: number | undefined) => {
  //   if (timeInSeconds !== undefined) {
  //     const minutes = Math.floor(timeInSeconds / 60);
  //     const remainingSeconds = timeInSeconds % 60;
  //     return `Removing in ${minutes}:${
  //       remainingSeconds < 10 ? "0" : ""
  //     }${remainingSeconds}`;
  //   }
  // };

  //* all friend requests
  let friendRequests: RequestInfo[] = [];

  const friendsRef: any = db.collection("requests").doc(currentUserUid);

  const [friendRequestsSnapshot, loadingFriend, errorFriend] =
    useDocument(friendsRef);

  if (friendRequestsSnapshot?.exists) {
    friendRequests = friendRequestsSnapshot?.data()?.requests || [];
  }

  //* all group requests
  let groupRequestsRef;
  let groupRequest: RequestInfo[] = [];

  const groupsRef = db.collection("groups");

  const [groupsSnapshot, loadingGroup, errorGroup] = useCollection(groupsRef);

  const groupUids =
    groupsSnapshot?.docs
      ?.map((doc) => doc?.data())
      .filter((doc) => doc?.adminMail === currentUserEmail)
      .map((doc) => doc?.uid) || [];

  if (groupUids.length > 0) {
    groupRequestsRef = db
      .collection("requests")
      .where(firebase.firestore.FieldPath.documentId(), "in", groupUids);
  }

  const [groupRequestsSnapshot, loading, error] =
    useCollection(groupRequestsRef);

  groupRequest =
    groupRequestsSnapshot?.docs.map((doc) => doc.data())[0]?.requests || [];

  //* combine both requests
  const requests = [...friendRequests, ...groupRequest];

  useEffect(() => {
    dispatch(setTotalRequests(requests.length));
  }, [dispatch, requests]);

  const acceptRequest = async (request: RequestInfo) => {
    if (request?.groupName) {
      addGroupDetailsToRequester(request, {
        currentUserDisplayName,
        currentUserEmail,
      } as BasicUserInfo);

      addRequesterToGroupParticipants(request);
    } else if (!request?.groupName) {
      addRequesterToUserFriends(request, { currentUserUid } as BasicUserInfo);

      addUserToRequesterFriends(request, {
        currentUserDisplayName,
        currentUserEmail,
        currentUserPhoneNumber,
        currentUserUid,
        currentUserOccupation,
      } as BasicUserInfo);
    }
  };

  //* Purge Friend Request
  const purgeRequet = async (request: RequestInfo) => {
    if (request?.groupName) {
      removeGroupDetailsFromRequester(request, {
        currentUserDisplayName,
        currentUserEmail,
      } as BasicUserInfo);

      removeRequesterFromGroupParticipants(request);
    } else if (!request?.groupName) {
      removeRequesterFromUserFriends(request, {
        currentUserUid,
      } as BasicUserInfo);

      removeUserFromRequesterFriends(request, {
        currentUserDisplayName,
        currentUserEmail,
        currentUserPhoneNumber,
        currentUserUid,
        currentUserOccupation,
      } as BasicUserInfo);
    }
  };

  return (
    <div
      className={` ${
        !isROpen ? "hidden" : false
      } h-[80vh] w-[25vw] bg-[#55254b] text-white position: absolute top-12 right-5 z-50 shadow-[0_3px_10px_rgb(0,0,0,0.2)]`}
    >
      <div className="bg-[#975ba1] p-4 ">
        <div className="flex items-center gap-16">
          <p className="cursor-pointer" onClick={() => setIsROpen(false)}>
            Close
          </p>
          <h1 className="text-xl">Requests</h1>
        </div>
      </div>
      <div className="h-[62vh] overflow-y-scroll no-scrollbar">
        {requests?.map((request, i) => {
          const exists = Array.isArray(reqState)
            ? (reqState?.find(
                (doc: AcceptRequestInfo) =>
                  doc?.uid === request?.uid && doc?.type === request?.type
              ) as AcceptRequestInfo | undefined)
            : undefined;

          if (request?.groupName) {
            return (
              <div key={i}>
                <div className="flex items-start justify-between p-4 font-medium">
                  <div className="flex items-start gap-3">
                    <div>
                      <img
                        src={chat_profile}
                        alt="find friend's profile_picture"
                        className="w-[45px] h-[45px] rounded-[50%] object-cover"
                      />
                    </div>
                    <p>{request?.displayName}</p>
                  </div>
                  {exists ? (
                    <div>
                      <button
                        onClick={() => {
                          purgeRequet(request);
                          dispatch(
                            setPurgeRequest({
                              uid: request?.uid,
                              type: "groupRequest",
                            })
                          );
                        }}
                        className="border-[2px] border-[#975ba1] pt-2 pb-2 pr-8 pl-8 rounded-3xl"
                      >
                        Purge
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        acceptRequest(request);
                        dispatch(
                          setRequestAccepted({
                            uid: request?.uid,
                            email: request?.email,
                            timer: fiveMinutesInSeconds,
                            type: "groupRequest",
                          })
                        );
                      }}
                      className="bg-[#975ba1] pt-2 pb-2 pr-8 pl-8 rounded-3xl"
                    >
                      Accept
                    </button>
                  )}
                </div>
                <p className="ml-6 text-gray-300 text-sm font-bold tracking-widest">
                  Group: {request?.groupName}
                </p>
                {/* <p>{displayTime(exists?.timer)}</p> */}
                <hr className="border-t-1 border-[#975ba1] h-1" />
              </div>
            );
          } else if (request?.displayName) {
            return (
              <div key={i}>
                <div className="flex items-start justify-between p-4 font-medium">
                  <div className="flex items-start gap-3">
                    <img
                      src={chat_profile}
                      alt="find friend's profile_picture"
                      className="w-[45px] h-[45px] rounded-[50%] object-cover"
                    />
                    <p>{request?.displayName}</p>
                  </div>
                  {exists ? (
                    <div>
                      <button
                        onClick={() => {
                          purgeRequet(request);
                          dispatch(
                            setPurgeRequest({
                              uid: request?.uid,
                              type: "friendRequest",
                            })
                          );
                        }}
                        className="border-[2px] border-[#975ba1] pt-2 pb-2 pr-8 pl-8 rounded-3xl"
                      >
                        Purge
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        acceptRequest(request);
                        dispatch(
                          setRequestAccepted({
                            uid: request?.uid,
                            email: request?.email,
                            timer: fiveMinutesInSeconds,
                            type: "friendRequest",
                          })
                        );
                      }}
                      className="bg-[#975ba1] pt-2 pb-2 pr-8 pl-8 rounded-3xl"
                    >
                      Accept
                    </button>
                  )}
                </div>
                {/* <p>{displayTime(exists?.timer)}</p> */}
                <hr className="border-t-1 border-[#975ba1] h-1" />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Requests;

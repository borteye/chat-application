import chat_profile from "../assets/chat_profile.jpg";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React, { FC, useState } from "react";
import firebase from "firebase/compat/app";
import db from "../firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDisplayName,
  selectEmail,
  selectOccupation,
  selectPhoneNumber,
  selectUid,
} from "../features/userSlice";
import {
  setAddNewConnect,
  discoverConnectionState,
} from "../features/discoverConnectionsInfoSlice";
import {
  DiscoverConnectionsInfo,
  BasicFriendInfo,
  BasicGroupInfo,
  BasicUserInfo,
} from "../typings";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import {
  requestToJoinGroup,
  sendFriendRequest,
  undoFriendRequest,
  undoGroupRequest,
} from "../utils";

interface Props {
  isDFOpen: boolean;
  setIsDFOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DiscoverConnections: FC<Props> = ({ isDFOpen, setIsDFOpen }) => {
  const [search, setSearch] = useState<string>("");

  const dispatch = useDispatch();

  //* current user's info
  const currentUserUid = useSelector(selectUid);
  const currentUserDisplayName = useSelector(selectDisplayName);
  const currentUserEmail = useSelector(selectEmail);
  const currentUserOccupation = useSelector(selectOccupation);
  const currentUserPhoneNumber = useSelector(selectPhoneNumber);

  //* Discover Connections State
  const discovCState = useSelector(discoverConnectionState);

  let persons: BasicFriendInfo[] = [];
  let groups: BasicGroupInfo[] = [];
  let strangersRef;
  let groupsRef;

  const friendgroupRef: any = db.collection("chat").doc(currentUserUid);
  const [friendgroupSnapshot, loading, error] = useDocument(friendgroupRef);

  if (friendgroupSnapshot?.exists) {
    //* unrelated users
    persons = friendgroupSnapshot?.data()?.friends || [];

    if (persons.length > 0) {
      strangersRef = db
        .collection("users")
        .where(firebase.firestore.FieldPath.documentId(), "not-in", [
          ...persons?.map((friend: BasicFriendInfo) => friend?.uid),
          currentUserUid,
        ]);
    } else {
      strangersRef = db
        .collection("users")
        .where(firebase.firestore.FieldPath.documentId(), "!=", currentUserUid);
    }

    //* unrelated groups
    groups = friendgroupSnapshot?.data()?.groups || [];

    if (groups.length > 0) {
      groupsRef = db.collection("groups").where(
        firebase.firestore.FieldPath.documentId(),
        "not-in",
        groups?.map((group: BasicGroupInfo) => group?.uid)
      );
    } else {
      groupsRef = db.collection("groups");
    }
  } else if (!friendgroupSnapshot?.exists) {
    strangersRef = db
      .collection("users")
      .where(firebase.firestore.FieldPath.documentId(), "!=", currentUserUid);
    groupsRef = db.collection("groups");
    console.log(groupsRef);
  }

  //* unrelated users
  const [strangersSnapshot, loadingStrangers, errorStrangers] =
    useCollection(strangersRef);

  const strangers =
    strangersSnapshot?.docs?.map((doc) => doc?.data() as BasicFriendInfo) || [];

  //* unrelated groups
  const [groupDocsSnapshot, loadingGroupDoc, errorGroups] =
    useCollection(groupsRef);
  const newGroups =
    groupDocsSnapshot?.docs?.map((doc) => doc.data() as BasicGroupInfo) || [];

  const unrelatedConnection: (BasicFriendInfo | BasicGroupInfo)[] = [
    ...strangers,
    ...newGroups,
  ];

  const sendRequest = async (
    newConnections: BasicFriendInfo | BasicGroupInfo
  ) => {
    if (newConnections?.uid && (newConnections as BasicGroupInfo)?.groupName) {
      requestToJoinGroup(
        newConnections as BasicGroupInfo,
        {
          currentUserDisplayName,
          currentUserEmail,
          currentUserOccupation,
          currentUserPhoneNumber,
          currentUserUid,
        } as BasicUserInfo
      );
    } else if (
      newConnections?.uid &&
      (newConnections as BasicFriendInfo)?.displayName
    ) {
      sendFriendRequest(
        newConnections as BasicFriendInfo,
        {
          currentUserDisplayName,
          currentUserEmail,
          currentUserOccupation,
          currentUserPhoneNumber,
          currentUserUid,
        } as BasicUserInfo
      );
    }
  };

  const undoRequest = async (
    newConnections: BasicFriendInfo | BasicGroupInfo
  ) => {
    if (newConnections?.uid && (newConnections as BasicGroupInfo)?.groupName) {
      undoGroupRequest(
        newConnections as BasicGroupInfo,
        {
          currentUserDisplayName,
          currentUserEmail,
          currentUserOccupation,
          currentUserPhoneNumber,
          currentUserUid,
        } as BasicUserInfo
      );
    } else if (
      newConnections?.uid &&
      (newConnections as BasicFriendInfo)?.displayName
    ) {
      undoFriendRequest(
        newConnections as BasicFriendInfo,
        {
          currentUserDisplayName,
          currentUserEmail,
          currentUserOccupation,
          currentUserPhoneNumber,
          currentUserUid,
        } as BasicUserInfo
      );
    }
  };

  return (
    <div
      className={` ${
        !isDFOpen ? "hidden" : false
      } h-[80vh] w-[25vw] bg-[#55254b] text-white position: absolute top-12 right-5 z-50 shadow-[0_3px_10px_rgb(0,0,0,0.2)]`}
    >
      <div className="bg-[#975ba1] p-4 flex flex-col gap-2">
        <div className="flex items-center gap-16">
          <p className="cursor-pointer" onClick={() => setIsDFOpen(false)}>
            Close
          </p>
          <h1 className="text-xl">Discover Connections</h1>
        </div>
        <div className="mt-2 bg-[#55254b] flex items-center pt-[0.125rem] pb-[0.125] pr-3 pl-3 rounded-2xl">
          <MagnifyingGlassIcon className="w-[1.5rem] h-[1.5rem] text-white" />
          <input
            type="text"
            placeholder="Enter a friend or group name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full h-[2.5rem] pr-3 pl-3 text-white"
          />
        </div>
      </div>
      <div className="h-[62vh] overflow-y-scroll no-scrollbar">
        {unrelatedConnection
          ?.filter((val) => {
            if (search == "") {
              return val;
            } else if (
              (val as BasicFriendInfo)?.displayName
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
              (val as BasicGroupInfo)?.groupName
                ?.toLowerCase()
                .includes(search.toLowerCase())
            ) {
              return val;
            }
          })
          .map((newConnections, i) => {
            const exists = discovCState?.find(
              (doc: DiscoverConnectionsInfo) => doc?.uid === newConnections?.uid
            );
            if ((newConnections as BasicGroupInfo)?.groupName) {
              return (
                <div key={i}>
                  <div className="flex items-start justify-between p-4 font-medium ">
                    <div className="flex items-start gap-3">
                      <div>
                        <img
                          src={chat_profile}
                          alt="find friend's profile_picture"
                          className="w-[45px] h-[45px] rounded-[50%] object-cover"
                        />
                        <p className="text-gray-300 text-sm">group</p>
                      </div>

                      <p>{(newConnections as BasicGroupInfo)?.groupName}</p>
                    </div>
                    {exists ? (
                      <button
                        onClick={() => {
                          undoRequest(newConnections);
                          dispatch(
                            setAddNewConnect({
                              uid: newConnections?.uid,
                            })
                          );
                        }}
                        className="border-[2px] border-[#975ba1] pt-2 pb-2 pr-8 pl-8 rounded-3xl"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          sendRequest(newConnections);
                          dispatch(
                            setAddNewConnect({
                              uid: newConnections?.uid,
                              groupName: (newConnections as BasicGroupInfo)
                                ?.groupName,
                            })
                          );
                        }}
                        className="bg-[#975ba1] pt-2 pb-2 pr-8 pl-8 rounded-3xl"
                      >
                        Join
                      </button>
                    )}
                  </div>
                  <hr className="border-t-1 border-[#975ba1] h-1" />
                </div>
              );
            } else if ((newConnections as BasicFriendInfo)?.displayName) {
              return (
                <div key={i}>
                  <div className="flex items-start justify-between p-4 font-medium ">
                    <div className="flex items-start gap-3">
                      <img
                        src={chat_profile}
                        alt="find friend's profile_picture"
                        className="w-[45px] h-[45px] rounded-[50%] object-cover"
                      />
                      <p>{(newConnections as BasicFriendInfo)?.displayName}</p>
                    </div>
                    {exists ? (
                      <button
                        onClick={() => {
                          undoRequest(newConnections);
                          dispatch(
                            setAddNewConnect({
                              uid: newConnections?.uid,
                            })
                          );
                        }}
                        className="border-[2px] border-[#975ba1] pt-2 pb-2 pr-8 pl-8 rounded-3xl"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          sendRequest(newConnections);
                          dispatch(
                            setAddNewConnect({
                              uid: newConnections?.uid,
                              email: (newConnections as BasicFriendInfo)?.email,
                            })
                          );
                        }}
                        className="bg-[#975ba1] pt-2 pb-2 pr-8 pl-8 rounded-3xl"
                      >
                        Add
                      </button>
                    )}
                  </div>
                  <hr className="border-t-1 border-[#975ba1] h-1" />
                </div>
              );
            }
          })}
      </div>
    </div>
  );
};

export default DiscoverConnections;

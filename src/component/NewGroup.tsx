import React, { FC, useState } from "react";
import { ArrowLeftIcon, CameraIcon } from "@heroicons/react/24/outline";
import chat_profile from "../assets/chat_profile.jpg";
import firebase from "firebase/compat/app";
import db from "../firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDisplayName,
  selectEmail,
  selectUid,
} from "../features/userSlice";
import {
  newGroupState,
  setNewGroup,
  setResetGroup,
} from "../features/newGroupSlice";
import { BasicFriendInfo } from "../typings";
import { useDocument } from "react-firebase-hooks/firestore";

type Props = {
  isNGOpen: boolean;
  setIsNGOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const NewGroup: FC<Props> = ({ isNGOpen, setIsNGOpen }) => {
  const [isNext, setIsNext] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const dispatch = useDispatch();

  //* newGroup creation currentState
  const newGroup = useSelector(newGroupState);

  //* currentUser info
  const currentUserUid = useSelector(selectUid);
  const currentUserEmail = useSelector(selectEmail);
  const currentUserDisplayName = useSelector(selectDisplayName);

  //* friends of current User
  let friends;
  const friendsRef: any = db.collection("chat").doc(currentUserUid);

  const [friendsSnapshot, loading, error] = useDocument(friendsRef);

  if (friendsSnapshot?.exists) {
    friends = (friendsSnapshot?.data()?.friends as BasicFriendInfo[]) || [];
  }

  //* create group function
  const handleCreateGroup = async () => {
    //* if the user fails to input a group name, don't run the codes below
    if (groupName === "") return;

    //* Get a reference to the collection
    const collectionRef = db.collection("groups");

    //* Generate an auto-generated UID
    const uid = collectionRef.doc().id;

    await collectionRef.doc(uid).set(
      {
        adminMail: currentUserEmail,
        adminName: currentUserDisplayName,
        createdAt: new Date().toLocaleDateString(),
        groupName: groupName,
        uid: uid,
      },
      { merge: true }
    );

    //* Add group admin to participants with a unqiue role
    const participantAdmin = {
      displayName: currentUserDisplayName,
      email: currentUserEmail,
      role: "admin",
      uid: currentUserUid,
    };

    //* Array of participants to be added
    const participantMembers = newGroup?.map((person: BasicFriendInfo) => {
      return {
        displayName: person?.displayName,
        email: person?.email,
        role: "member",
        uid: person?.uid,
      };
    });

    //* add admin/members to group in group collection
    await collectionRef.doc(uid).set(
      {
        Participants: firebase.firestore.FieldValue.arrayUnion(
          participantAdmin,
          ...participantMembers
        ),
      },
      { merge: true }
    );

    //* add group created to the admin's groups in chat collection
    await db
      .collection("chat")
      .doc(currentUserUid)
      .set(
        {
          groups: firebase.firestore.FieldValue.arrayUnion({
            adminMail: currentUserEmail,
            adminName: currentUserDisplayName,
            createdAt: new Date().toLocaleDateString(),
            groupName: groupName,
            uid: uid,
          }),
        },
        { merge: true }
      );

    //* add new group to friends groups in chat collection
    newGroup?.map(async (person: BasicFriendInfo) => {
      await db
        .collection("chat")
        .doc(person?.uid)
        .set(
          {
            groups: firebase.firestore.FieldValue.arrayUnion({
              adminMail: currentUserEmail,
              adminName: currentUserDisplayName,
              createdAt: new Date().toLocaleDateString(),
              groupName: groupName,
              uid: uid,
            }),
          },
          { merge: true }
        );
    });

    setIsNGOpen(false);
    setIsNext(false);
    dispatch(setResetGroup());
    setGroupName("");
  };

  return (
    <div
      className={`bg-white shadow-md h-[calc(100%-2rem)]  max-w-[40rem]  py-6  position: absolute ${
        isNGOpen ? "top-6" : "top-[-100%]"
      }  small-tablet:left-40 small-laptop:left-[17rem] duration-500 rounded-xl`}
    >
      <div className="flex items-center gap-8 mb-4 px-6">
        <ArrowLeftIcon
          className="w-8 h-8n cursor-pointer"
          onClick={() => {
            setIsNGOpen(false);
            setIsNext(false);
            dispatch(setResetGroup());
          }}
        />
        <p className="text-2xl font-medium">New Group</p>
      </div>
      <div className="px-6 mb-4">
        <div className="border border-black  border-bottom mb-4">
          <div className="flex flex-wrap items-center gap-2 ">
            {newGroup?.map((person: BasicFriendInfo) => {
              return (
                <div className="bg-[#975ba1] px-4 py-1 text-white w-fit">
                  {person?.displayName}
                </div>
              );
            })}
            {!isNext && (
              <input
                type="text"
                placeholder="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-auto text-[1.25rem] pl-2 pt-[0.25rem] pb-[0.25rem] outline-none"
              />
            )}
          </div>
        </div>
        {newGroup?.length > 0 && (
          <div>
            {!isNext && (
              <div className=" flex items-center justify-between">
                <button
                  onClick={() => setIsNext(true)}
                  className="bg-[#55254b] text-white px-4 py-1 w-[45%] rounded-md"
                >
                  Next
                </button>
                <button className="w-[45%] px-4 py-1 rounded-md shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {isNext ? (
        <div className="flex flex-col justify-between h-[calc((100%-2rem)-(70px))]">
          <div>
            <div className="flex items-center gap-4 px-6 mb-4">
              <div className="w-14 h-14 flex items-center justify-center rounded-[50%] shadow-[0_3px_10px_rgb(0,0,0,0.2)] ">
                <CameraIcon className="w-7 h-7  text-center " />
              </div>
              <p>Add group icon (optional)</p>
            </div>
            <div className="px-6">
              <p className="mb-2">Provide a group name</p>
              <input
                type="text"
                placeholder="Group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-2 py-1 border border-black outline-none border-bottom"
              />
            </div>
          </div>
          <div className="flex items-center justify-between px-6 ">
            <button
              onClick={handleCreateGroup}
              className="bg-[#55254b] text-white px-4 py-2 w-[45%] rounded-md"
            >
              Create
            </button>
            <button className="w-[45%] px-4 py-2 rounded-md shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-gray-500 mb-4 px-6 text-lg">All Friends</p>
          <div className=" h-[calc((100%+2rem)-11rem)] flex flex-col  overflow-y-scroll no-scrollbar">
            {friends
              ?.filter((val) => {
                if (search == "") {
                  return val;
                } else if (
                  val.displayName?.toLowerCase().includes(search.toLowerCase())
                ) {
                  return val;
                }
              })
              ?.map((friend) => {
                const exist = newGroup?.find(
                  (user: BasicFriendInfo) => user?.uid === friend?.uid
                );
                return (
                  <div className="flex  items-center justify-between small-laptop:gap-[2rem] px-6 py-4 hover:bg-[#f9b142]">
                    <div className="flex items-center gap-5">
                      <img
                        src={chat_profile}
                        alt="chat profile"
                        loading="lazy"
                        className="w-[45px] h-[45px] rounded-[50%] object-cover"
                      />
                      <div className="text-lg font-medium">
                        {friend?.displayName}
                      </div>
                    </div>
                    {exist ? (
                      <button
                        className="bg-[#55254b] text-white px-4 py-2 font-medium rounded-lg"
                        onClick={() => dispatch(setNewGroup(friend))}
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        className="bg-[#55254b] text-white px-4 py-2 font-medium rounded-lg"
                        onClick={() => dispatch(setNewGroup(friend))}
                      >
                        Add
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
export default NewGroup;

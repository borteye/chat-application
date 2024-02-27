import React, { FC, useState } from "react";
import { BriefcaseIcon, PhoneIcon, UserIcon } from "@heroicons/react/24/solid";
import { useSelector, useDispatch } from "react-redux";
import {
  selectDisplayName,
  selectEmail,
  selectOccupation,
  selectPhoneNumber,
  selectUid,
  setActiveUser,
} from "../features/userSlice";
import db from "../firebaseConfig";

const Update: FC = () => {
  const userDisplayName = useSelector(selectDisplayName);
  const [username, setUsername] = useState<string>(userDisplayName as string);
  const [phone, setPhone] = useState<string>("");
  const [occupation, setOccupation] = useState<string>("");

  const dispatch = useDispatch();

  //* Current User info
  const userUid = useSelector(selectUid);
  const userOccupation = useSelector(selectOccupation);
  const userPhoneNumber = useSelector(selectPhoneNumber);
  const userEmail = useSelector(selectEmail);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    userUid &&
      db.collection("users").doc(userUid).update({
        displayName: username,
        occupation: occupation,
        phoneNumber: phone,
      });

    dispatch(
      setActiveUser({
        userUid: userUid,
        userDisplayName: username,
        userEmail: userEmail,
        userOccupation: occupation,
        userPhoneNumber: phone,
      })
    );
  };

  return (
    <div className="position: absolute  bg-[#00000081] top-0 h-full w-full flex items-center justify-center">
      <div className="bg-white max-w-[24rem] p-5 rounded-xl">
        <h1 className=" font-semibold text-center text-2xl medium-tablet:text-3xl mb-6">
          Update Info
        </h1>
        <form onSubmit={handleUpdate} className="flex flex-col gap-6 ">
          {!userDisplayName && (
            <div className="flex items-center bg-[#d5aadb79] gap-2 pr-3 pl-3 rounded-xl">
              <UserIcon className="w-5 h-5  text-[#55254b] " />
              <input
                type="text"
                placeholder="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-transparent border-none outline-none pt-2 pb-2 pr-1 pl-1 text-xl"
              />
            </div>
          )}
          {!userOccupation && (
            <div className="flex items-center bg-[#d5aadb79] gap-2 pr-3 pl-3 rounded-xl">
              <BriefcaseIcon className="w-5 h-5 medium-tablet:w-7 medium-tablet:h-7 text-[#55254b] " />
              <input
                type="text"
                placeholder="Occupation"
                required
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="bg-transparent w-[70vw] max-w-[18rem] border-none outline-none pt-2 pb-2 pr-1 pl-1 text-xl"
              />
            </div>
          )}
          {!userPhoneNumber && (
            <div className="flex items-center bg-[#d5aadb79] gap-2 pr-3 pl-3 rounded-xl">
              <PhoneIcon className="w-5 h-5 medium-tablet:w-7 medium-tablet:h-7 text-[#55254b] " />
              <input
                type="text"
                placeholder="Phone Number"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                pattern="[0-9]*"
                title="Please enter only numeric characters"
                className="bg-transparent w-[70vw] max-w-[18rem] outline-none pt-2 pb-2 pr-1 pl-1 text-xl"
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-[#975ba1] flex items-center justify-center text-center w-full border-none pt-3 pb-3 text-white font-medium text-lg rounded-xl"
          >
            UPDATE
          </button>
        </form>
      </div>
    </div>
  );
};

export default Update;

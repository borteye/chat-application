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

  console.log(userDisplayName);
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
      <div className="bg-white w-[27vw] p-10 rounded-xl">
        <h1 className="text-3xl font-semibold text-center mb-6">Update Info</h1>
        <form onSubmit={handleUpdate}>
          {!userDisplayName && (
            <div className="mb-6 flex items-center bg-[#d5aadb79] gap-2 pr-3 pl-3 rounded-xl">
              <UserIcon className="w-6 h-6 text-[#55254b] " />
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
            <div className="mb-6 flex items-center bg-[#d5aadb79] gap-2 pr-3 pl-3 rounded-xl">
              <BriefcaseIcon className="w-6 h-6 text-[#55254b] " />
              <input
                type="text"
                placeholder="Occupation"
                required
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="bg-transparent border-none outline-none pt-2 pb-2 pr-1 pl-1 text-xl"
              />
            </div>
          )}
          {!userPhoneNumber && (
            <div className="mb-6 flex items-center bg-[#d5aadb79] gap-2 pr-3 pl-3 rounded-xl">
              <PhoneIcon className="w-6 h-6 text-[#55254b] " />
              <input
                type="text"
                placeholder="Phone Number"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                pattern="[0-9]*"
                title="Please enter only numeric characters"
                className="bg-transparent border-none outline-none pt-2 pb-2 pr-1 pl-1 text-xl"
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

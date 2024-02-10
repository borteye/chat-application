import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectGroupUid } from "../features/groupSlice";
import { selectCombinedUid } from "../features/friendSlice";
import firebase from "firebase/compat/app";
import db from "../firebaseConfig";
import { selectDisplayName, selectEmail } from "../features/userSlice";

const SendMessage = () => {
  const [text, setText] = useState<string>("");

  //* currentUser info
  const currentUserEmail = useSelector(selectEmail);
  const currentUserDisplayName = useSelector(selectDisplayName);

  //* active group uid
  const groupUid = useSelector(selectGroupUid);

  //* combined uid of friend and current user
  const combinedUid = useSelector(selectCombinedUid);

  const handleSendMessage: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();
    if (text === "") return;
    if (combinedUid) {
      setText("");
      const collectionRef = await db
        .collection("conversations")
        .doc(combinedUid)
        .collection("messages");
      //* Generate an auto-generated UID
      const uid = collectionRef.doc().id;
      await collectionRef.doc(uid).set(
        {
          senderEmail: currentUserEmail,
          id: uid,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          message: text,
        },
        { merge: true }
      );
    } else if (groupUid) {
      setText("");
      const collectionRef = await db
        .collection("conversations")
        .doc(groupUid)
        .collection("messages");
      //* Generate an auto-generated UID
      const uid = collectionRef.doc().id;
      await collectionRef.doc(uid).set(
        {
          senderEmail: currentUserEmail,
          senderName: currentUserDisplayName,
          id: uid,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          message: text,
        },
        { merge: true }
      );
    }
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className=" bg-[#975ba1] w-[70%]  pr-6 pl-6 flex items-center   justify-between rounded-3xl"
    >
      <input
        type="text"
        placeholder="Reply Message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="normal-text italic-placeholder w-full pr-2 pl-2 pt-1 pb-1 bg-transparent outline-none text-white "
      />
      <button>
        <PaperAirplaneIcon className="w-7 h-7 text-white cursor-pointer " />
      </button>
    </form>
  );
};

export default SendMessage;

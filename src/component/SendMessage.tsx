import { PaperAirplaneIcon, PhotoIcon } from "@heroicons/react/24/solid";
import React, { FC, useState } from "react";
import { useSelector } from "react-redux";
import { selectGroupUid } from "../features/groupSlice";
import { selectCombinedUid } from "../features/friendSlice";
import firebase from "firebase/compat/app";
import db from "../firebaseConfig";
import chat_profile from "../assets/chat_profile.jpg";
import { selectDisplayName, selectEmail } from "../features/userSlice";
import {
  loadImage,
  sendFriendChatMessage,
  sendGroupChatMessage,
} from "../utils";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface Props {
  imagePreview: string;
  setImagePreview: React.Dispatch<React.SetStateAction<string>>;
  imageURL: string;
  setImageURL: React.Dispatch<React.SetStateAction<string>>;
  setProgress: React.Dispatch<React.SetStateAction<number | null>>;
  progress: number | null;
}

const SendMessage: FC<Props> = ({
  imagePreview,
  setImagePreview,
  imageURL,
  setImageURL,
  setProgress,
  progress,
}) => {
  const [text, setText] = useState<string>("");

  //* currentUser info
  const currentUserEmail = useSelector(selectEmail);
  const currentUserDisplayName = useSelector(selectDisplayName);

  //* active group uid
  const groupUid = useSelector(selectGroupUid);

  //* combined uid of friend and current user
  const combinedUid = useSelector(selectCombinedUid);

  //* image onChange
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = e.target.files?.[0];
    console.log(file);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
    console.log(imagePreview);
    loadImage(file, setImageURL, setProgress, imagePreview);
  };

  const handleSendMessage: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();
    if (text === "") {
      if (imageURL === "") {
        return;
      }
    }
    if (combinedUid) {
      sendFriendChatMessage(
        combinedUid,
        currentUserEmail,
        text,
        setText,
        imageURL,
        setImageURL,
        setProgress
      );
    } else if (groupUid) {
      sendGroupChatMessage(
        groupUid,
        currentUserEmail,
        currentUserDisplayName,
        text,
        setText,
        imageURL,
        setImageURL,
        setProgress
      );
    }
  };

  function CircularProgressWithLabel(
    props: CircularProgressProps & { value: number }
  ) {
    return (
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress color="success" variant="determinate" {...props} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="caption"
            component="div"
            color="#fff"
          >{`${Math.round(props.value)}%`}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <section className="bg-[#55254b] p-4 gap-2 rounded-xl flex items-center justify-evenly">
      <div className="image">
        <input
          type="file"
          id="image"
          className="hidden"
          onChange={handleImageChange}
        />
        <label htmlFor="image">
          <PhotoIcon className="w-7 h-7 text-gray-200 cursor-pointer " />
        </label>
      </div>
      {imageURL && progress ? (
        <CircularProgressWithLabel value={progress} />
      ) : (
        false
      )}

      <form
        onSubmit={handleSendMessage}
        className=" bg-[#975ba1]  small-laptop:w-[70%] w-[90%]  pr-6 pl-6 flex items-center   justify-between rounded-3xl"
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
    </section>
  );
};

export default SendMessage;

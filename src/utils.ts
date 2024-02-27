import firebase from "firebase/compat/app";
import db from "./firebaseConfig";
import { storage } from "./firebaseConfig";
import {
  BasicFriendInfo,
  BasicGroupInfo,
  BasicUserInfo,
  MessageInfo,
  RequestInfo,
} from "./typings";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

async function requestToJoinGroup(
  newConnections: BasicGroupInfo,
  {
    currentUserDisplayName,
    currentUserEmail,
    currentUserOccupation,
    currentUserPhoneNumber,
    currentUserUid,
  }: BasicUserInfo
) {
  await db
    .collection("requests")
    .doc(newConnections?.uid)
    .set(
      {
        requests: firebase.firestore.FieldValue.arrayUnion({
          displayName: currentUserDisplayName,
          email: currentUserEmail,
          groupName: (newConnections as BasicGroupInfo)?.groupName,
          groupUid: newConnections?.uid,
          createdAt: (newConnections as BasicGroupInfo)?.createdAt,
          occupation: currentUserOccupation,
          phoneNumber: currentUserPhoneNumber,
          uid: currentUserUid,
          type: "groupRequest",
        }),
      },
      {
        merge: true,
      }
    );
}

async function sendFriendRequest(
  newConnections: BasicFriendInfo,
  {
    currentUserDisplayName,
    currentUserEmail,
    currentUserOccupation,
    currentUserPhoneNumber,
    currentUserUid,
  }: BasicUserInfo
) {
  await db
    .collection("requests")
    .doc(newConnections?.uid)
    .set(
      {
        requests: firebase.firestore.FieldValue.arrayUnion({
          uid: currentUserUid,
          displayName: currentUserDisplayName,
          phoneNumber: currentUserPhoneNumber,
          email: currentUserEmail,
          occupation: currentUserOccupation,
          type: "friendRequest",
        }),
      },
      { merge: true }
    );
}

async function undoGroupRequest(
  newConnections: BasicGroupInfo,
  {
    currentUserDisplayName,
    currentUserEmail,
    currentUserOccupation,
    currentUserPhoneNumber,
    currentUserUid,
  }: BasicUserInfo
) {
  await db
    .collection("requests")
    .doc(newConnections?.uid)
    .update({
      requests: firebase.firestore.FieldValue.arrayRemove({
        displayName: currentUserDisplayName,
        email: currentUserEmail,
        groupName: (newConnections as BasicGroupInfo)?.groupName,
        groupUid: newConnections?.uid,
        createdAt: (newConnections as BasicGroupInfo)?.createdAt,
        occupation: currentUserOccupation,
        phoneNumber: currentUserPhoneNumber,
        uid: currentUserUid,
        type: "groupRequest",
      }),
    });
}

async function undoFriendRequest(
  newConnections: BasicFriendInfo,
  {
    currentUserDisplayName,
    currentUserEmail,
    currentUserOccupation,
    currentUserPhoneNumber,
    currentUserUid,
  }: BasicUserInfo
) {
  await db
    .collection("requests")
    .doc(newConnections?.uid)
    .update({
      requests: firebase.firestore.FieldValue.arrayRemove({
        uid: currentUserUid,
        displayName: currentUserDisplayName,
        phoneNumber: currentUserPhoneNumber,
        email: currentUserEmail,
        occupation: currentUserOccupation,
        type: "friendRequest",
      }),
    });
}

async function addGroupDetailsToRequester(
  request: RequestInfo,
  { currentUserDisplayName, currentUserEmail }: BasicUserInfo
) {
  await db
    .collection("chat")
    .doc(request?.uid)
    .set(
      {
        groups: firebase.firestore.FieldValue.arrayUnion({
          adminName: currentUserDisplayName,
          adminMail: currentUserEmail,
          createdAt: request?.createdAt,
          groupName: request?.groupName,
          uid: request?.groupUid,
        }),
      },
      { merge: true }
    );
}

async function addRequesterToGroupParticipants(request: RequestInfo) {
  await db
    .collection("groups")
    .doc(request?.groupUid)
    .set(
      {
        Participants: firebase.firestore.FieldValue.arrayUnion({
          displayName: request?.displayName,
          email: request?.email,
          role: "member",
          uid: request?.uid,
        }),
      },
      { merge: true }
    );
}

async function addRequesterToUserFriends(
  request: RequestInfo,
  { currentUserUid }: BasicUserInfo
) {
  await db
    .collection("chat")
    .doc(currentUserUid)
    .set(
      {
        friends: firebase.firestore.FieldValue.arrayUnion({
          displayName: request?.displayName,
          email: request?.email,
          friendSince: new Date().toLocaleDateString(),
          phoneNumber: request?.phoneNumber,
          uid: request?.uid,
          occupation: request?.occupation,
        }),
      },
      { merge: true }
    );
}

async function addUserToRequesterFriends(
  request: RequestInfo,
  {
    currentUserDisplayName,
    currentUserEmail,
    currentUserPhoneNumber,
    currentUserUid,
    currentUserOccupation,
  }: BasicUserInfo
) {
  await db
    .collection("chat")
    .doc(request?.uid)
    .set(
      {
        friends: firebase.firestore.FieldValue.arrayUnion({
          displayName: currentUserDisplayName,
          email: currentUserEmail,
          friendSince: new Date().toLocaleDateString(),
          phoneNumber: currentUserPhoneNumber,
          uid: currentUserUid,
          occupation: currentUserOccupation,
        }),
      },
      { merge: true }
    );
}

async function removeGroupDetailsFromRequester(
  request: RequestInfo,
  { currentUserDisplayName, currentUserEmail }: BasicUserInfo
) {
  await db
    .collection("chat")
    .doc(request?.uid)
    .update({
      groups: firebase.firestore.FieldValue.arrayRemove({
        adminName: currentUserDisplayName,
        adminMail: currentUserEmail,
        createdAt: request?.createdAt,
        groupName: request?.groupName,
        uid: request?.groupUid,
      }),
    });
}

async function removeRequesterFromGroupParticipants(request: RequestInfo) {
  await db
    .collection("groups")
    .doc(request?.groupUid)
    .update({
      Participants: firebase.firestore.FieldValue.arrayRemove({
        displayName: request?.displayName,
        email: request?.email,
        role: "member",
        uid: request?.uid,
      }),
    });
}

async function removeRequesterFromUserFriends(
  request: RequestInfo,
  { currentUserUid }: BasicUserInfo
) {
  await db
    .collection("chat")
    .doc(currentUserUid)
    .update({
      friends: firebase.firestore.FieldValue.arrayRemove({
        displayName: request?.displayName,
        email: request?.email,
        friendSince: new Date().toLocaleDateString(),
        phoneNumber: request?.phoneNumber,
        uid: request?.uid,
        occupation: request?.occupation,
      }),
    });
}

async function removeUserFromRequesterFriends(
  request: RequestInfo,
  {
    currentUserDisplayName,
    currentUserEmail,
    currentUserPhoneNumber,
    currentUserUid,
    currentUserOccupation,
  }: BasicUserInfo
) {
  await db
    .collection("chat")
    .doc(request?.uid)
    .update({
      friends: firebase.firestore.FieldValue.arrayRemove({
        displayName: currentUserDisplayName,
        email: currentUserEmail,
        friendSince: new Date().toLocaleDateString(),
        phoneNumber: currentUserPhoneNumber,
        uid: currentUserUid,
        occupation: currentUserOccupation,
      }),
    });
}

//*image upload start //

//load selected file into variable
const loadImage = (
  file: File | undefined,
  setImageURL: React.Dispatch<React.SetStateAction<string>>,
  setProgress: React.Dispatch<React.SetStateAction<number | null>>,
  imagePreview: string
) => {
  if (!file) return;

  const StorageRef = ref(storage, `/files/${file.name}`);

  const uploadTask = uploadBytesResumable(StorageRef, file);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // The loading  variable is the time it takes to upload the file to firebase from 0 to 100%. You can display it on front end.
      const loading: number | null = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );

      // create a progress variable and set loading to it.
      setProgress(loading);
    },
    (err) => console.log(err),
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((url) => {
        //This is the file or image  url

        setImageURL(url);
      });
    }
  );
};

//*image upload finish //

async function sendFriendChatMessage(
  combinedUid: string | undefined,
  currentUserEmail: string | null,
  text: string,
  setText: React.Dispatch<React.SetStateAction<string>>,
  imageURL: string,
  setImageURL: React.Dispatch<React.SetStateAction<string>>,
  setProgress: React.Dispatch<React.SetStateAction<number | null>>
) {
  console.log(imageURL);
  setText("");
  setImageURL("");
  setProgress(null);
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
      image: imageURL,
    },
    { merge: true }
  );
}

async function sendGroupChatMessage(
  groupUid: string | undefined,
  currentUserEmail: string | null,
  currentUserDisplayName: string | null,
  text: string,
  setText: React.Dispatch<React.SetStateAction<string>>,
  imageURL: string,
  setImageURL: React.Dispatch<React.SetStateAction<string>>,
  setProgress: React.Dispatch<React.SetStateAction<number | null>>
) {
  setText("");
  setImageURL("");
  setProgress(null);
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
      image: imageURL,
    },
    { merge: true }
  );
}

function dateFormatter(date: Date) {
  const dateString = date;
  const dateObject = new Date(dateString);
  const formattedDate = `${dateObject.getDate()}/${
    dateObject.getMonth() + 1
  }/${dateObject.getFullYear()}`;

  return formattedDate;
}

const groupMessagesByDate = (
  conversation: MessageInfo[] | undefined
): { date: string; messages: MessageInfo[] }[] => {
  if (!conversation) return [];

  const groupedMessages = conversation.reduce(
    (
      previousValue: { date: string; messages: MessageInfo[] }[],
      currentValue: MessageInfo
    ) => {
      const date: string = dateFormatter(currentValue?.createdAt?.toDate());
      const existingDateIndex = previousValue.findIndex(
        (item) => item?.date === date
      );

      if (existingDateIndex !== -1) {
        previousValue[existingDateIndex].messages.push(currentValue);
      } else {
        previousValue.push({ date: date, messages: [currentValue] });
      }

      return previousValue;
    },
    [] as { date: string; messages: MessageInfo[] }[]
  );

  return groupedMessages;
};

export {
  requestToJoinGroup,
  sendFriendRequest,
  undoGroupRequest,
  undoFriendRequest,
  addGroupDetailsToRequester,
  addRequesterToGroupParticipants,
  addRequesterToUserFriends,
  addUserToRequesterFriends,
  removeGroupDetailsFromRequester,
  removeRequesterFromGroupParticipants,
  removeRequesterFromUserFriends,
  removeUserFromRequesterFriends,
  sendFriendChatMessage,
  sendGroupChatMessage,
  loadImage,
  dateFormatter,
  groupMessagesByDate,
};

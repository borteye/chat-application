import firebase from "firebase/compat/app";
import db from "./firebaseConfig";
import {
  BasicFriendInfo,
  BasicGroupInfo,
  BasicUserInfo,
  RequestInfo,
} from "./typings";
import { useSelector } from "react-redux";
import {
  selectDisplayName,
  selectEmail,
  selectOccupation,
  selectPhoneNumber,
  selectUid,
} from "./features/userSlice";

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
};

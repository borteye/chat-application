interface UserDetails {
  user: {
    uid: string | undefined;
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    occupation: null;
  };
}

type BasicUserInfo = {
  uid: string | undefined;
  email: string | null;
  displayName: string | null;
  currentUserUid?: string | undefined;
  currentUserDisplayName?: string | null;
  currentUserEmail?: string | null;
  currentUserOccupation?: string | null;
  currentUserPhoneNumber?: string | null;
};

interface FriendDetails {
  friend: {
    displayName: string | null;
    email: string | null;
    friendSince: string | null;
    phoneNumber: string | null;
    uid: string | undefined;
    occupation: string | null;
    combinedUid?: string | undefined;
  };
}

type BasicFriendInfo = {
  uid: string | undefined;
  displayName: string | null;
  email: string | null;
};

type RequestInfo = {
  uid: string | undefined;
  displayName: string | null;
  phoneNumber: string | null;
  email: string | null;
  occupation: string | null;
  groupName?: string | null;
  createdAt?: string | null;
  groupUid?: string | undefined;
  type?: string | null;
};

interface DiscoverConnectionsInfo {
  discoverConnections: [];
  uid: string | undefined;
}

interface AcceptRequestDetails {
  requests: {
    requestAccepted: [];
    uid: string | undefined;
    email: string | null;
    timer: number;
    type: string | null;
    requestsLenght?: number | null;
  };
}

type AcceptRequestInfo = {
  uid: string | undefined;
  email: string | null;
  timer: number;
  type: string | null;
  requestsLenght?: number | null;
};

interface NewGroup {
  newgroup: [];
  uid;
}

interface GroupDetails {
  group: {
    adminName: string | null;
    adminMail: string | null;
    createdAt: string | null;
    groupName: string | null;
    uid: string | undefined;
  };
}

type BasicGroupInfo = {
  adminName: string | null;
  adminMail: string | null;
  createdAt: string | null;
  groupName: string | null;
  uid: string | undefined;
};

type ChatInfo = {
  adminName?: string | null;
  adminMail?: string | null;
  createdAt?: string | null;
  groupName?: string | null;
  uid?: string | undefined;
  displayName?: string | null;
  email?: string | null;
  phoneNumber: string | null;
  friendSince?: string | null;
  occupation?: string | null;
};

type MessageInfo = {
  createdAt: firebase.firestore.Timestamp | null;
  id: string | undefined;
  message: string;
  senderEmail: string | null;
  senderName: string | null;
};

export {
  UserDetails,
  BasicUserInfo,
  FriendDetails,
  BasicFriendInfo,
  RequestInfo,
  DiscoverConnectionsInfo,
  AcceptRequestDetails,
  BasicGroupInfo,
  ChatInfo,
  GroupDetails,
  NewGroup,
  MessageInfo,
  AcceptRequestInfo,
};

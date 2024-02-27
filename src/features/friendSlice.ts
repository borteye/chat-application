import { createSlice } from "@reduxjs/toolkit";
import { FriendDetails } from "../typings";

const initialState = {
  uid: null,
  displayName: null,
  email: null,
  phoneNumber: null,
  friendSince: null,
  occupation: null,
  combinedUid: undefined,
};

export const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {
    setActiveFriend: (state, { payload }) => {
      state.uid = payload.uid;
      state.displayName = payload.displayName;
      state.email = payload.email;
      state.friendSince = payload.friendSince;
      state.phoneNumber = payload.phoneNumber;
      state.occupation = payload.occupation;
      state.combinedUid = payload.combinedUid;
    },
    setNonActiveFriend: (state) => {
      state.uid = null;
      state.displayName = null;
      state.email = null;
      state.friendSince = null;
      state.phoneNumber = null;
      state.occupation = null;
      state.combinedUid = undefined;
    },
  },
});

//* Action creators are generated for each case reducer function
export const { setActiveFriend, setNonActiveFriend } = friendSlice.actions;

export const selecttUid = ({ friend }: FriendDetails) => friend.uid;
export const selectFDisplayName = ({ friend }: FriendDetails) =>
  friend.displayName;
export const selectEmail = ({ friend }: FriendDetails) => friend.email;
export const selectFriendSince = ({ friend }: FriendDetails) =>
  friend.friendSince;
export const selectFPhoneNumber = ({ friend }: FriendDetails) =>
  friend.phoneNumber;
export const selectFOccupation = ({ friend }: FriendDetails) =>
  friend.occupation;
export const selectCombinedUid = ({ friend }: FriendDetails) =>
  friend.combinedUid;

export default friendSlice.reducer;

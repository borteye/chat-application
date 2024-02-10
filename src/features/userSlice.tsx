import { createSlice } from "@reduxjs/toolkit";
import { UserDetails } from "../typings";

const initialState = {
  uid: null,
  displayName: null,
  email: null,
  phoneNumber: null,
  occupation: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setActiveUser: (state, { payload }) => {
      state.uid = payload.userUid;
      state.displayName = payload.userDisplayName;
      state.email = payload.userEmail;
      state.occupation = payload.userOccupation;
      state.phoneNumber = payload.userPhoneNumber;
    },
    setUserLogoutState: (state) => {
      state.uid = null;
      state.displayName = null;
      state.email = null;
      state.occupation = null;
      state.phoneNumber = null;
    },
  },
});

//* Action creators are generated for each case reducer function
export const { setActiveUser, setUserLogoutState } = userSlice.actions;

export const selectUid = ({ user }: UserDetails) => user.uid;
export const selectDisplayName = ({ user }: UserDetails) => user.displayName;
export const selectEmail = ({ user }: UserDetails) => user.email;
export const selectOccupation = ({ user }: UserDetails) => user.occupation;
export const selectPhoneNumber = ({ user }: UserDetails) => user.phoneNumber;

export default userSlice.reducer;

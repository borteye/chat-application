import { createSlice } from "@reduxjs/toolkit";
import { GroupDetails } from "../typings";

const initialState = {
  uid: undefined,
  groupName: null,
  createdAt: null,
  adminName: null,
  adminMail: null,
};

export const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setActiveGroup: (state, { payload }) => {
      state.uid = payload.uid;
      state.groupName = payload.groupName;
      state.createdAt = payload.createdAt;
      state.adminName = payload.adminName;
      state.adminMail = payload.adminMail;
    },
    setNonActiveGroup: (state) => {
      state.uid = undefined;
      state.groupName = null;
      state.createdAt = null;
      state.adminName = null;
      state.adminMail = null;
    },
  },
});

//* Action creators are generated for each case reducer function
export const { setActiveGroup, setNonActiveGroup } = groupSlice.actions;

export const selectGroupUid = ({ group }: GroupDetails) => group.uid;
export const selectGroupName = ({ group }: GroupDetails) => group.groupName;
export const selectAdminName = ({ group }: GroupDetails) => group.adminName;
export const selectAdminMail = ({ group }: GroupDetails) => group.adminMail;
export const selectGroupCreatedAt = ({ group }: GroupDetails) =>
  group.createdAt;

export default groupSlice.reducer;

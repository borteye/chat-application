import { createSlice } from "@reduxjs/toolkit";
import { NewGroup } from "../typings";

const initialState: NewGroup[] = [];

export const newGroupSlice = createSlice({
  name: "newgroup",
  initialState,
  reducers: {
    setNewGroup: (state, { payload }) => {
      const exists = state.find((user) => user.uid === payload.uid);
      if (exists) {
        return (state = state.filter((user) => user.uid !== payload.uid));
      } else {
        state.push(payload);
      }
    },
    setResetGroup: (state) => {
      return (state = []);
    },
  },
});

//* Action creators are generated for each case reducer function
export const { setNewGroup, setResetGroup } = newGroupSlice.actions;

export const newGroupState = (state: NewGroup) => state.newgroup;

export default newGroupSlice.reducer;

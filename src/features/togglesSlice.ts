import { createSlice } from "@reduxjs/toolkit";
import { ToggleDetails } from "../typings";

const initialState = {
  connectionsToggle: false,
  requestsToggle: false,
  editMessageToggle: false,
  isChatSelected: false,
};

export const togglesSlice = createSlice({
  name: "toggles",
  initialState,
  reducers: {
    isVisible: (state, { payload }) => {
      state.connectionsToggle = payload.connectionsToggle;
      state.requestsToggle = payload.requestsToggle;
      state.editMessageToggle = payload.editMessageToggle;
    },
    isHidden: (state) => {
      state.connectionsToggle = false;
      state.requestsToggle = false;
      state.editMessageToggle = false;
    },
  },
});

//* Action creators are generated for each case reducer function
export const { isVisible, isHidden } = togglesSlice.actions;

export const connectionsToggle = ({ toggles }: ToggleDetails) =>
  toggles.connectionsToggle;
export const requetsToggle = ({ toggles }: ToggleDetails) =>
  toggles.requestsToggle;
export const editMessageToggle = ({ toggles }: ToggleDetails) =>
  toggles.editMessageToggle;

export default togglesSlice.reducer;

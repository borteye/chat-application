import { createSlice } from "@reduxjs/toolkit";
import { DiscoverConnectionsInfo } from "../typings";

const initialState: DiscoverConnectionsInfo[] = [];

export const DiscoverConnectionsInfoSlice = createSlice({
  name: "DiscoverConnectionsInfo",
  initialState,
  reducers: {
    setAddNewConnect: (state, { payload }) => {
      const newConnectionAdded = state.find((doc) => doc.uid === payload.uid);
      if (newConnectionAdded) {
        return state.filter((doc) => doc.uid !== payload.uid);
      } else {
        state.push(payload);
      }
    },
  },
});

//* Action creators are generated for each case reducer function
export const { setAddNewConnect } = DiscoverConnectionsInfoSlice.actions;

export const discoverConnectionState = (state: DiscoverConnectionsInfo) =>
  state.discoverConnections;

export default DiscoverConnectionsInfoSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { AcceptRequestDetails, AcceptRequestInfo } from "../typings";

const initialState = {
  requestAccepted: [] as AcceptRequestInfo[],
  uid: null,
  email: null,
  timer: null,
  type: null,
  requestsLenght: 0,
};

export const requestsSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    setRequestAccepted: (state, { payload }) => {
      state.requestAccepted.push(payload);
    },
    setDecreaseTimer: (state, { payload }) => {
      const index = state.requestAccepted.findIndex(
        (user) => user.uid === payload.uid && user.type === payload.type
      );
      if (index !== -1) {
        if (state.requestAccepted[index].timer > 0) {
          state.requestAccepted[index].timer -= 1;
        }
      }
    },
    setPurgeRequest: (state, { payload }) => {
      const exists = state.requestAccepted.find(
        (user) => user.uid === payload.uid && user.type === payload.type
      );
      if (exists) {
        state.requestAccepted = state.requestAccepted.filter(
          (user) => user.uid !== payload.uid && user.type !== payload.type
        );
      }
    },
    setResetReqState: (state, { payload }) => {
      return payload;
    },
    setTotalRequests: (state, { payload }) => {
      state.requestsLenght = payload;
    },
  },
});

//* Action creators are generated for each case reducer function
export const {
  setRequestAccepted,
  setDecreaseTimer,
  setPurgeRequest,
  setResetReqState,
  setTotalRequests,
} = requestsSlice.actions;

export const requetsState = ({ requests }: AcceptRequestDetails) =>
  requests.requestAccepted;

export const requestLength = ({ requests }: AcceptRequestDetails) =>
  requests.requestsLenght;

export default requestsSlice.reducer;

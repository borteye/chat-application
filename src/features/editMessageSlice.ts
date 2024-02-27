import { createSlice } from "@reduxjs/toolkit";
import { EditMessageDetails } from "../typings";

const initialState = {
  id: null,
  message: null,
  chatId: null,
  image: null,
  senderEmail: null,
  createdAt: null,
};

export const editMessageSlice = createSlice({
  name: "editMessage",
  initialState,
  reducers: {
    setBeginEditing: (state, { payload }) => {
      state.id = payload.id;
      state.message = payload.message;
      state.chatId = payload.chatId;
    },
    setDoneEditing: (state) => {
      state.id = null;
      state.message = null;
      state.chatId = null;
    },
  },
});

//* Action creators are generated for each case reducer function
export const { setBeginEditing, setDoneEditing } = editMessageSlice.actions;

export const selectMessageId = ({ editMessage }: EditMessageDetails) =>
  editMessage.id;
export const selectMessage = ({ editMessage }: EditMessageDetails) =>
  editMessage.message;
export const selectChatId = ({ editMessage }: EditMessageDetails) =>
  editMessage.chatId;

export default editMessageSlice.reducer;

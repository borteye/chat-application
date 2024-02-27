import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./features/userSlice";
import friendReducer from "./features/friendSlice";
import discoverConnectionsReducer from "./features/discoverConnectionsInfoSlice";
import requestsReducer from "./features/requestsSlice";
import groupReducer from "./features/groupSlice";
import newgroupReducer from "./features/newGroupSlice";
import editMessageReducer from "./features/editMessageSlice";
import togglesReducer from "./features/togglesSlice";

//* Combine your reducers
const rootReducer = combineReducers({
  user: userReducer,
  friend: friendReducer,
  discoverConnections: discoverConnectionsReducer,
  requests: requestsReducer,
  group: groupReducer,
  newgroup: newgroupReducer,
  editMessage: editMessageReducer,
  toggles: togglesReducer,
});

//* Define persist config
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

//* Persist the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

//* Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

//* Create the persistor
export const persistor = persistStore(store);

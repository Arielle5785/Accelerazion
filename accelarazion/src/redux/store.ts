import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from "./userSlice";
import storyReducer from './storySlice';

const rootReducer = combineReducers({
  users: userReducer,
  stories: storyReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
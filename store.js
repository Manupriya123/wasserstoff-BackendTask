// store.js
import { configureStore } from '@reduxjs/toolkit';
import folderReducer from './slices/folderSlice';
import { loadState, saveState } from './utils/localStorageUtils';

// Load state from local storage
const preloadedState = typeof window !== 'undefined' ? loadState() : undefined;

const store = configureStore({
  reducer: {
    folders: folderReducer,
  },
  preloadedState,
});

if (typeof window !== 'undefined') {
  store.subscribe(() => {
    saveState(store.getState());
  });
}

export default store;

// slices/folderSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  folders: [],
};

const folderSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {
    createFolder: (state, action) => {
      if (!state.folders.some((folder) => folder.name === action.payload)) {
        state.folders.push({ name: action.payload, files: [], isOpen: false });
      }
    },
    createFile: (state, action) => {
      const { folderName, fileName } = action.payload;
      const folder = state.folders.find((folder) => folder.name === folderName);
      if (folder) {
        if (!folder.files.some((file) => file.name === fileName)) {
          folder.files.push({
            name: fileName,
            content: "",
            type: getFileType(fileName),
            items: [],
          });
        }
      }
    },
    updateFileContent: (state, action) => {
      const { folderName, fileName, content } = action.payload;
      const folder = state.folders.find((folder) => folder.name === folderName);
      if (folder) {
        const file = folder.files.find((file) => file.name === fileName);
        if (file) {
          file.content = content;
        }
      }
    },
    updateFileItems: (state, action) => {
      const { folderName, fileName, items } = action.payload;
      const folder = state.folders.find((folder) => folder.name === folderName);
      if (folder) {
        const file = folder.files.find((file) => file.name === fileName);
        if (file) {
          file.items = items;
        }
      }
    },
    deleteFile: (state, action) => {
      const { folderName, fileName } = action.payload;
      const folder = state.folders.find((folder) => folder.name === folderName);
      if (folder) {
        folder.files = folder.files.filter((file) => file.name !== fileName);
      }
    },
    renameFile: (state, action) => {
      const { folderName, oldFileName, newFileName } = action.payload;
      const folder = state.folders.find((folder) => folder.name === folderName);
      if (folder) {
        const file = folder.files.find((file) => file.name === oldFileName);
        if (file) {
          file.name = newFileName;
        }
      }
    },
    deleteFolder: (state, action) => {
      const folderName = action.payload;
      state.folders = state.folders.filter(
        (folder) => folder.name !== folderName
      );
    },
    toggleFolder: (state, action) => {
      const folder = state.folders.find(
        (folder) => folder.name === action.payload
      );
      if (folder) {
        folder.isOpen = !folder.isOpen;
      }
    },
  },
});

function getFileType(fileName) {
  const ext = fileName.split(".").pop();
  return ext;
}

export const {
  createFolder,
  createFile,
  updateFileContent,
  updateFileItems,
  deleteFile,
  renameFile,
  deleteFolder,
  toggleFolder,
} = folderSlice.actions;

export default folderSlice.reducer;

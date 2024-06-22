// components/FileExplorer.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleFolder,
  deleteFile,
  renameFile,
  createFile,
  createFolder,
  deleteFolder,
} from "../slices/folderSlice";

const FileExplorer = ({ onFileClick }) => {
  const dispatch = useDispatch();
  const folders = useSelector((state) => state.folders.folders);
  const [renameInput, setRenameInput] = useState("");
  const [fileBeingRenamed, setFileBeingRenamed] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");

  const handleToggleFolder = (folderName) => {
    dispatch(toggleFolder(folderName));
  };

  const handleDeleteFile = (folderName, fileName) => {
    if (confirm(`Are you sure you want to delete the file "${fileName}"?`)) {
      dispatch(deleteFile({ folderName, fileName }));
    }
  };

  const handleRenameFile = (folderName, oldFileName, newFileName) => {
    if (newFileName.trim() && newFileName !== oldFileName) {
      dispatch(renameFile({ folderName, oldFileName, newFileName }));
      setFileBeingRenamed(null);
      setRenameInput("");
    }
  };

  const handleCreateFile = (folderName) => {
    if (newFileName.trim()) {
      dispatch(createFile({ folderName, fileName: newFileName.trim() }));
      setNewFileName("");
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      dispatch(createFolder(newFolderName.trim()));
      setNewFolderName("");
    }
  };

  const handleDeleteFolder = (folderName) => {
    if (
      confirm(
        `Are you sure you want to delete the folder "${folderName}"? All files inside will also be deleted.`
      )
    ) {
      dispatch(deleteFolder(folderName));
    }
  };

  return (
    <div className="p-4 bg-gray-100 h-full">
      <h2 className="text-lg font-bold mb-4">Explorer</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="New Folder"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <button
          onClick={handleCreateFolder}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Create Folder
        </button>
      </div>
      <ul>
        {folders.map((folder) => (
          <li key={folder.name}>
            <div className="flex items-center mb-2">
              <button
                onClick={() => handleToggleFolder(folder.name)}
                className="text-blue-500 mr-2"
              >
                {folder.isOpen ? "-" : "+"}
              </button>
              <span
                className="font-semibold cursor-pointer"
                onClick={() => handleToggleFolder(folder.name)}
              >
                {folder.name}
              </span>
              <button
                onClick={() => handleDeleteFolder(folder.name)}
                className="text-red-500 ml-2"
              >
                Delete
              </button>
            </div>
            {folder.isOpen && (
              <ul className="pl-4">
                {folder.files.map((file) => (
                  <li
                    key={file.name}
                    className="flex justify-between items-center mb-2"
                  >
                    {fileBeingRenamed === file.name ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={renameInput}
                          onChange={(e) => setRenameInput(e.target.value)}
                          className="border p-1"
                        />
                        <button
                          onClick={() =>
                            handleRenameFile(
                              folder.name,
                              file.name,
                              renameInput
                            )
                          }
                          className="text-green-500 ml-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setFileBeingRenamed(null)}
                          className="text-red-500 ml-2"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <span
                          onClick={() => onFileClick(folder, file)}
                          className="cursor-pointer"
                        >
                          {file.name}
                        </span>
                        <div className="flex">
                          <button
                            onClick={() =>
                              handleDeleteFile(folder.name, file.name)
                            }
                            className="text-red-500 ml-2"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => {
                              setFileBeingRenamed(file.name);
                              setRenameInput(file.name);
                            }}
                            className="text-blue-500 ml-2"
                          >
                            Rename
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
                <li className="flex items-center">
                  <input
                    type="text"
                    placeholder="New File"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    className="border p-2 mb-2 w-full"
                  />
                  <button
                    onClick={() => handleCreateFile(folder.name)}
                    className="text-green-500 ml-2"
                  >
                    Add
                  </button>
                </li>
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default FileExplorer;

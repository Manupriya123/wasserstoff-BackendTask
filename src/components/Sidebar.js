// components/Sidebar.js
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createFile,
  createFolder,
  deleteFile,
  renameFile,
} from "../../slices/folderSlice";

const Sidebar = ({ onFileClick }) => {
  const dispatch = useDispatch();
  const folders = useSelector(state => state.folders.folders);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [renameInput, setRenameInput] = useState('');
  const [fileBeingRenamed, setFileBeingRenamed] = useState(null);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      dispatch(createFolder(newFolderName.trim()));
      setNewFolderName('');
    }
  };

  const handleCreateFile = () => {
    if (newFileName.trim() && selectedFolder) {
      dispatch(createFile({ folderName: selectedFolder, fileName: newFileName.trim() }));
      setNewFileName('');
    }
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
      setRenameInput('');
    }
  };

  return (
    <div className="w-64 bg-gray-100 p-4">
      <h2 className="text-lg font-bold mb-4">Folders</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="New Folder"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <button onClick={handleCreateFolder} className="w-full bg-blue-500 text-white p-2 rounded">
          Create Folder
        </button>
      </div>
      {folders.map(folder => (
        <div key={folder.name} className="mb-4">
          <h3 className="font-semibold">{folder.name}</h3>
          <ul>
            {folder.files.map(file => (
              <li key={file.name} className="flex justify-between items-center">
                {fileBeingRenamed === file.name ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={renameInput}
                      onChange={(e) => setRenameInput(e.target.value)}
                      placeholder="New name"
                      className="border p-1"
                    />
                    <button
                      onClick={() => handleRenameFile(folder.name, file.name, renameInput)}
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
                        onClick={() => handleDeleteFile(folder.name, file.name)}
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
          </ul>
          <div className="mt-2">
            <input
              type="text"
              placeholder="New File"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="border p-2 mb-2 w-full"
            />
            <button
              onClick={() => {
                setSelectedFolder(folder.name);
                handleCreateFile();
              }}
              className="w-full bg-green-500 text-white p-2 rounded"
            >
              Create File
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};


export default Sidebar;

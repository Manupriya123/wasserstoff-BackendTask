// pages/index.js
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateFileContent,
  updateFileItems,
  updateFileNotes,
} from "../../slices/folderSlice";
import Sidebar from "@/components/Sidebar";
import NoteMaker from "@/components/NoteMaker";
import ListMaker from "@/components/ListMaker";
import ReadmeViewer from "@/components/ReadMeViewer";
import FileExplorer from "@/FileExplorer";

const Home = () => {
  const folders = useSelector(state => state.folders.folders);
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (currentFolder && currentFile) {
      const folder = folders.find(f => f.name === currentFolder.name);
      if (folder) {
        const file = folder.files.find(f => f.name === currentFile.name);
        setCurrentFile(file);
      }
    }
  }, [folders, currentFolder, currentFile]);

  const handleFileClick = (folder, file) => {
    setCurrentFile(file);
    setCurrentFolder(folder);
  };

  const handleContentChange = (e) => {
    const content = e.target.value;
    dispatch(updateFileContent({ folderName: currentFolder.name, fileName: currentFile.name, content }));
    setCurrentFile({ ...currentFile, content });
  };

  const handleNotesChange = (notes) => {
    dispatch(updateFileNotes({ folderName: currentFolder.name, fileName: currentFile.name, notes }));
    setCurrentFile({ ...currentFile, notes });
  };

  const handleItemsChange = (items) => {
    dispatch(updateFileItems({ folderName: currentFolder.name, fileName: currentFile.name, items }));
    setCurrentFile({ ...currentFile, items });
  };

  const handleReadmeChange = (content) => {
    dispatch(updateReadmeContent({ folderName: currentFolder.name, fileName: currentFile.name, content }));
    setCurrentFile({ ...currentFile, content });
  };

  if (!isClient) {
    return null; // Avoid rendering until hydration is complete
  }

  return (
    <div className="flex h-screen">
      <FileExplorer onFileClick={handleFileClick} />
      <div className="flex-1 p-4 overflow-auto">
        {currentFile && currentFile.name.endsWith('.ed') && (
          <div className="h-full">
            <h2 className="text-xl mb-4">Editor</h2>
            <textarea
              className="w-full h-5/6 p-2 border border-gray-300 rounded"
              value={currentFile.content}
              onChange={handleContentChange}
            />
          </div>
        )}
        {currentFile && currentFile.name.endsWith('.note') && (
          <NoteMaker
            folderName={currentFolder.name}
            fileName={currentFile.name}
            notes={currentFile.notes || []} // Ensure notes is always an array
            onNotesChange={handleNotesChange}
          />
        )}
        {currentFile && currentFile.name.endsWith('.lt') && (
          <ListMaker
            folderName={currentFolder.name}
            fileName={currentFile.name}
            items={currentFile.items || []} // Ensure items is always an array
            onItemsChange={handleItemsChange}
          />
        )}
        {currentFile && currentFile.name.endsWith('.readme') && (
          <ReadmeViewer content={currentFile.content} />
        )}
      </div>
    </div>
  );
};
export default Home;

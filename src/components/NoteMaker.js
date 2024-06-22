// components/NoteMaker.js
import { useState } from "react";
import { useDispatch } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import NoteItem from "./NoteItem";
import { updateFileNotes } from "../../slices/folderSlice";

const NoteMaker = ({ folderName, fileName, notes }) => {
  const dispatch = useDispatch();
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (newNote.trim() !== '') {
      const updatedNotes = [...notes, { text: newNote, status: 'todo' }];
      dispatch(updateFileNotes({ folderName, fileName, notes: updatedNotes }));
      setNewNote('');
    }
  };

  const moveNote = (fromIndex, toIndex) => {
    const updatedNotes = [...notes];
    const [movedNote] = updatedNotes.splice(fromIndex, 1);
    updatedNotes.splice(toIndex, 0, movedNote);
    dispatch(updateFileNotes({ folderName, fileName, notes: updatedNotes }));
  };

  const handleStatusChange = (index, status) => {
    const updatedNotes = notes.map((note, i) => (i === index ? { ...note, status } : note));
    dispatch(updateFileNotes({ folderName, fileName, notes: updatedNotes }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h2 className="text-xl mb-4">Note Maker</h2>
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="New Note"
          className="w-full mb-2 p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleAddNote}
          className="w-full mb-4 p-2 bg-blue-500 text-white rounded"
        >
          Add Note
        </button>
        <div className="flex space-x-4">
          {['todo', 'in-progress', 'done'].map((status) => (
            <div key={status} className="flex-1">
              <h3 className="text-lg mb-2">{status}</h3>
              {notes
                .filter(note => note.status === status)
                .map((note, index) => (
                  <NoteItem
                    key={index}
                    note={note}
                    index={index}
                    moveNote={moveNote}
                    onStatusChange={handleStatusChange}
                  />
                ))}
            </div>
          ))}
        </div>
      </div>
    </DndProvider>
  );
};
export default NoteMaker;

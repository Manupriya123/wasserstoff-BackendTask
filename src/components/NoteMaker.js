// components/NoteMaker.js
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { updateFileNotes } from "../../slices/folderSlice";
import { useSpring, animated } from 'react-spring';
import { NOTE_STATUSES } from "./constants";

const ItemType = 'NOTE';

const NoteItem = ({ note, index, moveNote, status, removeNote }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: ItemType,
    item: { index, status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index || draggedItem.status !== status) {
        moveNote(draggedItem.index, index, draggedItem.status, status);
        draggedItem.index = index;
        draggedItem.status = status;
      }
    },
  });

  const animatedStyle = useSpring({
    opacity: isDragging ? 0.5 : 1,
    transform: isDragging ? 'scale(1.1)' : 'scale(1)',
  });

  return (
    <animated.div ref={(node) => dragRef(dropRef(node))} style={animatedStyle} className="flex items-center mb-2">
      <span className="flex-1">{note.text}</span>
      <button onClick={() => removeNote(index, status)} className="text-red-500 ml-2">
        Remove
      </button>
    </animated.div>
  );
};

const NoteColumn = ({ status, notes, moveNote, removeNote }) => {
  const [, dropRef] = useDrop({
    accept: ItemType,
    drop: (item) => moveNote(item.index, notes.length, item.status, status),
  });

  return (
    <div ref={dropRef} className="flex-1 p-4 bg-gray-200 rounded mr-2">
      <h2 className="text-xl mb-4">{status}</h2>
      {notes.map((note, index) => (
        <NoteItem
          key={index}
          note={note}
          index={index}
          moveNote={moveNote}
          status={status}
          removeNote={removeNote}
        />
      ))}
    </div>
  );
};

const NoteMaker = ({ folderName, fileName, notes = [], onNotesChange }) => {
  const dispatch = useDispatch();
  const [currentNotes, setCurrentNotes] = useState(notes);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    setCurrentNotes(notes);
  }, [notes]);

  const handleAddNote = () => {
    if (newNote.trim() !== '') {
      const updatedNotes = [...currentNotes, { text: newNote, status: NOTE_STATUSES.TODO }];
      setCurrentNotes(updatedNotes);
      dispatch(updateFileNotes({ folderName, fileName, notes: updatedNotes }));
      onNotesChange(updatedNotes);
      setNewNote('');
    }
  };

  const moveNote = (fromIndex, toIndex, fromStatus, toStatus) => {
    if (fromIndex === undefined || toIndex === undefined) return;
    const updatedNotes = [...currentNotes];
    const fromNotes = updatedNotes.filter(note => note?.status === fromStatus);
    const [movedNote] = fromNotes.splice(fromIndex, 1);
    const updatedMovedNote = { ...movedNote, status: toStatus };
    const toNotes = updatedNotes.filter(note => note?.status === toStatus);
    toNotes.splice(toIndex, 0, updatedMovedNote);

    const reorderedNotes = [
      ...updatedNotes.filter(note => note?.status !== fromStatus && note?.status !== toStatus),
      ...fromNotes,
      ...toNotes,
    ];

    setCurrentNotes(reorderedNotes);
    dispatch(updateFileNotes({ folderName, fileName, notes: reorderedNotes }));
    onNotesChange(reorderedNotes);
  };

  const removeNote = (index, status) => {
    if (index === undefined || status === undefined) return;
    const updatedNotes = currentNotes.filter((note, i) => !(note?.status === status && i === index));
    setCurrentNotes(updatedNotes);
    dispatch(updateFileNotes({ folderName, fileName, notes: updatedNotes }));
    onNotesChange(updatedNotes);
  };

  const notesByStatus = (status) => currentNotes.filter(note => note?.status === status);

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
        <div className="flex">
          {Object.values(NOTE_STATUSES).map(status => (
            <NoteColumn
              key={status}
              status={status}
              notes={notesByStatus(status)}
              moveNote={moveNote}
              removeNote={removeNote}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};
export default NoteMaker;

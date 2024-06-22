// components/NoteItem.js
import { useDrag, useDrop } from "react-dnd";

const NoteItem = ({ note, index, moveNote, onStatusChange }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "note",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "note",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveNote(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`p-2 mb-2 border border-gray-300 rounded bg-white ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div>{note.text}</div>
      <select
        value={note.status}
        onChange={(e) => onStatusChange(index, e.target.value)}
        className="mt-2"
      >
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  );
};

export default NoteItem;

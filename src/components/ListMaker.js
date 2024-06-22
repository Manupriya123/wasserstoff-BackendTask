// components/ListMaker.js
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { updateFileItems } from "../../slices/folderSlice";
import { useSpring, animated } from 'react-spring';

const ItemType = 'ITEM';

const ListItem = ({ item, index, moveItem, removeItem }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const animatedStyle = useSpring({
    opacity: isDragging ? 0.5 : 1,
    transform: isDragging ? 'scale(1.1)' : 'scale(1)',
  });

  return (
    <animated.div ref={(node) => dragRef(dropRef(node))} style={animatedStyle} className="flex items-center mb-2">
      <span className="flex-1">{item}</span>
      <button onClick={() => removeItem(index)} className="text-red-500 ml-2">
        Remove
      </button>
    </animated.div>
  );
};

const ListMaker = ({ folderName, fileName, items = [], onItemsChange }) => {
  const dispatch = useDispatch();
  const [currentItems, setCurrentItems] = useState(items);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    setCurrentItems(items);
  }, [items]);

  const handleAddItem = () => {
    if (newItem.trim() !== '') {
      const updatedItems = [...currentItems, newItem];
      setCurrentItems(updatedItems);
      dispatch(updateFileItems({ folderName, fileName, items: updatedItems }));
      onItemsChange(updatedItems);
      setNewItem('');
    }
  };

  const moveItem = (fromIndex, toIndex) => {
    const updatedItems = [...currentItems];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    setCurrentItems(updatedItems);
    dispatch(updateFileItems({ folderName, fileName, items: updatedItems }));
    onItemsChange(updatedItems);
  };

  const removeItem = (index) => {
    const updatedItems = currentItems.filter((_, i) => i !== index);
    setCurrentItems(updatedItems);
    dispatch(updateFileItems({ folderName, fileName, items: updatedItems }));
    onItemsChange(updatedItems);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h2 className="text-xl mb-4">List Maker</h2>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="New Item"
          className="w-full mb-2 p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleAddItem}
          className="w-full mb-4 p-2 bg-blue-500 text-white rounded"
        >
          Add Item
        </button>
        <div>
          {currentItems.map((item, index) => (
            <ListItem
              key={index}
              item={item}
              index={index}
              moveItem={moveItem}
              removeItem={removeItem}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};
export default ListMaker;

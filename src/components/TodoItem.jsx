import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrashIcon, 
  PencilIcon, 
  CheckIcon 
} from '@heroicons/react/24/solid';

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    if (isEditing && editText.trim()) {
      onEdit(todo.id, editText);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm mb-2 group hover:shadow-md transition-shadow duration-200"
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-5 h-5 accent-purple-500"
        aria-label={`Toggle todo ${todo.text}`}
      />
      
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="flex-1 px-2 py-1 border-b-2 border-purple-500 focus:outline-none"
          autoFocus
        />
      ) : (
        <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
          {todo.text}
        </span>
      )}

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={handleEdit}
          className="p-1 text-gray-600 hover:text-purple-500"
          aria-label={`Edit todo ${todo.text}`}
        >
          {isEditing ? (
            <CheckIcon className="w-5 h-5" />
          ) : (
            <PencilIcon className="w-5 h-5" />
          )}
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1 text-gray-600 hover:text-red-500"
          aria-label={`Delete todo ${todo.text}`}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default TodoItem; 
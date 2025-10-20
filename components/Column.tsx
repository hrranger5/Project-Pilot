
import React, { useState } from 'react';
import type { Column as ColumnType, Task } from '../types';
import { TaskCard } from './TaskCard';
import { PlusIcon } from './icons/Icons';
import { useProject } from '../hooks/useProjectData';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, columnId: string) => void;
  onTaskClick: (task: Task) => void;
}

export const Column: React.FC<ColumnProps> = ({ column, tasks, onDragStart, onDragOver, onDrop, onTaskClick }) => {
  const { addTask } = useProject();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(column.id, newTaskTitle);
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTask();
    } else if (e.key === 'Escape') {
      setIsAddingTask(false);
      setNewTaskTitle('');
    }
  };

  return (
    <div
      className="flex flex-col w-80 bg-slate-200 rounded-lg shadow-sm"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, column.id)}
    >
      <div className="flex items-center justify-between p-3 border-b border-slate-300">
        <h2 className="font-semibold text-slate-700">{column.title}</h2>
        <span className="px-2 py-1 text-sm font-medium bg-slate-300 text-slate-600 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="flex-grow p-2 overflow-y-auto space-y-2 min-h-[100px]">
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onDragStart={onDragStart} 
            onClick={() => onTaskClick(task)}
          />
        ))}
      </div>
      <div className="p-2">
        {isAddingTask ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a title for this card..."
              className="w-full p-2 text-sm border-2 border-teal-500 rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <button onClick={handleAddTask} className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-500">Add card</button>
              <button onClick={() => setIsAddingTask(false)} className="px-4 py-2 text-sm font-semibold rounded-md hover:bg-slate-300">Cancel</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingTask(true)}
            className="flex items-center w-full p-2 text-sm font-medium text-slate-600 rounded-md hover:bg-slate-300"
          >
            <PlusIcon className="w-4 h-4 mr-2" /> Add a card
          </button>
        )}
      </div>
    </div>
  );
};

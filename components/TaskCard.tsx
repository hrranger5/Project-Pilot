import React, { useState } from 'react';
import type { Task } from '../types';
import { useProject } from '../hooks/useProjectData';
import { MessageSquareIcon, GripVerticalIcon, CalendarIcon, ShareIcon, CheckIcon, BellIcon } from './icons/Icons';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onClick: () => void;
}

const priorityStyles: Record<string, string> = {
    Low: 'bg-slate-200 text-slate-600',
    Medium: 'bg-yellow-200 text-yellow-800',
    High: 'bg-red-200 text-red-800',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart, onClick }) => {
  const { findUserById, projectData } = useProject();
  const [isCopied, setIsCopied] = useState(false);

  const assignedUser = task.assignedTo ? findUserById(task.assignedTo) : null;
  const completedSubtasks = task.subtasks.filter(s => s.completed).length;
  const progress = task.subtasks.length > 0 ? (completedSubtasks / task.subtasks.length) * 100 : 0;

  const isDoneColumn = projectData.columns['column-4'].taskIds.includes(task.id);
  const isOverdue = !isDoneColumn && task.dueDate && new Date(task.dueDate) < new Date(new Date().toDateString());

  const formattedDate = task.dueDate 
    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }) 
    : '';
    
  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCopied) return;

    const taskUrl = `${window.location.origin}${window.location.pathname}#task-${task.id}`;
    const textToCopy = `Check out this task in Project Pilot: ${task.title}\n\n${taskUrl}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
  };

  const hasFooterContent = task.dueDate || task.comments.length > 0 || assignedUser || task.reminderDate;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={onClick}
      className="p-3 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-slate-50 group task-card border border-white hover:border-slate-300 transition-all duration-200 flex flex-col gap-3"
    >
        <div className="flex justify-between items-start">
            <p className="text-sm font-semibold text-slate-800 break-words pr-2">{task.title}</p>
            <div className="flex items-center -mr-2">
                <button onClick={handleShareClick} title="Share Task" className="p-1 rounded-full hover:bg-slate-200 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100">
                    {isCopied ? <CheckIcon className="w-4 h-4 text-green-600" /> : <ShareIcon className="w-4 h-4 text-slate-500" />}
                </button>
                <GripVerticalIcon className="w-5 h-5 text-slate-400 opacity-0 transition-opacity duration-200 drag-handle group-hover:opacity-100"/>
            </div>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
            {task.priority && (
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${priorityStyles[task.priority]}`}>
                    {task.priority}
                </span>
            )}
        </div>

        {task.subtasks.length > 0 && (
            <div>
                <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                    <span>Progress</span>
                    <span>{completedSubtasks}/{task.subtasks.length}</span>
                </div>
                <div title={`${Math.round(progress)}% complete`} className="w-full bg-slate-200 rounded-full h-1.5">
                    <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}></div>
                </div>
            </div>
        )}

      {hasFooterContent && (
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-200/60">
            <div className="flex items-center gap-3 text-slate-500">
                {task.reminderDate && (
                    <div title={`Reminder: ${new Date(task.reminderDate).toLocaleString()}`}>
                        <BellIcon className="w-4 h-4" />
                    </div>
                )}
                {task.dueDate && (
                    <div className={`flex items-center text-xs ${isOverdue ? 'text-red-600 font-semibold' : ''}`}>
                        <CalendarIcon className="w-4 h-4 mr-1.5" />
                        <span>{formattedDate}</span>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-2">
                {task.comments.length > 0 && (
                    <div className="flex items-center text-xs text-slate-500">
                        <MessageSquareIcon className="w-4 h-4 mr-1" />
                        <span>{task.comments.length}</span>
                    </div>
                )}
                {assignedUser && (
                    <img
                        className="w-7 h-7 rounded-full"
                        src={assignedUser.avatarUrl}
                        alt={assignedUser.name}
                        title={assignedUser.name}
                    />
                )}
            </div>
        </div>
      )}
    </div>
  );
};

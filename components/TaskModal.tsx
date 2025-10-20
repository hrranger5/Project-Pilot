import React, { useState, useMemo } from 'react';
import type { Task, User } from '../types';
import { useProject } from '../hooks/useProjectData';
import { suggestSubtasks } from '../services/geminiService';
import { ConfirmationModal } from './ConfirmationModal';
import { XIcon, MessageSquareIcon, UserIcon, CheckSquareIcon, ZapIcon, LoaderIcon, CalendarIcon, FlagIcon, ShareIcon, CheckIcon, BellIcon, TrashIcon } from './icons/Icons';

interface TaskModalProps {
  task: Task;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, onClose }) => {
  const { users, findUserById, updateTask, deleteTask, addComment, toggleSubtask, addSubtasks, addSubtask } = useProject();
  const [description, setDescription] = useState(task.description);
  const [newComment, setNewComment] = useState('');
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareState, setShareState] = useState<'idle' | 'success' | 'error'>('idle');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const assignedUser = useMemo(() => task.assignedTo ? findUserById(task.assignedTo) : null, [task.assignedTo, findUserById]);
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };
  
  const handleDescriptionBlur = () => {
    if(description !== task.description) {
        updateTask(task.id, { description });
    }
  };
  
  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTask(task.id, { assignedTo: e.target.value || undefined });
  };
  
  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      updateTask(task.id, { dueDate: e.target.value || undefined });
  };

  const handleReminderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reminderDate = e.target.value ? new Date(e.target.value).toISOString() : undefined;

    // If setting a reminder and permissions haven't been granted or denied yet, request them.
    if (reminderDate && typeof Notification !== 'undefined' && Notification.permission === 'default') {
        Notification.requestPermission();
    }

    updateTask(task.id, { reminderDate });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const priority = e.target.value as 'Low' | 'Medium' | 'High' | '';
    updateTask(task.id, { priority: priority || undefined });
  };

  const handleShare = () => {
    if(navigator.clipboard) {
      const taskUrl = `${window.location.origin}${window.location.pathname}#task-${task.id}`;
      const textToCopy = `Check out this task in Project Pilot: ${task.title}\n\n${taskUrl}`;
      navigator.clipboard.writeText(textToCopy).then(() => {
          setShareState('success');
          setTimeout(() => setShareState('idle'), 2000);
      }).catch(err => {
          console.error('Failed to copy text: ', err);
          setShareState('error');
          setTimeout(() => setShareState('idle'), 2000);
      });
    }
  };

  const handleConfirmDelete = () => {
      deleteTask(task.id);
      setIsDeleteConfirmOpen(false);
      onClose();
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(task.id, newComment);
      setNewComment('');
    }
  };
  
  const handleAddNewSubtask = () => {
    if (newSubtaskText.trim()) {
        addSubtask(task.id, newSubtaskText);
        setNewSubtaskText('');
    }
  };

  const handleSubtaskKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          handleAddNewSubtask();
      }
  };

  const handleGenerateSubtasks = async () => {
      setIsGenerating(true);
      const suggestions = await suggestSubtasks(task.title, task.description);
      if (suggestions.length > 0 && !suggestions[0].startsWith("Error")) {
          addSubtasks(task.id, suggestions);
      }
      setIsGenerating(false);
  };
  
  const completedSubtasks = task.subtasks.filter(s => s.completed).length;
  const progress = task.subtasks.length > 0 ? (completedSubtasks / task.subtasks.length) * 100 : 0;

  const getShareButtonContent = () => {
    switch(shareState) {
        case 'success':
            return {
                text: 'Copied!',
                icon: <CheckIcon className="w-4 h-4 mr-2" />,
                className: 'bg-green-100 text-green-700',
            };
        case 'error':
            return {
                text: 'Failed!',
                icon: <XIcon className="w-4 h-4 mr-2" />,
                className: 'bg-red-100 text-red-700',
            };
        default:
            return {
                text: 'Share Task',
                icon: <ShareIcon className="w-4 h-4 mr-2" />,
                className: 'bg-slate-200 hover:bg-slate-300 text-slate-700',
            };
    }
  };

  const shareButtonContent = getShareButtonContent();
  const reminderValue = task.reminderDate ? task.reminderDate.slice(0, 16) : '';

  return (
    <>
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
        <div className="relative flex w-full max-w-3xl bg-slate-50 rounded-lg shadow-xl h-[90vh] max-h-[700px]" onClick={(e) => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-3 right-3 p-1 text-slate-500 hover:bg-slate-200 rounded-full z-20">
            <XIcon className="w-5 h-5" />
          </button>
          <div className="w-2/3 p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-800">{task.title}</h2>
            
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-600">DESCRIPTION</h3>
              <textarea
                value={description}
                onChange={handleDescriptionChange}
                onBlur={handleDescriptionBlur}
                placeholder="Add a more detailed description..."
                className="w-full h-32 p-2 mt-2 bg-slate-100 border border-transparent rounded-md focus:bg-white focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div className="mt-6">
                  <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-600 flex items-center"><CheckSquareIcon className="w-4 h-4 mr-2"/>SUB-TASKS</h3>
                      <button onClick={handleGenerateSubtasks} disabled={isGenerating} className="flex items-center px-3 py-1 text-xs font-semibold text-teal-700 bg-teal-100 rounded-md hover:bg-teal-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isGenerating ? <LoaderIcon className="w-4 h-4 mr-2 animate-spin"/> : <ZapIcon className="w-4 h-4 mr-2"/>}
                        {isGenerating ? 'Generating...' : 'Suggest Sub-tasks'}
                      </button>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-3 mb-2">
                      <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}></div>
                  </div>
                  <div className="space-y-2 mt-2 max-h-40 overflow-y-auto pr-2">
                      {task.subtasks.map(subtask => (
                          <div key={subtask.id} className="flex items-center p-2 bg-slate-100 rounded-md hover:bg-slate-200">
                              <input type="checkbox" checked={subtask.completed} onChange={() => toggleSubtask(task.id, subtask.id)} className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"/>
                              <label className={`ml-3 text-sm ${subtask.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>{subtask.text}</label>
                          </div>
                      ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                      <input 
                          type="text" 
                          value={newSubtaskText}
                          onChange={(e) => setNewSubtaskText(e.target.value)}
                          onKeyDown={handleSubtaskKeyDown}
                          placeholder="Add a new sub-task..."
                          className="flex-grow p-2 text-sm border-2 border-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                      <button onClick={handleAddNewSubtask} className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-500 disabled:bg-teal-300" disabled={!newSubtaskText.trim()}>
                          Add
                      </button>
                  </div>
              </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-600 flex items-center"><MessageSquareIcon className="w-4 h-4 mr-2"/>COMMENTS</h3>
              <div className="flex mt-2 space-x-3">
                <img src={users[0].avatarUrl} alt={users[0].name} className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button onClick={handleAddComment} className="mt-2 px-4 py-1.5 text-sm font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-500">Save</button>
                </div>
              </div>
              <div className="mt-4 space-y-4">
                {task.comments.slice().reverse().map(comment => {
                  const user = findUserById(comment.userId);
                  return (
                    <div key={comment.id} className="flex space-x-3">
                      <img src={user?.avatarUrl} alt={user?.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <span className="font-semibold text-sm">{user?.name}</span>
                        <span className="ml-2 text-xs text-slate-500">{new Date(comment.timestamp).toLocaleString()}</span>
                        <div className="p-2 mt-1 text-sm bg-slate-100 rounded-md">{comment.text}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="w-1/3 p-6 bg-slate-100 border-l border-slate-200 flex flex-col">
            <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-600 flex items-center"><UserIcon className="w-4 h-4 mr-2"/>ASSIGNEE</h3>
                  <select value={assignedUser?.id || ''} onChange={handleAssigneeChange} className="w-full p-2 mt-2 bg-white border border-slate-300 rounded-md">
                    <option value="">Unassigned</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-600 flex items-center"><CalendarIcon className="w-4 h-4 mr-2"/>DUE DATE</h3>
                  <input
                      type="date"
                      value={task.dueDate || ''}
                      onChange={handleDueDateChange}
                      className="w-full p-2 mt-2 bg-white border border-slate-300 rounded-md"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-600 flex items-center"><BellIcon className="w-4 h-4 mr-2"/>REMINDER</h3>
                  <input
                      type="datetime-local"
                      value={reminderValue}
                      onChange={handleReminderChange}
                      className="w-full p-2 mt-2 bg-white border border-slate-300 rounded-md"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-600 flex items-center"><FlagIcon className="w-4 h-4 mr-2"/>PRIORITY</h3>
                  <select value={task.priority || ''} onChange={handlePriorityChange} className="w-full p-2 mt-2 bg-white border border-slate-300 rounded-md">
                      <option value="">None</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                  </select>
                </div>

                <div>
                      <button 
                          onClick={handleShare} 
                          className={`w-full flex items-center justify-center p-2 text-sm font-semibold rounded-md transition-colors duration-200 ${shareButtonContent.className}`}
                          disabled={shareState !== 'idle'}
                      >
                          {shareButtonContent.icon}
                          {shareButtonContent.text}
                      </button>
                </div>
            </div>

            <div className="mt-auto border-t border-slate-300 pt-4">
                 <button 
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className="w-full flex items-center justify-center p-2 text-sm font-semibold text-red-600 rounded-md hover:bg-red-100"
                >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Delete Task
                </button>
            </div>

          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message={`Are you sure you want to permanently delete the task "${task.title}"? This action cannot be undone.`}
      />
    </>
  );
};

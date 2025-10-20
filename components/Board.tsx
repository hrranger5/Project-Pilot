
import React, { useState, useEffect } from 'react';
import { useProject } from '../hooks/useProjectData';
import type { Task } from '../types';
import { Column } from './Column';
import { TaskModal } from './TaskModal';

export const Board: React.FC = () => {
  const { projectData, moveTask } = useProject();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const taskIdToOpen = urlParams.get('openTask');

    if (taskIdToOpen && projectData.tasks[taskIdToOpen]) {
      const taskToOpen = projectData.tasks[taskIdToOpen];
      setSelectedTask(taskToOpen);

      // Clean up the URL so the modal doesn't re-open on refresh
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('openTask');
      window.history.replaceState({}, '', newUrl);
    }
  }, [projectData.tasks]);


  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, destColumnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceColumnId = projectData.tasks[taskId] ? Object.values(projectData.columns).find(c => c.taskIds.includes(taskId))?.id : null;
    
    if (taskId && sourceColumnId) {
        const sourceColumn = projectData.columns[sourceColumnId];
        const sourceIndex = sourceColumn.taskIds.indexOf(taskId);

        // A simple drop logic for now, just adds to the end.
        // A more complex logic would calculate the drop index based on mouse position.
        const destColumn = projectData.columns[destColumnId];
        const destIndex = destColumn.taskIds.length;
        
        moveTask(taskId, { droppableId: sourceColumnId, index: sourceIndex }, { droppableId: destColumnId, index: destIndex });
    }
  };


  const openTaskModal = (task: Task) => {
    setSelectedTask(task);
  };

  const closeTaskModal = () => {
    setSelectedTask(null);
  };

  return (
    <div className="flex flex-grow p-4 space-x-4">
      {projectData.columnOrder.map(columnId => {
        const column = projectData.columns[columnId];
        const tasks = column.taskIds.map(taskId => projectData.tasks[taskId]);
        return (
          <Column
            key={column.id}
            column={column}
            tasks={tasks}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onTaskClick={openTaskModal}
          />
        );
      })}
      {selectedTask && <TaskModal task={selectedTask} onClose={closeTaskModal} />}
    </div>
  );
};
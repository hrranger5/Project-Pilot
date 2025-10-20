import React, { createContext, useContext, useState, useCallback } from 'react';
import { INITIAL_PROJECT_DATA, USERS } from '../constants';
import type { ProjectData, Task, Column, Subtask, Comment, User } from '../types';

interface ProjectContextType {
  projectData: ProjectData;
  users: User[];
  findUserById: (userId: string) => User | undefined;
  moveTask: (
    draggableId: string,
    source: { droppableId: string; index: number },
    destination: { droppableId: string; index: number }
  ) => void;
  addTask: (columnId: string, title: string) => void;
  updateTask: (taskId: string, updatedTask: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  addComment: (taskId: string, text: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, subtaskText: string) => void;
  addSubtasks: (taskId: string, subtaskTexts: string[]) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projectData, setProjectData] = useState<ProjectData>(INITIAL_PROJECT_DATA);

  const findUserById = useCallback((userId: string) => USERS.find(u => u.id === userId), []);

  const moveTask = useCallback((draggableId: string, source: { droppableId: string; index: number }, destination: { droppableId: string; index: number }) => {
    setProjectData(prevData => {
      const startColumn = prevData.columns[source.droppableId];
      const finishColumn = prevData.columns[destination.droppableId];

      if (startColumn === finishColumn) {
        // Moving within the same column
        const newTaskIds = Array.from(startColumn.taskIds);
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);
        const newColumn = { ...startColumn, taskIds: newTaskIds };
        return {
          ...prevData,
          columns: { ...prevData.columns, [newColumn.id]: newColumn },
        };
      } else {
        // Moving to a different column
        const startTaskIds = Array.from(startColumn.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStartColumn = { ...startColumn, taskIds: startTaskIds };

        const finishTaskIds = Array.from(finishColumn.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinishColumn = { ...finishColumn, taskIds: finishTaskIds };

        return {
          ...prevData,
          columns: {
            ...prevData.columns,
            [newStartColumn.id]: newStartColumn,
            [newFinishColumn.id]: newFinishColumn,
          },
        };
      }
    });
  }, []);
  
  const addTask = useCallback((columnId: string, title: string) => {
      if (!title.trim()) return;
      
      const newTaskId = `task-${Date.now()}`;
      const newTask: Task = {
        id: newTaskId,
        title,
        description: '',
        comments: [],
        subtasks: [],
      };

      setProjectData(prevData => {
        const column = prevData.columns[columnId];
        const newTaskIds = [...column.taskIds, newTaskId];

        return {
          ...prevData,
          tasks: {
            ...prevData.tasks,
            [newTaskId]: newTask,
          },
          columns: {
            ...prevData.columns,
            [columnId]: {
              ...column,
              taskIds: newTaskIds,
            },
          },
        };
      });
  }, []);

  const updateTask = useCallback((taskId: string, updatedTask: Partial<Task>) => {
    setProjectData(prevData => ({
      ...prevData,
      tasks: {
        ...prevData.tasks,
        [taskId]: { ...prevData.tasks[taskId], ...updatedTask },
      },
    }));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setProjectData(prevData => {
      const newTasks = { ...prevData.tasks };
      delete newTasks[taskId];

      const newColumns = { ...prevData.columns };
      Object.keys(newColumns).forEach(columnId => {
        const column = newColumns[columnId];
        const taskIndex = column.taskIds.indexOf(taskId);
        if (taskIndex > -1) {
          const newTaskIds = [...column.taskIds];
          newTaskIds.splice(taskIndex, 1);
          newColumns[columnId] = { ...column, taskIds: newTaskIds };
        }
      });

      return {
        ...prevData,
        tasks: newTasks,
        columns: newColumns,
      };
    });
  }, []);

  const addComment = useCallback((taskId: string, text: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      userId: USERS[0].id, // Mocking as the first user
      text,
      timestamp: new Date().toISOString(),
    };
    setProjectData(prevData => {
      const task = prevData.tasks[taskId];
      return {
        ...prevData,
        tasks: {
          ...prevData.tasks,
          [taskId]: {
            ...task,
            comments: [...task.comments, newComment],
          },
        },
      };
    });
  }, []);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setProjectData(prevData => {
      const task = prevData.tasks[taskId];
      const newSubtasks = task.subtasks.map(subtask =>
        subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
      );
      return {
        ...prevData,
        tasks: {
          ...prevData.tasks,
          [taskId]: { ...task, subtasks: newSubtasks },
        },
      };
    });
  }, []);
  
  const addSubtask = useCallback((taskId: string, subtaskText: string) => {
    if (!subtaskText.trim()) return;

    setProjectData(prevData => {
        const task = prevData.tasks[taskId];
        const newSubtask: Subtask = {
            id: `sub-${taskId}-${Date.now()}`,
            text: subtaskText.trim(),
            completed: false,
        };

        return {
            ...prevData,
            tasks: {
                ...prevData.tasks,
                [taskId]: {
                    ...task,
                    subtasks: [...task.subtasks, ...[newSubtask]],
                },
            },
        };
    });
  }, []);
  
  const addSubtasks = useCallback((taskId: string, subtaskTexts: string[]) => {
    setProjectData(prevData => {
        const task = prevData.tasks[taskId];
        const newSubtasks: Subtask[] = subtaskTexts.map((text, index) => ({
            id: `sub-${taskId}-${task.subtasks.length + index + 1}`,
            text,
            completed: false,
        }));

        return {
            ...prevData,
            tasks: {
                ...prevData.tasks,
                [taskId]: {
                    ...task,
                    subtasks: [...task.subtasks, ...newSubtasks],
                },
            },
        };
    });
}, []);

  return (
    <ProjectContext.Provider value={{ projectData, users: USERS, findUserById, moveTask, addTask, updateTask, deleteTask, addComment, toggleSubtask, addSubtask, addSubtasks }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

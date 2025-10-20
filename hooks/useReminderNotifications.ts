
import { useEffect } from 'react';
import { useProject } from './useProjectData';

const FIRED_REMINDERS_KEY = 'project-pilot-fired-reminders';

export const useReminderNotifications = () => {
    const { projectData } = useProject();

    useEffect(() => {
        // Function to check for due reminders and fire notifications
        const checkReminders = () => {
            // Only proceed if the user has granted permission
            if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
                return;
            }

            const now = new Date();
            // Get the list of reminders that have already been fired from localStorage
            const firedReminders: string[] = JSON.parse(localStorage.getItem(FIRED_REMINDERS_KEY) || '[]');
            const newFiredReminders = [...firedReminders];

            Object.values(projectData.tasks).forEach(task => {
                // Check if the task has a reminder date, it hasn't fired yet, and the time is now or in the past
                if (task.reminderDate && !firedReminders.includes(task.id)) {
                    const reminderTime = new Date(task.reminderDate);
                    if (reminderTime <= now) {
                        // Fire the browser notification
                        const notification = new Notification('Project Pilot Reminder', {
                            body: `Don't forget about your task: "${task.title}"`,
                            data: { taskId: task.id }, // Store task ID for interaction
                        });

                        // Add an onclick handler to the notification
                        notification.onclick = (event: any) => {
                            const clickedTaskId = event.target.data.taskId;
                            if (clickedTaskId) {
                                // Focus the window/tab where the app is running.
                                window.focus();
                                
                                // Set the URL to trigger the modal opening logic in Board.tsx
                                const url = new URL(window.location.href);
                                url.searchParams.set('openTask', clickedTaskId);
                                
                                // Navigate to the new URL, which will cause the Board component to
                                // detect the parameter and open the modal. A full navigation is
                                // used to ensure this works even if the tab is in the background.
                                window.location.href = url.toString();
                            }
                        };

                        // Add the task ID to our list of fired reminders
                        newFiredReminders.push(task.id);
                    }
                }
            });

            // If we fired any new notifications, update localStorage
            if (newFiredReminders.length > firedReminders.length) {
                localStorage.setItem(FIRED_REMINDERS_KEY, JSON.stringify(newFiredReminders));
            }
        };

        // Set up an interval to check for reminders periodically (e.g., every 30 seconds)
        const intervalId = setInterval(checkReminders, 30000);

        // Also run the check immediately when the component mounts
        checkReminders();

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);

    }, [projectData]); // Rerun the effect if projectData changes
};
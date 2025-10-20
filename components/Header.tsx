import React from 'react';
import { useProject } from '../hooks/useProjectData';
import { ShareIcon, ClipboardListIcon } from './icons/Icons';

export const Header: React.FC = () => {
    const { users } = useProject();

    return (
        <header className="flex items-center justify-between p-4 bg-white border-b border-slate-200 shrink-0">
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-teal-500 to-green-600 rounded-lg">
                    <ClipboardListIcon className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-slate-800">Project Pilot</h1>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center -space-x-2">
                    {users.map(user => (
                        <img
                            key={user.id}
                            className="w-9 h-9 rounded-full ring-2 ring-white"
                            src={user.avatarUrl}
                            alt={user.name}
                            title={user.name}
                        />
                    ))}
                </div>
                <button className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-md shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
                    <ShareIcon className="w-4 h-4 mr-2 -ml-1" />
                    Share Board
                </button>
            </div>
        </header>
    );
};
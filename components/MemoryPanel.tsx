
import React from 'react';
import type { Message } from '../types';

interface MemoryPanelProps {
    messages: Message[];
    onClearMemory: () => void;
    isMemoryVisible: boolean;
    onToggleMemoryVisibility: () => void;
}

export const MemoryPanel: React.FC<MemoryPanelProps> = ({ messages, onClearMemory, isMemoryVisible, onToggleMemoryVisibility }) => {
    const recentMessages = messages.slice(-10);

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-lg font-semibold text-gray-800">Sahayak AI Agent</h2>
            <p className="text-sm text-gray-600 mt-1 mb-4">
                Friendly, calm replies. Type or speak. This is a safe space.
            </p>
            <div className="flex space-x-2 mb-4">
                <button 
                    onClick={onToggleMemoryVisibility}
                    className="flex-1 py-2 px-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition text-sm font-medium"
                >
                    {isMemoryVisible ? 'Hide' : 'Show'} Recent Memory
                </button>
                <button 
                    onClick={onClearMemory}
                    className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
                >
                    Clear Memory
                </button>
            </div>
            
            {isMemoryVisible && (
                 <div className="flex-1 bg-gray-50 p-3 rounded-lg overflow-y-auto border border-gray-200">
                    <h3 className="text-md font-semibold text-gray-700 mb-2">Memory (last 10 interactions)</h3>
                    {recentMessages.length === 0 ? (
                        <p className="text-xs text-gray-500">No interactions yet.</p>
                    ) : (
                        <ul className="space-y-2 text-xs">
                            {recentMessages.map(msg => (
                                <li key={msg.id} className="text-gray-600">
                                    <span className={`font-semibold ${msg.role === 'user' ? 'text-teal-600' : 'text-gray-800'}`}>
                                        {msg.role === 'user' ? 'You:' : 'Sahayak:'}
                                    </span>
                                    <span className="ml-1">{msg.text.length > 50 ? `${msg.text.substring(0, 50)}...` : msg.text}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

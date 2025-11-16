
import React from 'react';
import type { Message } from '../types';

interface ChatBubbleProps {
    message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
    const isUser = message.role === 'user';
    const bubbleClasses = isUser
        ? 'bg-teal-500 text-white self-end'
        : 'bg-gray-200 text-gray-800 self-start';
    
    const containerClasses = isUser ? 'justify-end' : 'justify-start';

    return (
        <div className={`flex ${containerClasses} mb-4`}>
            <div className={`max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow ${bubbleClasses}`}>
                <p className="text-sm">{message.text}</p>
            </div>
        </div>
    );
};

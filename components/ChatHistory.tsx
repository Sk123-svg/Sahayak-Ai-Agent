
import React, { useEffect, useRef } from 'react';
import type { Message } from '../types';
import { ChatBubble } from './ChatBubble';

interface ChatHistoryProps {
    messages: Message[];
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-4 bg-white rounded-lg shadow-inner">
            <ChatBubble message={{ id: 'welcome', role: 'agent', text: 'Hello! How are you feeling today?', timestamp: new Date().toISOString() }} />
            {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
            ))}
            <div ref={endOfMessagesRef} />
        </div>
    );
};


import React, { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Message, Role } from './types';
import { detectCrisis } from './utils/safety';
import { toneFilter } from './utils/toneFilter';
import { generateTextResponse, generateSpeechResponse } from './services/geminiService';
import { ChatHistory } from './components/ChatHistory';
import { Controls } from './components/Controls';
import { MemoryPanel } from './components/MemoryPanel';
import { Header } from './components/Header';
import { decode, decodeAudioData } from './utils/audioUtils';

const App: React.FC = () => {
    const [sessionId, setSessionId] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [mood, setMood] = useState(3);
    const audioPlayerRef = useRef<HTMLAudioElement>(null);
    const [memoryVisible, setMemoryVisible] = useState(false);

    useEffect(() => {
        setSessionId(uuidv4());
    }, []);
    
    const playAudioResponse = useCallback(async (text: string) => {
        try {
            const audioData = await generateSpeechResponse(text);
            if (audioData && audioPlayerRef.current) {
                const audioBlob = new Blob([decode(audioData)], { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                audioPlayerRef.current.src = audioUrl;
                audioPlayerRef.current.play();
            }
        } catch (error) {
            console.error('Error playing audio response:', error);
            addMessage('agent', 'Sorry, I had trouble generating audio for my response.');
        }
    }, []);

    const addMessage = useCallback((role: Role, text: string) => {
        setMessages(prev => [...prev, {
            id: uuidv4(),
            role,
            text,
            timestamp: new Date().toISOString()
        }]);
    }, []);
    
    const handleSendMessage = useCallback(async (userText: string) => {
        if (!userText.trim()) {
            addMessage('agent', "I didn't catch anything — can you type or speak again?");
            return;
        }

        setIsLoading(true);
        addMessage('user', userText);

        if (detectCrisis(userText)) {
            const emergencyMsg = "I'm really sorry you're feeling so overwhelmed. If you are in immediate danger, please contact local emergency services now. In India, you can call the Aasra helpline at 9820466726. Would you like a grounding exercise?";
            addMessage('agent', emergencyMsg);
            await playAudioResponse(emergencyMsg);
            setIsLoading(false);
            return;
        }

        try {
            const history = messages.map(m => ({ role: m.role, parts: [{text: m.text}]}));
            const rawReply = await generateTextResponse(userText, history);
            const finalReply = toneFilter(rawReply);
            addMessage('agent', finalReply);
            await playAudioResponse(finalReply);
        } catch (error) {
            console.error('Error generating response:', error);
            const errorMessage = "I'm having a little trouble connecting right now. Let's take a deep breath and try again in a moment.";
            addMessage('agent', errorMessage);
            await playAudioResponse(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [messages, addMessage, playAudioResponse]);

    const clearMemory = useCallback(() => {
        setMessages([]);
        const newSessionId = uuidv4();
        setSessionId(newSessionId);
        addMessage('agent', 'Our memory has been cleared. Let\'s start fresh.');
    }, [addMessage]);


    return (
        <div className="flex flex-col h-screen bg-gray-50 font-sans">
            <Header />
            <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
                <div className="flex-1 flex flex-col p-4 md:p-6">
                    <ChatHistory messages={messages} />
                    <Controls
                        onSendMessage={handleSendMessage}
                        isLoading={isLoading}
                        mood={mood}
                        onMoodChange={setMood}
                    />
                </div>
                 <div className="w-full md:w-80 lg:w-96 bg-white border-l border-gray-200 p-4 flex flex-col shadow-sm">
                    <MemoryPanel 
                        messages={messages} 
                        onClearMemory={clearMemory}
                        isMemoryVisible={memoryVisible}
                        onToggleMemoryVisibility={() => setMemoryVisible(!memoryVisible)}
                    />
                </div>
            </main>
            <audio ref={audioPlayerRef} className="hidden" />
        </div>
    );
};

export default App;

import React, { useState, useRef, useEffect } from 'react';
import { MicIcon, SendIcon, StopCircleIcon } from './Icons';

// Add minimal type definitions for Web Speech API to fix TypeScript errors.
interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}
interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative;
    length: number;
    isFinal: boolean;
}
interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    length: number;
}
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}

interface ControlsProps {
    onSendMessage: (text: string) => void;
    isLoading: boolean;
    mood: number;
    onMoodChange: (value: number) => void;
}

// Check for SpeechRecognition API
// Fix for TypeScript error: Property 'SpeechRecognition' does not exist on type 'Window & typeof globalThis'.
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) {
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
}

export const Controls: React.FC<ControlsProps> = ({ onSendMessage, isLoading, mood, onMoodChange }) => {
    const [text, setText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    
    const handleSend = () => {
        if (text.trim() && !isLoading) {
            onSendMessage(text);
            setText('');
        }
    };

    const handleMicClick = () => {
        if (!recognition) {
            alert("Sorry, your browser doesn't support speech recognition.");
            return;
        }

        if (isRecording) {
            recognition.stop();
            setIsRecording(false);
        } else {
            recognition.start();
            setIsRecording(true);
        }
    };

    useEffect(() => {
        if (!recognition) return;

        // Fix for TypeScript error: Cannot find name 'SpeechRecognitionEvent'.
        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = event.results[event.results.length - 1][0].transcript;
            setText(prev => prev ? `${prev} ${transcript}` : transcript);
        };

        recognition.onend = () => {
            setIsRecording(false);
        };
        
        // Fix for TypeScript error: Cannot find name 'SpeechRecognitionErrorEvent'.
        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);
            setIsRecording(false);
        };
        
        return () => {
            if (recognition) {
              recognition.abort();
            }
        }
    }, []);

    return (
        <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="mb-4">
                <label htmlFor="mood-slider" className="block text-sm font-medium text-gray-700 mb-2">
                    How are you feeling right now? (1: Low - 5: High)
                </label>
                <input
                    id="mood-slider"
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={mood}
                    onChange={(e) => onMoodChange(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                    disabled={isLoading}
                />
            </div>
            <div className="flex items-center space-x-2">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder="Type how you feel, or use the microphone..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition resize-none"
                    rows={2}
                    disabled={isLoading || isRecording}
                />
                <button
                    onClick={handleMicClick}
                    disabled={isLoading}
                    className={`p-3 rounded-full transition ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                >
                   {isRecording ? <StopCircleIcon /> : <MicIcon />}
                </button>
                <button
                    onClick={handleSend}
                    disabled={isLoading || !text.trim()}
                    className="p-3 bg-teal-500 text-white rounded-full hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                    {isLoading ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : <SendIcon />}
                </button>
            </div>
        </div>
    );
};
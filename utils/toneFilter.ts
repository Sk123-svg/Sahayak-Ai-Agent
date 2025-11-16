
import { escapeRegExp } from 'lodash';

export const toneFilter = (reply: string): string => {
    let filteredReply = reply.trim();

    // Shorten long replies to the first 2-3 sentences
    const sentences = filteredReply.match(/[^.!?]+[.!?]+/g) || [filteredReply];
    if (sentences.length > 3) {
        filteredReply = sentences.slice(0, 3).join(' ');
    }

    // Softeners to ensure an empathetic tone
    const softeners = ["I hear you.", "That makes sense.", "You are not alone.", "Take a breath with me."];
    const hasSoftener = softeners.some(s => filteredReply.toLowerCase().includes(s.toLowerCase().replace('.', '')));
    
    if (!hasSoftener) {
        // Add a softener if one is not already present
        filteredReply += ` ${softeners[0]}`;
    }

    // Avoid giving direct medical or clinical advice
    const adviceWords = /\b(should|must|need to|have to|you must|see a doctor|get help)\b/gi;
    filteredReply = filteredReply.replace(adviceWords, "you might consider talking to someone you trust");

    return filteredReply;
};

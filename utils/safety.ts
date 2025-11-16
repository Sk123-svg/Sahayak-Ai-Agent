
const CRISIS_PATTERNS: RegExp[] = [
    /\b(i want to die|i'm going to die|kill myself|end my life|want to die|suicide|hurt myself)\b/i,
    /\b(can't go on|cant go on|no reason to live|finish it all|i will die)\b/i
];

export const detectCrisis = (text: string): boolean => {
    const lowercasedText = text.toLowerCase();
    for (const pattern of CRISIS_PATTERNS) {
        if (pattern.test(lowercasedText)) {
            return true;
        }
    }
    return false;
};

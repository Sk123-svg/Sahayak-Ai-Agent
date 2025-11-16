
export type Role = 'user' | 'agent';

export interface Message {
    id: string;
    role: Role;
    text: string;
    timestamp: string;
}

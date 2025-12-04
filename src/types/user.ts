export type UserTheme = 'light' | 'dark' | 'default'

export interface User {
    id: string;
    
    email: string;
    displayName?: string;
    photoURL?: string;

    customColor?: string;
    
    theme: UserTheme
    
    createdAt: string | number;
    lastLogin?: string | number;
}
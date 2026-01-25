import { ApiClient } from './api';

// Create a single instance to be used across the app
const apiClient = new ApiClient();

export const authClient = {
    getSession: async () => {
        // Sync token from storage into the client first
        if (typeof window === 'undefined') return { data: null };
        
        const token = localStorage.getItem('auth_token');
        if (!token || token === 'undefined') return { data: null };

        try {
            const user = await apiClient.getUserInfo();
            if (user) {
                return {
                    data: {
                        user: {
                            id: user.id,
                            email: user.email,
                            name: user.name
                        }
                    }
                };
            }
        } catch (error) {
            console.error('Session validation failed:', error);
        }

        return { data: null };
    },

    signIn: async (email: string, password: string) => {
        return await apiClient.login(email, password);
    },

    signUp: async (email: string, password: string, name: string) => {
        return await apiClient.register(email, password, name);
    },

    signOut: async () => {
        await apiClient.logout();
    }
};
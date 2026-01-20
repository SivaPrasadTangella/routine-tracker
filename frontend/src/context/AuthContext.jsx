import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../lib/services';
import Loading from '../components/ui/Loading';

import { getFriendlyErrorMessage } from '../lib/errorUtils';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await authService.getProfile();
                    setUser(userData);
                } catch (error) {
                    console.error("Failed to fetch profile", error);
                    // If fetching profile fails (e.g. invalid token), logout
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (username, password) => {
        try {
            const data = await authService.login(username, password);
            const { token, user_id, username: dbUsername } = data;
            localStorage.setItem('token', token);
            localStorage.setItem('username', dbUsername);
            setUser({ username: dbUsername }); // Optimistic update, can be refined to fetch full profile
            return { success: true };
        } catch (error) {
            console.error("Login failed:", error);
            return { success: false, error: getFriendlyErrorMessage(error) };
        }
    };

    const register = async (username, email, password) => {
        try {
            await authService.register(username, email, password);
            // Auto login after register
            return await login(username, password);
        } catch (error) {
            console.error("Registration failed:", error);
            return { success: false, error: getFriendlyErrorMessage(error) };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setUser(null);
    };

    const updateUser = async (userData) => {
        try {
            const updatedUser = await authService.updateProfile(userData);
            setUser(updatedUser);
            if (userData.username) {
                localStorage.setItem('username', userData.username);
            }
            return { success: true };
        } catch (error) {
            console.error("Update profile failed:", error);
            return { success: false, error: getFriendlyErrorMessage(error) };
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? <Loading fullScreen={true} message="Authenticating..." /> : children}
        </AuthContext.Provider>
    );
};

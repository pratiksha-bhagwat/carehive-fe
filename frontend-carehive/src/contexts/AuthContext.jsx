import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { API_BASE_URL } from '../config';

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Set auth token in axios headers and local storage
    const setAuthToken = useCallback((authToken) => {
        if (authToken) {
            api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
            localStorage.setItem('token', authToken);
        } else {
            delete api.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
        setToken(authToken);
    }, []);

    // Login function
    const login = useCallback(async (userData, authToken) => {
        try {
            setUser(userData);
            setAuthToken(authToken);
            localStorage.setItem('user', JSON.stringify(userData));
            setError(null);
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            setError(error.message || 'Login failed. Please try again.');
            return false;
        }
    }, [setAuthToken]);

    // Logout function
    const logout = useCallback(() => {
        setUser(null);
        setAuthToken(null);
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
    }, [navigate, setAuthToken]);

    // Check if user is authenticated
    const isAuthenticated = useCallback(() => !!token, [token]);

    // Check if user has specific role
    const hasRole = useCallback((role) => user?.userType === role, [user]);

    // Add response interceptor for token refresh
    useEffect(() => {
        const responseInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                
                // If error is not 401 or we've already tried to refresh, reject
                if (error.response?.status !== 401 || originalRequest._retry) {
                    return Promise.reject(error);
                }

                originalRequest._retry = true;

                try {
                    // Try to refresh the token
                    const response = await api.post('/auth/refresh-token');
                    const { token: newToken, user: userData } = response.data;
                    
                    // Update token and user
                    setAuthToken(newToken);
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                    
                    // Update the original request with the new token
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    // If refresh fails, logout the user
                    console.error('Token refresh failed:', refreshError);
                    logout();
                    return Promise.reject(refreshError);
                }
            }
        );

        return () => {
            api.interceptors.response.eject(responseInterceptor);
        };
    }, [logout, setAuthToken]);

    // Initialize auth state
    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            
            if (storedToken && storedUser) {
                try {
                    // Set the token in axios headers
                    api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                    setToken(storedToken);
                    
                    // Parse the stored user data
                    const userData = JSON.parse(storedUser);
                    setUser(userData);
                    setError(null);
                    
                    // Verify token and get fresh user data
                    const response = await api.get('/user/me');
                    setUser(response.data);
                    localStorage.setItem('user', JSON.stringify(response.data));
                } catch (error) {
                    console.error('Authentication check failed:', error);
                    if (error.response?.status === 401) {
                        // Token is invalid or expired
                        logout();
                    } else {
                        setError('Failed to verify session. Please login again.');
                        logout();
                    }
                }
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, [logout]);

    // Memoize the context value to prevent unnecessary re-renders
    const value = useMemo(() => ({
        user,
        token,
        isLoading,
        error,
        isAuthenticated,
        hasRole,
        login,
        logout,
        setAuthToken,
        api,
    }), [
        user,
        token,
        isLoading,
        error,
        isAuthenticated,
        hasRole,
        login,
        logout,
        setAuthToken,
    ]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default AuthContext;

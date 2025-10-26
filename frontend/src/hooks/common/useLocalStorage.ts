import { useState, useCallback, useEffect } from 'react';

/**
 * Centralized localStorage management hook
 * This hook provides a consistent interface for managing localStorage across the application,
 * eliminating the need for direct localStorage calls scattered throughout the codebase.
 */

// Types for localStorage data
export interface SkytrackStorageData {
  user: any | null; // TODO: Replace with proper User type
  token: string | null;
  preferences: Record<string, any>;
  cache: Record<string, any>;
}

// Storage keys - centralized for consistency
export const STORAGE_KEYS = {
  USER: 'skytrack_user',
  TOKEN: 'skytrack_token',
  PREFERENCES: 'skytrack_preferences',
  CACHE: 'skytrack_cache',
} as const;

type StorageKey = keyof typeof STORAGE_KEYS;

export const useLocalStorage = () => {
  // State to track changes in localStorage for reactive updates
  const [storageVersion, setStorageVersion] = useState(0);

  // Force re-render when storage changes
  const triggerUpdate = useCallback(() => {
    setStorageVersion(prev => prev + 1);
  }, []);

  // Generic get function with type safety
  const getItem = useCallback(<T = any>(key: StorageKey): T | null => {
    try {
      const item = localStorage.getItem(STORAGE_KEYS[key]);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return null;
    }
  }, [storageVersion]);

  // Generic set function with type safety
  const setItem = useCallback(<T = any>(key: StorageKey, value: T): void => {
    try {
      localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
      triggerUpdate();
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  }, [triggerUpdate]);

  // Generic remove function
  const removeItem = useCallback((key: StorageKey): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS[key]);
      triggerUpdate();
    } catch (error) {
      console.error(`Error removing from localStorage key "${key}":`, error);
    }
  }, [triggerUpdate]);

  // Clear all skytrack-related data
  const clearAll = useCallback((): void => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      triggerUpdate();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }, [triggerUpdate]);

  // Specific helpers for common operations
  const user = {
    get: () => getItem('USER'),
    set: (userData: any) => setItem('USER', userData),
    remove: () => removeItem('USER'),
  };

  const token = {
    get: () => getItem('TOKEN'),
    set: (tokenValue: string) => setItem('TOKEN', tokenValue),
    remove: () => removeItem('TOKEN'),
  };

  const preferences = {
    get: () => getItem('PREFERENCES') || {},
    set: (prefs: Record<string, any>) => setItem('PREFERENCES', prefs),
    update: (key: string, value: any) => {
      const current = getItem('PREFERENCES') || {};
      setItem('PREFERENCES', { ...current, [key]: value });
    },
    remove: () => removeItem('PREFERENCES'),
  };

  const cache = {
    get: () => getItem('CACHE') || {},
    set: (cacheData: Record<string, any>) => setItem('CACHE', cacheData),
    update: (key: string, value: any) => {
      const current = getItem('CACHE') || {};
      setItem('CACHE', { ...current, [key]: value });
    },
    remove: () => removeItem('CACHE'),
  };

  // Auth-specific helpers for easy migration
  const auth = {
    isAuthenticated: () => {
      const userData = user.get();
      const tokenValue = token.get();
      return !!(userData && tokenValue);
    },
    setAuth: (userData: any, tokenValue: string) => {
      user.set(userData);
      token.set(tokenValue);
    },
    clearAuth: () => {
      user.remove();
      token.remove();
    },
  };

  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && Object.values(STORAGE_KEYS).includes(e.key as any)) {
        triggerUpdate();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [triggerUpdate]);

  return {
    // Generic methods
    getItem,
    setItem,
    removeItem,
    clearAll,
    
    // Specific helpers
    user,
    token,
    preferences,
    cache,
    auth,
    
    // Utility
    keys: STORAGE_KEYS,
  };
};

export default useLocalStorage;
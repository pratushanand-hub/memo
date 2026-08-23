import { Mistake } from '../types';

const API_BASE = 'http://[https://mistake-memo-backend.onrender.com](https://mistake-memo-backend.onrender.com)/api/mistakes';
const GEMINI_API_KEY_STORAGE = 'mistake_memo_gemini_key';

let memoryCache: Mistake[] = [];

// Helper: Get user-specific local storage key
const getStorageKey = (userEmail?: string): string => {
  let email = userEmail;
  if (!email) {
    try {
      const savedUser = localStorage.getItem('mistake_memo_user');
      if (savedUser) {
        email = JSON.parse(savedUser).email;
      }
    } catch (e) {}
  }
  return email ? `mistake_memo_records_${email.toLowerCase()}` : 'mistake_memo_records_guest';
};

// 1. API Key Helpers
export const getGeminiApiKey = (): string => {
  return localStorage.getItem(GEMINI_API_KEY_STORAGE) || '';
};

export const saveGeminiApiKey = (key: string): void => {
  localStorage.setItem(GEMINI_API_KEY_STORAGE, key);
};

// 2. Fetch from MongoDB backend scoped to userEmail & sync local cache
export const fetchMistakesFromBackend = async (userEmail?: string): Promise<Mistake[]> => {
  let email = userEmail;
  if (!email) {
    try {
      const savedUser = localStorage.getItem('mistake_memo_user');
      if (savedUser) {
        email = JSON.parse(savedUser).email;
      }
    } catch (e) {}
  }

  const storageKey = getStorageKey(email);

  if (!email) {
    memoryCache = [];
    return [];
  }

  try {
    const res = await fetch(`${API_BASE}?userEmail=${encodeURIComponent(email)}`);
    const result = await res.json();

    if (result.success && Array.isArray(result.data)) {
      const formatted: Mistake[] = result.data.map((item: any) => ({
        ...item,
        id: item._id || item.id || `mistake_${Date.now()}`
      }));
      memoryCache = formatted;
      localStorage.setItem(storageKey, JSON.stringify(formatted));
      return formatted;
    }
  } catch (err) {
    console.warn('MongoDB fetch failed, using local cache:', err);
  }

  // Fallback to local storage cache if backend is unreachable
  try {
    const local = localStorage.getItem(storageKey);
    memoryCache = local ? JSON.parse(local) : [];
  } catch (e) {
    memoryCache = [];
  }

  return memoryCache;
};

// 3. Synchronous getter for React state initialization
export const getMistakes = (userEmail?: string): Mistake[] => {
  const storageKey = getStorageKey(userEmail);
  try {
    const local = localStorage.getItem(storageKey);
    if (local) {
      memoryCache = JSON.parse(local);
      return memoryCache;
    }
  } catch (e) {}
  return memoryCache || [];
};

// 4. Create in MongoDB + local cache with userEmail
export const addMistake = async (
  mistake: Omit<Mistake, 'id' | 'createdAt'>,
  userEmail?: string
): Promise<Mistake> => {
  let email = userEmail;
  if (!email) {
    try {
      const savedUser = localStorage.getItem('mistake_memo_user');
      if (savedUser) {
        email = JSON.parse(savedUser).email;
      }
    } catch (e) {}
  }

  const storageKey = getStorageKey(email);
  const tempId = `mistake_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  
  let newEntry: Mistake = {
    ...mistake,
    id: tempId,
    createdAt: new Date().toISOString()
  };

  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...mistake, userEmail: email })
    });
    const result = await res.json();
    if (result.success && result.data) {
      newEntry = {
        ...result.data,
        id: result.data._id || tempId
      };
    }
  } catch (err) {
    console.error('Failed to save to MongoDB:', err);
  }

  memoryCache = [newEntry, ...memoryCache];
  localStorage.setItem(storageKey, JSON.stringify(memoryCache));
  return newEntry;
};

// 5. Update in MongoDB + local cache
export const updateMistake = async (updatedMistake: Mistake, userEmail?: string): Promise<void> => {
  const storageKey = getStorageKey(userEmail);
  memoryCache = memoryCache.map(m => (m.id === updatedMistake.id ? updatedMistake : m));
  localStorage.setItem(storageKey, JSON.stringify(memoryCache));

  try {
    await fetch(`${API_BASE}/${updatedMistake.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedMistake)
    });
  } catch (err) {
    console.error('Failed to update in MongoDB:', err);
  }
};

// 6. Delete from MongoDB + local cache
export const deleteMistake = async (id: string, userEmail?: string): Promise<void> => {
  const storageKey = getStorageKey(userEmail);
  memoryCache = memoryCache.filter(m => m.id !== id);
  localStorage.setItem(storageKey, JSON.stringify(memoryCache));

  try {
    await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.error('Failed to delete from MongoDB:', err);
  }
};

// 7. Reset Database Helper (Clears active user's cache)
export const resetDatabase = (userEmail?: string): void => {
  const storageKey = getStorageKey(userEmail);
  localStorage.removeItem(storageKey);
  memoryCache = [];
};
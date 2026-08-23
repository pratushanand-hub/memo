import { Mistake } from '../types';

const API_BASE = 'http://localhost:5000/api/mistakes';
const LOCAL_STORAGE_KEY = 'mistake_memo_records';
const GEMINI_API_KEY_STORAGE = 'mistake_memo_gemini_key';

let memoryCache: Mistake[] = [];

// Initialize local cache safely
try {
  const local = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (local) {
    memoryCache = JSON.parse(local);
  }
} catch (e) {
  memoryCache = [];
}

// 1. API Key Helpers
export const getGeminiApiKey = (): string => {
  return localStorage.getItem(GEMINI_API_KEY_STORAGE) || '';
};

export const saveGeminiApiKey = (key: string): void => {
  localStorage.setItem(GEMINI_API_KEY_STORAGE, key);
};

// 2. Fetch from MongoDB backend & sync local cache
export const fetchMistakesFromBackend = async (): Promise<Mistake[]> => {
  try {
    const res = await fetch(API_BASE);
    const result = await res.json();
    if (result.success && Array.isArray(result.data)) {
      const formatted = result.data.map((item: any) => ({
        ...item,
        id: item._id || item.id || `mistake_${Date.now()}`
      }));
      memoryCache = formatted;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formatted));
      return formatted;
    }
  } catch (err) {
    console.warn('MongoDB fetch failed, using local cache:', err);
  }
  return memoryCache;
};

// 3. Synchronous getter for React state initialization
export const getMistakes = (): Mistake[] => {
  return memoryCache || [];
};

// 4. Create in MongoDB + local cache
export const addMistake = async (mistake: Omit<Mistake, 'id' | 'createdAt'>): Promise<Mistake> => {
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
      body: JSON.stringify(mistake)
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
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(memoryCache));
  return newEntry;
};

// 5. Update in MongoDB + local cache
export const updateMistake = async (updatedMistake: Mistake): Promise<void> => {
  memoryCache = memoryCache.map(m => (m.id === updatedMistake.id ? updatedMistake : m));
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(memoryCache));

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
export const deleteMistake = async (id: string): Promise<void> => {
  memoryCache = memoryCache.filter(m => m.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(memoryCache));

  try {
    await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.error('Failed to delete from MongoDB:', err);
  }
};

// 7. Reset Database Helper (Expected by Settings.tsx)
export const resetDatabase = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  memoryCache = [];
};
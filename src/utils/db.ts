import { Mistake } from '../types';

const STORAGE_KEY = 'mistake_memo_db';
const API_KEY_STORAGE_KEY = 'mistake_memo_gemini_api_key';

const SEED_MISTAKES: Mistake[] = [
  {
    id: 'seed-1',
    title: 'Array Index Out of Bounds',
    category: 'Java',
    tags: ['Arrays', 'Loops', 'Debugging'],
    description: 'My program crashed while looping through an array.',
    context: 'I was looping through an array of size n to calculate the running sum of elements.',
    cause: 'Used index comparison i <= n in my loop, which attempts to access array[n], causing an ArrayIndexOutOfBoundsException since valid indices are 0 to n-1.',
    solution: 'Changed the loop condition boundary to i < n (or i < array.length).',
    lesson: 'The maximum valid array index is length - 1. Always check loop boundaries before accessing array indexes.',
    createdAt: '2026-08-18T10:30:00.000Z',
    status: 'solved'
  },
  {
    id: 'seed-2',
    title: 'NullPointerException',
    category: 'Java',
    tags: ['Objects', 'Null', 'Debugging'],
    description: "My application crashed while accessing an object's property.",
    context: 'I was trying to retrieve user profiles from an array list and directly read the user.getName() property.',
    cause: 'The user object retrieved had not been initialized (it was null), but I accessed it without any validation.',
    solution: 'Initialized the object, returned empty instances when needed, and added proper null safety checks (e.g. if (user != null)).',
    lesson: 'Always verify whether an object can be null before invocation. Make null check a default habit.',
    createdAt: '2026-08-19T14:20:00.000Z',
    status: 'solved'
  },
  {
    id: 'seed-3',
    title: 'Infinite Loop',
    category: 'Programming',
    tags: ['Loops', 'Logic', 'Debugging'],
    description: 'My program never stopped running and froze the terminal.',
    context: 'I was implementing a countdown timer using a while loop that decreases a counter value.',
    cause: 'The loop condition never became false because I forgot to decrement the counter inside the loop body, or checked a variable that did not change.',
    solution: 'Added the missing count-- decrement statement inside the loop block.',
    lesson: 'Always ensure the loop has a valid termination condition and variables in the loop condition are updated.',
    createdAt: '2026-08-20T09:15:00.000Z',
    status: 'solved'
  },
  {
    id: 'seed-4',
    title: 'Git Merge Conflict',
    category: 'Git',
    tags: ['Git', 'Collaboration', 'Merge'],
    description: 'I could not merge my feature branch into the main branch due to overlapping lines.',
    context: 'I was attempting to merge a finished feature branch, but another developer had modified the exact same utility file on main.',
    cause: 'Two branches modified the same code lines in the same file. Git was unable to resolve which changes to keep automatically.',
    solution: 'Manually inspected conflicts in VS Code, discussed with the peer developer, merged the desired changes, and completed the merge commit.',
    lesson: 'Pull main frequently into feature branches to resolve issues early and keep commits small.',
    createdAt: '2026-08-21T11:00:00.000Z',
    status: 'solved'
  },
  {
    id: 'seed-5',
    title: 'API Authentication Error',
    category: 'Web Development',
    tags: ['API', 'Authentication', 'Token'],
    description: 'My client dashboard requests kept returning 401 Unauthorized errors.',
    context: 'I was fetching user dashboards from a backend REST API using fetch requests in JavaScript.',
    cause: 'The authorization Bearer token was either missing from the headers, or had expired, causing the server to reject the requests.',
    solution: 'Retrieved the latest token from storage and added the headers: { "Authorization": `Bearer ${token}` } to all client API requests.',
    lesson: 'Always verify authorization headers and token expiration times before debugging backend API code.',
    createdAt: '2026-08-21T16:45:00.000Z',
    status: 'solved'
  },
  {
    id: 'seed-6',
    title: 'React Infinite Re-render',
    category: 'React',
    tags: ['React', 'State', 'useEffect'],
    description: 'My React component kept rendering repeatedly, hitting CPU limits.',
    context: 'I was fetching details inside a useEffect hook and saving the result into the state variable.',
    cause: 'The state update (setData) triggered a component re-render, which triggered useEffect again because I omitted the dependency array or added the state variable to it.',
    solution: 'Specified a correct, empty dependency array [] or passed the correct state-independent dependency to the useEffect hook.',
    lesson: 'Be careful when updating component state inside effects; always specify exact hook dependencies.',
    createdAt: '2026-08-22T08:00:00.000Z',
    status: 'solved'
  }
];

export const getMistakes = (): Mistake[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_MISTAKES));
    return SEED_MISTAKES;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse mistakes from localStorage', e);
    return SEED_MISTAKES;
  }
};

export const saveMistakes = (mistakes: Mistake[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mistakes));
};

export const addMistake = (mistake: Omit<Mistake, 'id' | 'createdAt'>): Mistake => {
  const mistakes = getMistakes();
  const newMistake: Mistake = {
    ...mistake,
    id: 'mistake-' + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString()
  };
  mistakes.push(newMistake);
  saveMistakes(mistakes);
  return newMistake;
};

export const updateMistake = (updated: Mistake): void => {
  const mistakes = getMistakes();
  const index = mistakes.findIndex(m => m.id === updated.id);
  if (index !== -1) {
    mistakes[index] = updated;
    saveMistakes(mistakes);
  }
};

export const deleteMistake = (id: string): void => {
  const mistakes = getMistakes().filter(m => m.id !== id);
  saveMistakes(mistakes);
};

export const getGeminiApiKey = (): string => {
  return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
};

export const saveGeminiApiKey = (key: string): void => {
  localStorage.setItem(API_KEY_STORAGE_KEY, key);
};

export const resetDatabase = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_MISTAKES));
};

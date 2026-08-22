import { Mistake } from '../types';

const API_URL = 'http://localhost:5000/api/mistakes';

const API_KEY_STORAGE_KEY =
  'mistake_memo_gemini_api_key';


/* =========================
   GET ALL MISTAKES
========================= */

export const getMistakes = async (): Promise<Mistake[]> => {
  try {
    const response = await fetch(API_URL);

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.error || 'Failed to fetch mistakes'
      );
    }

    return result.data.map((mistake: any): Mistake => ({
      ...mistake,

      // MongoDB _id → frontend id
      id: mistake._id,

      title: mistake.title || '',

      category: mistake.category || 'General',

      severity: mistake.severity || 'Medium',

      description: mistake.description || '',

      context: mistake.context || '',

      cause: mistake.cause || '',

      solution: mistake.solution || '',

      lesson: mistake.lesson || '',

      tags: mistake.tags || [],

      createdAt: mistake.createdAt,

      status: mistake.status || 'open'
    }));

  } catch (error) {
    console.error(
      'Failed to fetch mistakes:',
      error
    );

    return [];
  }
};


/* =========================
   ADD MISTAKE
========================= */

export const addMistake = async (
  mistake: Omit<Mistake, 'id' | 'createdAt'>
): Promise<Mistake> => {

  try {

    const response = await fetch(API_URL, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        ...mistake,

        severity: mistake.severity || 'Medium',

        status: mistake.status || 'open'
      })
    });


    const result = await response.json();


    if (!response.ok || !result.success) {
      throw new Error(
        result.error || 'Failed to save mistake'
      );
    }


    return {
      ...result.data,

      id: result.data._id,

      title: result.data.title || '',

      category: result.data.category || 'General',

      severity: result.data.severity || 'Medium',

      description: result.data.description || '',

      context: result.data.context || '',

      cause: result.data.cause || '',

      solution: result.data.solution || '',

      lesson: result.data.lesson || '',

      tags: result.data.tags || [],

      createdAt: result.data.createdAt,

      status: result.data.status || 'open'
    };

  } catch (error) {

    console.error(
      'Failed to add mistake:',
      error
    );

    throw error;
  }
};


/* =========================
   UPDATE MISTAKE
========================= */

export const updateMistake = async (
  updated: Mistake
): Promise<Mistake> => {

  try {

    const response = await fetch(
      `${API_URL}/${updated.id}`,
      {
        method: 'PUT',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({

          title: updated.title,

          description: updated.description,

          category: updated.category,

          severity: updated.severity || 'Medium',

          context: updated.context,

          cause: updated.cause,

          solution: updated.solution,

          lesson: updated.lesson,

          tags: updated.tags,

          status: updated.status
        })
      }
    );


    const result = await response.json();


    if (!response.ok || !result.success) {
      throw new Error(
        result.error || 'Failed to update mistake'
      );
    }


    return {
      ...result.data,

      id: result.data._id,

      createdAt: result.data.createdAt
    };

  } catch (error) {

    console.error(
      'Failed to update mistake:',
      error
    );

    throw error;
  }
};


/* =========================
   DELETE MISTAKE
========================= */

export const deleteMistake = async (
  id: string
): Promise<void> => {

  try {

    const response = await fetch(
      `${API_URL}/${id}`,
      {
        method: 'DELETE'
      }
    );


    const result = await response.json();


    if (!response.ok || !result.success) {
      throw new Error(
        result.error || 'Failed to delete mistake'
      );
    }

  } catch (error) {

    console.error(
      'Failed to delete mistake:',
      error
    );

    throw error;
  }
};


/* =========================
   GEMINI API KEY
========================= */

export const getGeminiApiKey = (): string => {
  return (
    localStorage.getItem(
      API_KEY_STORAGE_KEY
    ) || ''
  );
};


export const saveGeminiApiKey = (
  key: string
): void => {

  localStorage.setItem(
    API_KEY_STORAGE_KEY,
    key
  );
};


/* =========================
   RESET DATABASE
========================= */

export const resetDatabase =
  async (): Promise<void> => {

    console.warn(
      'MongoDB reset is not implemented yet.'
    );
  };
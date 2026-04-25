/**
 * dataService - Handles communication with the persistence API.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const IS_PROD = import.meta.env.PROD;

export const dataService = {
  /**
   * Fetches all source data from the data/ directory.
   */
  async fetchSourceData() {
    if (IS_PROD) return {}; // Production'da kaynak dosyalar erişilebilir değil (sadece build edilmiş JSON kullanılır)
    
    const response = await fetch(`${API_BASE}/source-data`);
    if (!response.ok) throw new Error('Failed to fetch source data');
    return response.json();
  },

  /**
   * Saves changes to a specific file.
   */
  async saveFile(filePath, type, content) {
    if (IS_PROD) throw new Error('Production ortamında dosya kaydetme devre dışıdır.');

    const response = await fetch(`${API_BASE}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath, type, content }),
    });
    if (!response.ok) throw new Error('Failed to save file');
    return response.json();
  },

  /**
   * Updates an entire author and their works across all source files.
   */
  async updateAuthor(originalName, updatedAuthor) {
    if (IS_PROD) throw new Error('Production ortamında güncelleme devre dışıdır.');

    const response = await fetch(`${API_BASE}/update-author`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalName, updatedAuthor }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to update author');
    }
    return response.json();
  },

  /**
   * Deletes an author from all source files.
   */
  async deleteAuthor(authorName) {
    if (IS_PROD) throw new Error('Production ortamında silme devre dışıdır.');

    const response = await fetch(`${API_BASE}/delete-author`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorName }),
    });
    if (!response.ok) throw new Error('Failed to delete author');
    return response.json();
  }
};

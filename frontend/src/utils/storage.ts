const ALLOWED_KEYS = ["auth_token", "user", "theme", "language"];

export const secureStorage = {
  setItem: (key: string, value: unknown) => {
    if (!ALLOWED_KEYS.includes(key)) {
      console.warn(`Storage of ${key} is not allowed`);
      return;
    }
    const stringValue =
      typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, stringValue);
  },

  getItem: <T>(key: string): T | string | null => {
    if (!ALLOWED_KEYS.includes(key)) return null;
    const value = localStorage.getItem(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return value;
    }
  },

  removeItem: (key: string) => {
    if (!ALLOWED_KEYS.includes(key)) return;
    localStorage.removeItem(key);
  },

  clear: () => {
    // Only clear allowed keys if needed, or clear all but warn
    localStorage.clear();
  },
};

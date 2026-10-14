/**
 * Good Life Fitness AI — Enterprise Hybrid Storage Service
 *
 * Provides safe, robust client-side storage with:
 * - Namespace isolation (`glfa:`)
 * - In-memory fallback if localStorage is disabled or restricted
 * - Graceful JSON serialization & error recovery
 * - User-scoped caching and cleanup on logout
 * - TTL-aware API result caching
 * - Strict security policies (prevents storing credentials or plain secrets)
 */

const STORAGE_PREFIX = 'glfa:';

// In-memory fallback for private browsing or restricted environments
const memoryStorage = new Map();

/**
 * Checks if localStorage is available and writable
 */
const isStorageAvailable = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const testKey = `${STORAGE_PREFIX}__test__`;
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

const storageAvailable = isStorageAvailable();

// Prohibited keys or fields for security
const FORBIDDEN_FIELDS = ['password', 'jwtSecret', 'apiKey', 'tokenSecret', 'adminPasscode'];

/**
 * Inspects values for prohibited credentials
 */
const validateSecurity = (key, value) => {
  const lowerKey = key.toLowerCase();
  for (const field of FORBIDDEN_FIELDS) {
    if (lowerKey.includes(field.toLowerCase())) {
      throw new Error(`[StorageService Security Error] Prohibited sensitive key: "${key}"`);
    }
  }

  if (value && typeof value === 'object') {
    for (const field of FORBIDDEN_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(value, field)) {
        throw new Error(`[StorageService Security Error] Object contains sensitive field: "${field}"`);
      }
    }
  }
};

export const storageService = {
  /**
   * Generates a fully namespaced storage key
   */
  formatKey(key) {
    return key.startsWith(STORAGE_PREFIX) ? key : `${STORAGE_PREFIX}${key}`;
  },

  /**
   * Retrieves an item from storage with fallback
   */
  getItem(key, fallback = null) {
    const fullKey = this.formatKey(key);
    try {
      if (storageAvailable) {
        const raw = window.localStorage.getItem(fullKey);
        if (raw === null || raw === undefined) return fallback;
        try {
          return JSON.parse(raw);
        } catch (parseError) {
          console.warn(`[StorageService] Corrupted JSON in "${fullKey}". Returning fallback.`, parseError);
          return fallback;
        }
      } else {
        return memoryStorage.has(fullKey) ? memoryStorage.get(fullKey) : fallback;
      }
    } catch (e) {
      console.warn(`[StorageService] Read error on "${fullKey}":`, e);
      return fallback;
    }
  },

  /**
   * Sets an item in storage with safe serialization & quota handling
   */
  setItem(key, value) {
    validateSecurity(key, value);
    const fullKey = this.formatKey(key);

    try {
      const serialized = JSON.stringify(value);
      if (storageAvailable) {
        try {
          window.localStorage.setItem(fullKey, serialized);
        } catch (quotaError) {
          if (
            quotaError.name === 'QuotaExceededError' ||
            quotaError.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
            quotaError.code === 22 ||
            quotaError.code === 1014
          ) {
            console.warn('[StorageService] Storage quota reached. Pruning stale cache entries...');
            this.pruneOldCaches();
            try {
              window.localStorage.setItem(fullKey, serialized);
            } catch (retryError) {
              console.error('[StorageService] Quota still exceeded after pruning:', retryError);
              memoryStorage.set(fullKey, value);
            }
          } else {
            throw quotaError;
          }
        }
      } else {
        memoryStorage.set(fullKey, value);
      }
      return true;
    } catch (e) {
      console.error(`[StorageService] Failed to set "${fullKey}":`, e);
      return false;
    }
  },

  /**
   * Removes an item by key
   */
  removeItem(key) {
    const fullKey = this.formatKey(key);
    try {
      if (storageAvailable) {
        window.localStorage.removeItem(fullKey);
      }
      memoryStorage.delete(fullKey);
      return true;
    } catch (e) {
      console.warn(`[StorageService] Error removing "${fullKey}":`, e);
      return false;
    }
  },

  // -------------------------------------------------------------
  // USER-SCOPED STORAGE HELPERS
  // -------------------------------------------------------------

  /**
   * Format a user-scoped key: glfa:user:<userId>:<key>
   */
  formatUserKey(userId, key) {
    if (!userId) {
      throw new Error('[StorageService] userId required for user-scoped storage');
    }
    return `user:${userId}:${key}`;
  },

  getUserItem(userId, key, fallback = null) {
    if (!userId) return fallback;
    return this.getItem(this.formatUserKey(userId, key), fallback);
  },

  setUserItem(userId, key, value) {
    if (!userId) return false;
    return this.setItem(this.formatUserKey(userId, key), value);
  },

  removeUserItem(userId, key) {
    if (!userId) return false;
    return this.removeItem(this.formatUserKey(userId, key));
  },

  /**
   * Cleans all keys associated with a specific user (Called on Logout)
   */
  clearUserData(userId) {
    if (!userId) return;
    const prefix = `${STORAGE_PREFIX}user:${userId}:`;

    try {
      if (storageAvailable) {
        const keysToRemove = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k && k.startsWith(prefix)) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => window.localStorage.removeItem(k));
      }

      // Clean memory storage
      for (const k of memoryStorage.keys()) {
        if (k.startsWith(prefix)) {
          memoryStorage.delete(k);
        }
      }
      console.log(`[StorageService] Isolated user data purged for userId: ${userId}`);
    } catch (e) {
      console.warn(`[StorageService] Error clearing data for user ${userId}:`, e);
    }
  },

  // -------------------------------------------------------------
  // CACHE MANAGEMENT HELPERS
  // -------------------------------------------------------------

  /**
   * Writes data into an expiring client cache wrapper
   */
  setCache(key, data, version = '1.0') {
    const payload = {
      data,
      cachedAt: Date.now(),
      version,
    };
    return this.setItem(`cache:${key}`, payload);
  },

  /**
   * Retrieves cache if valid and unexpired
   */
  getCache(key, maxAgeMs = 1000 * 60 * 60) { // default 1 hour TTL
    const payload = this.getItem(`cache:${key}`, null);
    if (!payload || !payload.cachedAt || payload.data === undefined) {
      return null;
    }

    const age = Date.now() - payload.cachedAt;
    if (age > maxAgeMs) {
      this.removeItem(`cache:${key}`);
      return null; // Expired
    }

    return payload.data;
  },

  /**
   * Clears all expired or cached API records to recover quota
   */
  pruneOldCaches() {
    const cachePrefix = `${STORAGE_PREFIX}cache:`;
    try {
      if (storageAvailable) {
        const cacheKeys = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k && k.startsWith(cachePrefix)) {
            cacheKeys.push(k);
          }
        }
        cacheKeys.forEach((k) => window.localStorage.removeItem(k));
      }
    } catch (e) {
      console.warn('[StorageService] Error pruning caches:', e);
    }
  },

  /**
   * Cleans only application preference keys (leaving user accounts/auth untouched)
   */
  clearAppPreferences() {
    const prefPrefix = `${STORAGE_PREFIX}preferences:`;
    try {
      if (storageAvailable) {
        const keys = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k && k.startsWith(prefPrefix)) {
            keys.push(k);
          }
        }
        keys.forEach((k) => window.localStorage.removeItem(k));
      }
    } catch (e) {
      console.warn('[StorageService] Error clearing preferences:', e);
    }
  },
};

export default storageService;

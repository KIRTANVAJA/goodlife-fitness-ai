import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

const DB_DOC_KEY = 'good-life-fitness-mumbai'; // default document name
const FIREBASE_CONFIG_KEY = 'glf_firebase_config';

/**
 * Retrieves the Firebase configuration from localStorage or environment variables.
 */
export const getFirebaseConfig = () => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(FIREBASE_CONFIG_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('[DB] Error parsing stored Firebase config:', e);
    }
  }

  // Fallback to Vite environment variables if configured
  if (import.meta.env && import.meta.env.VITE_FIREBASE_API_KEY) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      docName: import.meta.env.VITE_FIREBASE_DOC_NAME || DB_DOC_KEY
    };
  }

  return null;
};

/**
 * Saves the Firebase configuration to localStorage.
 */
export const saveFirebaseConfig = (config) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
  }
};

/**
 * Removes the Firebase configuration from localStorage.
 */
export const clearFirebaseConfig = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(FIREBASE_CONFIG_KEY);
  }
};

/**
 * Checks if Firebase is currently configured with keys.
 */
export const isFirebaseConfigured = () => {
  const config = getFirebaseConfig();
  return !!(config && config.apiKey && config.projectId);
};

let dbInstance = null;
let appInstance = null;

/**
 * Safe initializer for Firebase app and Firestore.
 */
export const initFirestore = () => {
  if (dbInstance) return dbInstance;

  const config = getFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    return null;
  }

  try {
    const firebaseConfig = {
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId
    };

    if (getApps().length === 0) {
      appInstance = initializeApp(firebaseConfig);
    } else {
      appInstance = getApp();
    }

    dbInstance = getFirestore(appInstance);
    console.log('[DB] Firebase Firestore initialized successfully');
    return dbInstance;
  } catch (error) {
    console.error('[DB] Error initializing Firebase:', error);
    return null;
  }
};

// HTML5 BroadcastChannel for instant cross-tab same-browser local synchronization
const syncChannel = typeof window !== 'undefined' ? new BroadcastChannel('glf_realtime_sync') : null;

/**
 * Saves the website content. Persists to localStorage, broadcasts cross-tab 
 * via BroadcastChannel, and pushes to Firebase Firestore if configured.
 */
export const saveContent = async (content) => {
  // 1. Cache to local storage
  if (typeof window !== 'undefined') {
    localStorage.setItem('glf_website_content', JSON.stringify(content));
  }

  // 2. Broadcast to other tabs immediately
  if (syncChannel) {
    syncChannel.postMessage({ type: 'CONTENT_UPDATE', content });
  }

  // 3. Sync to Firebase Firestore if connected
  const db = initFirestore();
  if (db) {
    const config = getFirebaseConfig();
    const docName = (config && config.docName) || DB_DOC_KEY;
    try {
      const docRef = doc(db, 'gym-content', docName);
      await setDoc(docRef, content, { merge: true });
      console.log(`[DB] Live update pushed to Firestore (${docName})`);
    } catch (e) {
      console.error('[DB] Failed to save live content to Firestore:', e);
      throw e; // Bubble error up to show failed connection indicators in UI
    }
  }
};

/**
 * Subscribes to content updates.
 * Listens to Firebase Firestore snapshots if configured, falls back to local 
 * BroadcastChannel messages and storage events for cross-tab sync.
 */
export const subscribeToContent = (onUpdate) => {
  const db = initFirestore();
  let unsubFirestore = null;

  // 1. Listen to Firestore cloud updates
  if (db) {
    const config = getFirebaseConfig();
    const docName = (config && config.docName) || DB_DOC_KEY;
    try {
      const docRef = doc(db, 'gym-content', docName);
      unsubFirestore = onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          console.log('[DB] Live update received from Firestore snapshot:', data);
          onUpdate(data);
        }
      }, (err) => {
        console.error('[DB] Firestore Snapshot subscription error:', err);
      });
    } catch (e) {
      console.error('[DB] Failed to bind Firestore live subscriber:', e);
    }
  }

  // 2. Listen to BroadcastChannel updates (tab-to-tab)
  const handleBroadcast = (event) => {
    if (event.data && event.data.type === 'CONTENT_UPDATE' && event.data.content) {
      console.log('[DB] Live update received via local BroadcastChannel');
      onUpdate(event.data.content);
    }
  };

  if (syncChannel) {
    syncChannel.addEventListener('message', handleBroadcast);
  }

  // 3. Listen to standard storage changes (backup for other processes)
  const handleStorageChange = (e) => {
    if (e.key === 'glf_website_content' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        console.log('[DB] Live update received via localStorage storage event');
        onUpdate(parsed);
      } catch (err) {
        console.error('[DB] Error parsing storage event content:', err);
      }
    }
  };

  window.addEventListener('storage', handleStorageChange);

  // Return cleanup hook
  return () => {
    if (unsubFirestore) {
      unsubFirestore();
    }
    if (syncChannel) {
      syncChannel.removeEventListener('message', handleBroadcast);
    }
    window.removeEventListener('storage', handleStorageChange);
  };
};

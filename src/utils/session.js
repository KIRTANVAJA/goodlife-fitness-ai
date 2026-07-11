// Admin Session Management with Inactivity Expiration (15 minutes)

const SESSION_EXPIRATION_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

export const startAdminSession = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('glf_admin_authorized', 'true');
    sessionStorage.setItem('glf_admin_auth_timestamp', Date.now().toString());
    console.log('[Session] Admin session initialized');
  }
};

export const clearAdminSession = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('glf_admin_authorized');
    sessionStorage.removeItem('glf_admin_auth_timestamp');
    console.log('[Session] Admin session cleared');
  }
};

export const checkAdminSession = () => {
  if (typeof window === 'undefined') return false;

  const authorized = sessionStorage.getItem('glf_admin_authorized');
  const timestampStr = sessionStorage.getItem('glf_admin_auth_timestamp');

  if (authorized !== 'true' || !timestampStr) {
    return false;
  }

  const authTime = parseInt(timestampStr, 10);
  const now = Date.now();

  if (isNaN(authTime) || (now - authTime) > SESSION_EXPIRATION_DURATION) {
    console.log('[Session] Admin session expired due to inactivity');
    clearAdminSession();
    return false;
  }

  // Rolling session - update active timestamp on successful validation
  sessionStorage.setItem('glf_admin_auth_timestamp', now.toString());
  return true;
};

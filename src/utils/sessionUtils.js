// sessionUtils.js
export function saveSession(userId, userData) {
    sessionStorage.setItem(`session_${userId}`, JSON.stringify(userData));
  }
    
  export function getSession(userId) {
    const sessionData = localStorage.getItem(`session_${userId}`);
    return sessionData ? JSON.parse(sessionData) : null;
  }
  
  export function clearSession(userId) {
    localStorage.removeItem(`session_${userId}`);
  }
  
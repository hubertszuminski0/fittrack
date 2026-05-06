const usersKey = 'fittrack:users';
const sessionKey = 'fittrack:session';
const workspacePrefix = 'fittrack:workspace:';

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUsers() {
  return readJson(usersKey, []);
}

export function saveUsers(users) {
  writeJson(usersKey, users);
}

export function getSession() {
  return readJson(sessionKey, null);
}

export function saveSession(user) {
  writeJson(sessionKey, user);
}

export function clearSession() {
  localStorage.removeItem(sessionKey);
}

export function getWorkspace(email) {
  return readJson(`${workspacePrefix}${email}`, null);
}

export function saveWorkspace(email, workspace) {
  writeJson(`${workspacePrefix}${email}`, workspace);
}

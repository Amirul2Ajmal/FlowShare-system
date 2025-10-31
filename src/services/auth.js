import api from "./api";

const USER_KEY = "user"; // LocalStorage key

// 🔹 Login user
export async function login(userName, password) {
  try {
    const res = await api.post("/user/login", { userName, password });
    if (res.data && res.data.status === 200) {
      // Save user to localStorage
      localStorage.setItem(USER_KEY, JSON.stringify(res.data.data));
    }
    return res.data;
  } catch (err) {
    throw err;
  }
}

// 🔹 Logout user
export function logout() {
  localStorage.removeItem(USER_KEY);
}

// 🔹 Get current logged-in user
export function getCurrentUser() {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

// 🔹 Check if logged in
export function isAuthenticated() {
  return !!getCurrentUser();
}

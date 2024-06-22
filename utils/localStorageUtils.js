// utils/localStorageUtils.js
export const loadState = () => {
  if (typeof window === "undefined") return undefined; // Ensure this runs only on client-side
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Error loading state from local storage:", err);
    return undefined;
  }
};

export const saveState = (state) => {
  if (typeof window === "undefined") return; // Ensure this runs only on client-side
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (err) {
    console.error("Error saving state to local storage:", err);
  }
};

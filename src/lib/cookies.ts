const TOKEN_KEY = "token";

// SET cookie
export const setToken = (token: string) => {
  if (typeof document === "undefined") return;

  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=86400; SameSite=Lax`;
};


// GET cookie
export const getToken = (): string | null => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split("; ");

  const tokenCookie = cookies.find((row) =>
    row.startsWith(`${TOKEN_KEY}=`)
  );

  return tokenCookie ? tokenCookie.split("=")[1] : null;
};

// REMOVE cookie
export const removeToken = () => {
  if (typeof document === "undefined") return;

  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
  document.cookie =
    "isProfileCompleted=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  sessionStorage.setItem('jobs-count-popup-shown', 'false');
  sessionStorage.setItem("email-popup-shown", "false");
};
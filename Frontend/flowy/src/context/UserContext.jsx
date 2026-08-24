import { createContext, useContext, useMemo, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    id: "guest_user_001",
  });
  // Authentication values reserved for the backend/Firebase connection.
  const [accessToken, setAccessToken] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const updateUser = (nextUser) => {
    setUser((prev) => ({ ...prev, ...nextUser }));
  };

  const clearUser = () => {
    setUser({ id: "" });
    setAccessToken("");
    setAuthError("");
    setIsAuthenticating(false);
  };

  const value = useMemo(
    () => ({
      user,
      updateUser,
      clearUser,
      accessToken,
      setAccessToken,
      authError,
      setAuthError,
      isAuthenticating,
      setIsAuthenticating,
    }),
    [user, accessToken, authError, isAuthenticating],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}

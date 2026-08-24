import { createContext, useContext, useMemo, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    id: "guest_user_001",
  });

  const updateUser = (nextUser) => {
    setUser((prev) => ({ ...prev, ...nextUser }));
  };

  const clearUser = () => {
    setUser({ id: "" });
  };

  const value = useMemo(
    () => ({
      user,
      updateUser,
      clearUser,
    }),
    [user],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}

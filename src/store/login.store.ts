import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  username: string;
  id_user: string;
  login: string;
  rol: string | undefined;
  profilePicture: string;
}

interface UserStore extends UserState {
  setUserData: (
    username: string,
    profilePicture: string,
    login: string,
    id_user: string,
  ) => void;
  setRol: (rol: string | undefined) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      username: "",
      profilePicture: "",
      login: "",
      id_user: "",
      rol: "",
      setUserData: (username, profilePicture, login, id_user) =>
        set({ username, profilePicture, login, id_user }),
      setRol: (rol) => set({ rol }),
    }),
    {
      name: "userStore",
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    },
  ),
);

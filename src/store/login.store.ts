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
    id_user: string
  ) => void;
  setRol: (rol: string | undefined) => void;
}

export const useUserStore = create<UserStore, [["zustand/persist", UserState]]>(
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
      getStorage: () => sessionStorage, 
      serialize: (data) => JSON.stringify(data),
      deserialize: (str) => JSON.parse(str),
    }
  )
);

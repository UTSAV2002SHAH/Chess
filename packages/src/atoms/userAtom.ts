import { atom, selector } from 'recoil';

export const BACKEND_URL = 'http://localhost:4000';
export interface User {
  id: string;
  name: string;
  token: string;
  isGuest: boolean;
}

export const userAtom = atom<User>({
  key: 'user',
  default: selector({
    key: 'user/default',
    get: async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/user/refresh`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            console.log(data.user);

            return data.user;
          } else {
            console.error("Backend error:", data.message);
            return null;
          }
        } else {
          console.error("HTTP error:", response.status);
          return null;
        }
      } catch (e) {
        console.error(e);
        return null;
      }
    },
  }),
});
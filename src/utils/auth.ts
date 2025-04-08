// src/utils/auth.ts
export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem("token"); // 토큰 존재 여부로 판단
  };
  
  export const login = (token: string) => {
    localStorage.setItem("token", token);
  };
  
  export const logout = () => {
    localStorage.removeItem("token");
  };
  
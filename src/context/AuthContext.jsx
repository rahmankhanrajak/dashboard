// import { createContext, useContext, useState, useEffect, useCallback } from "react";
// import { useRefreshMutation } from "../store/authApi";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [accessToken, setAccessToken] = useState(null);
//   const [isLoading, setIsLoading] = useState(true); 
//   const [refresh] = useRefreshMutation();

//   const logout = useCallback(() => {
//     setUser(null);
//     setAccessToken(null);
//   }, []);

//   useEffect(() => {
//     const restoreSession = async () => {
//       try {
//         const result = await refresh().unwrap();
//         console.log("Session restored:", result);
//         setAccessToken(result.accessToken);
//         setUser(result.user);
//       } catch (error) {
//         console.log("No valid session");
//       } finally {
//         setIsLoading(false); 
//       }
//     };

//     restoreSession();
//   }, [refresh]);

//   useEffect(() => {
//     if (!accessToken) return;

//     const refreshInterval = setInterval(async () => {
//       try {
//         const result = await refresh().unwrap();
//         setAccessToken(result.accessToken);
//         setUser(result.user); 
//         console.log("Token refreshed successfully");
//       } catch (error) {
//         console.error("Token refresh failed:", error);
//         logout();
//       }
//     }, 30 * 1000);

//     return () => clearInterval(refreshInterval);
//   }, [accessToken, refresh, logout]);

//   const login = (userData, token) => {
//     setUser(userData);
//     setAccessToken(token);
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   return (
//     <AuthContext.Provider value={{ user, accessToken, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  accessToken: string | null;
  checkAuth: () => Promise<void>;
  isPostLoginTransition: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPostLoginTransition, setIsPostLoginTransition] =
    useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    const storedAccessToken = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");
    setAccessToken(storedAccessToken);

    if (storedAccessToken && storedUser) {
      try {
        const profile = JSON.parse(storedUser);
        setUser(profile);
        setIsAuthenticated(true);
      } catch (error: any) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        setAccessToken(null);
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setAccessToken(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (username: string, _password: string) => {
    try {
      // Autenticación local simple - acepta cualquier usuario/contraseña
      // En producción, aquí podrías validar contra usuarios predefinidos
      const mockUser = {
        id: 1,
        username: username,
        email: `${username}@example.com`,
        name: username.charAt(0).toUpperCase() + username.slice(1),
      };

      const mockToken = `mock_token_${Date.now()}`;

      localStorage.setItem("access_token", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));
      setAccessToken(mockToken);
      setUser(mockUser);
      setIsAuthenticated(true);
      setIsPostLoginTransition(true);

      setTimeout(() => {
        setIsPostLoginTransition(false);
      }, 2000); // Duración de la animación de la puerta
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      setAccessToken(null);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    setAccessToken(null);
    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        isLoading,
        accessToken,
        checkAuth,
        isPostLoginTransition,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

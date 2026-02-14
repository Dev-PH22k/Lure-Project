import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useCallback, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

/**
 * Hook de autenticação simplificado para produção.
 * Desativa a trava do Manus para permitir acesso direto ao dashboard.
 */
export function useAuth(options?: UseAuthOptions) {
  const utils = trpc.useUtils();

  // Mock de usuário para permitir acesso imediato
  const state = useMemo(() => {
    const mockUser = { 
      id: "lure-admin", 
      name: "Lure Digital Admin", 
      email: "admin@luredigital.com.br",
      role: "admin" 
    };
    
    return {
      user: mockUser,
      loading: false,
      error: null,
      isAuthenticated: true,
    };
  }, []);

  const logout = useCallback(async () => {
    console.log("Logout solicitado");
  }, []);

  return {
    ...state,
    refresh: () => Promise.resolve(),
    logout,
  };
}

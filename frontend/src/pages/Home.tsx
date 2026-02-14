import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { getLoginUrl } from "@/const";
import { Lock, TrendingUp, Users, Zap } from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated && user) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, user, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-blue-950 flex items-center justify-center px-4 py-12">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-900/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-2xl border-2 border-amber-400">
              <TrendingUp className="w-12 h-12 text-black" />
            </div>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent mb-2">
            LURE DIGITAL
          </h1>
          <p className="text-xl text-slate-300 font-light">Dashboard de Performance de Vendas</p>
          <p className="text-slate-500 text-sm mt-2">Monitore suas métricas em tempo real</p>
        </div>

        {/* Main Login Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Features */}
          <div className="space-y-4">
            <div className="bg-slate-900/40 backdrop-blur border border-blue-900/30 rounded-lg p-5 hover:border-amber-500/50 transition-all">
              <div className="flex items-start gap-3">
                <Users className="w-6 h-6 text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-semibold text-sm">10 Colaboradores</h3>
                  <p className="text-slate-400 text-xs mt-1">Closers e SDRs</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur border border-blue-900/30 rounded-lg p-5 hover:border-amber-500/50 transition-all">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-semibold text-sm">Análise Completa</h3>
                  <p className="text-slate-400 text-xs mt-1">Métricas em tempo real</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur border border-blue-900/30 rounded-lg p-5 hover:border-amber-500/50 transition-all">
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-semibold text-sm">Performance</h3>
                  <p className="text-slate-400 text-xs mt-1">Rápido e responsivo</p>
                </div>
              </div>
            </div>
          </div>

          {/* Center Login Box */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-amber-500/30 rounded-xl p-8 shadow-2xl h-full flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Acesso Seguro</h2>
                <p className="text-slate-400 text-sm mb-8">Faça login para acessar seu dashboard</p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-slate-300 text-sm">
                    <Lock className="w-4 h-4 text-amber-500" />
                    <span>Autenticação OAuth segura</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300 text-sm">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                    <span>Dados em tempo real</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300 text-sm">
                    <Users className="w-4 h-4 text-amber-500" />
                    <span>Equipe colaborativa</span>
                  </div>
                </div>
              </div>

              <a href={getLoginUrl()} className="block">
                <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold py-6 text-base rounded-lg transition-all shadow-lg hover:shadow-xl">
                  Entrar com Manus
                </Button>
              </a>

              <p className="text-slate-500 text-xs text-center mt-6 pt-6 border-t border-slate-700">
                Plataforma segura com autenticação Manus OAuth
              </p>
            </div>
          </div>

          {/* Right Stats */}
          <div className="space-y-4">
            <div className="bg-slate-900/40 backdrop-blur border border-blue-900/30 rounded-lg p-5 hover:border-amber-500/50 transition-all">
              <p className="text-amber-500 text-3xl font-bold">7</p>
              <p className="text-slate-400 text-xs mt-2">Closers Ativos</p>
            </div>

            <div className="bg-slate-900/40 backdrop-blur border border-blue-900/30 rounded-lg p-5 hover:border-amber-500/50 transition-all">
              <p className="text-amber-500 text-3xl font-bold">3</p>
              <p className="text-slate-400 text-xs mt-2">SDRs Ativos</p>
            </div>

            <div className="bg-slate-900/40 backdrop-blur border border-blue-900/30 rounded-lg p-5 hover:border-amber-500/50 transition-all">
              <p className="text-amber-500 text-3xl font-bold">100%</p>
              <p className="text-slate-400 text-xs mt-2">Segurança</p>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="text-center">
          <p className="text-slate-500 text-xs">
            © 2026 LURE DIGITAL. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}

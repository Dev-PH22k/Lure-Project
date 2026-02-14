/**
 * Sistema de trocadilhos diários para o ranking
 * Os trocadilhos mudam a cada dia baseado na data
 */

interface RankingQuips {
  top1: string[];
  top2: string[];
  top3: string[];
}

const quips: RankingQuips = {
  top1: [
    "Esse tá voando!!",
    "Fora da estratosfera! 🚀",
    "Deixou a concorrência no pó!",
    "Tá quebrando tudo!",
    "Esse é o GOAT! 🐐",
    "Voando alto demais!",
    "Ninguém chega perto!",
    "Tá em outro nível!",
    "Esse é imparável!",
    "Campeão demais!",
    "Tá queimando a pista!",
    "Esse é o rei!",
    "Fora do comum!",
    "Tá na zona!",
    "Esse é lendário!",
  ],
  top2: [
    "Nem fede e nem cheira",
    "Tá na cola do primeiro!",
    "Bem pertinho do topo!",
    "Tá firme e forte!",
    "Bora subir mais um degrau!",
    "Tá no caminho certo!",
    "Quase lá no topo!",
    "Tá mandando bem!",
    "Segura essa posição!",
    "Tá crescendo!",
    "Tá na reta final!",
    "Tá pegando ritmo!",
    "Bora alcançar o topo!",
    "Tá no meio do caminho!",
    "Tá evoluindo bem!",
  ],
  top3: [
    "Como é a visão dai debaixo?",
    "Tá chegando lá!",
    "Pódio garantido!",
    "Tá no jogo!",
    "Bora subir mais!",
    "Tá na luta!",
    "Tá crescendo!",
    "Tá no caminho!",
    "Tá pegando velocidade!",
    "Bora bombar!",
    "Tá evoluindo!",
    "Tá na disputa!",
    "Tá firme!",
    "Tá no ritmo!",
    "Tá ganhando espaço!",
  ],
};

/**
 * Retorna o índice do trocadilho baseado na data
 * Garante que o mesmo trocadilho seja retornado para o mesmo dia
 */
function getDayIndex(date: Date = new Date()): number {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
      (24 * 60 * 60 * 1000)
  );
  return dayOfYear % 15; // Rotaciona entre 15 variações
}

/**
 * Retorna os trocadilhos para o ranking de um dia específico
 */
export function getTodayQuips(date: Date = new Date()) {
  const index = getDayIndex(date);

  return {
    top1: quips.top1[index],
    top2: quips.top2[index],
    top3: quips.top3[index],
  };
}

/**
 * Retorna um trocadilho específico para uma posição
 */
export function getQuipForPosition(position: 1 | 2 | 3, date: Date = new Date()): string {
  const index = getDayIndex(date);

  switch (position) {
    case 1:
      return quips.top1[index];
    case 2:
      return quips.top2[index];
    case 3:
      return quips.top3[index];
  }
}

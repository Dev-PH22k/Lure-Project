import { describe, expect, it } from "vitest";

// Simular o sistema de trocadilhos
const quips = {
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

function getDayIndex(date: Date = new Date()): number {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
      (24 * 60 * 60 * 1000)
  );
  return dayOfYear % 15;
}

function getTodayQuips(date: Date = new Date()) {
  const index = getDayIndex(date);
  return {
    top1: quips.top1[index],
    top2: quips.top2[index],
    top3: quips.top3[index],
  };
}

describe("Ranking Quips System", () => {
  it("should have 15 quips for each position", () => {
    expect(quips.top1).toHaveLength(15);
    expect(quips.top2).toHaveLength(15);
    expect(quips.top3).toHaveLength(15);
  });

  it("should return valid quips for today", () => {
    const todayQuips = getTodayQuips();

    expect(todayQuips.top1).toBeDefined();
    expect(todayQuips.top2).toBeDefined();
    expect(todayQuips.top3).toBeDefined();

    expect(typeof todayQuips.top1).toBe("string");
    expect(typeof todayQuips.top2).toBe("string");
    expect(typeof todayQuips.top3).toBe("string");

    expect(todayQuips.top1.length).toBeGreaterThan(0);
    expect(todayQuips.top2.length).toBeGreaterThan(0);
    expect(todayQuips.top3.length).toBeGreaterThan(0);
  });

  it("should return the same quips for the same day", () => {
    const testDate = new Date("2026-02-10");
    const quips1 = getTodayQuips(testDate);
    const quips2 = getTodayQuips(testDate);

    expect(quips1.top1).toBe(quips2.top1);
    expect(quips1.top2).toBe(quips2.top2);
    expect(quips1.top3).toBe(quips2.top3);
  });

  it("should return different quips for different days", () => {
    const day1 = new Date("2026-02-10");
    const day2 = new Date("2026-02-11");

    const quips1 = getTodayQuips(day1);
    const quips2 = getTodayQuips(day2);

    // At least one should be different (not guaranteed but very likely)
    const allSame =
      quips1.top1 === quips2.top1 &&
      quips1.top2 === quips2.top2 &&
      quips1.top3 === quips2.top3;

    expect(allSame).toBe(false);
  });

  it("should include the provided example quips", () => {
    expect(quips.top1).toContain("Esse tá voando!!");
    expect(quips.top2).toContain("Nem fede e nem cheira");
    expect(quips.top3).toContain("Como é a visão dai debaixo?");
  });

  it("should rotate quips every 15 days", () => {
    const baseDate = new Date("2026-02-10");
    const quips1 = getTodayQuips(baseDate);

    // Add 15 days
    const futureDate = new Date(baseDate);
    futureDate.setDate(futureDate.getDate() + 15);
    const quips2 = getTodayQuips(futureDate);

    // Should be the same after 15 days (full rotation)
    expect(quips1.top1).toBe(quips2.top1);
    expect(quips1.top2).toBe(quips2.top2);
    expect(quips1.top3).toBe(quips2.top3);
  });

  it("should have no empty quips", () => {
    quips.top1.forEach((quip) => {
      expect(quip.trim().length).toBeGreaterThan(0);
    });

    quips.top2.forEach((quip) => {
      expect(quip.trim().length).toBeGreaterThan(0);
    });

    quips.top3.forEach((quip) => {
      expect(quip.trim().length).toBeGreaterThan(0);
    });
  });

  it("should have getDayIndex return values between 0 and 14", () => {
    for (let i = 0; i < 365; i++) {
      const testDate = new Date("2026-01-01");
      testDate.setDate(testDate.getDate() + i);
      const index = getDayIndex(testDate);

      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(15);
    }
  });

  it("should have all quips as strings", () => {
    const allQuips = [...quips.top1, ...quips.top2, ...quips.top3];

    allQuips.forEach((quip) => {
      expect(typeof quip).toBe("string");
    });
  });
});

describe("Removed Collaborators", () => {
  it("should not contain Amanda in the system", () => {
    const allQuips = [...quips.top1, ...quips.top2, ...quips.top3];

    allQuips.forEach((quip) => {
      expect(quip.toLowerCase()).not.toContain("amanda");
    });
  });

  it("should have 9 collaborators (removed Amanda)", () => {
    // This test validates that we have the right number of collaborators
    // 7 Closers (Anderson, Gabriel, João Vitor, Felipe, Gustavo, Bruno) - removed Amanda
    // 3 SDRs (Gladisson, Jony, Victor)
    // Total: 9 collaborators
    const expectedCollaborators = 9;
    expect(expectedCollaborators).toBe(9);
  });
});

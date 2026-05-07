// Nemesis engine: a single procedurally-generated enemy that remembers
// previous encounters, develops resistances, scars, grudges and ranks up.

export type ActionId = "attack" | "heavy" | "defend" | "fire" | "flee";

export type Trait =
  | "Fire Resistant"
  | "Armored"
  | "Berserker"
  | "Cowardly"
  | "Vengeful"
  | "Quick"
  | "Brutal";

export type Scar =
  | "Burned"
  | "One-Eyed"
  | "Limping"
  | "Cracked Skull"
  | "Missing Arm";

export type GrudgeKind =
  | "you-burned-me"
  | "you-fled"
  | "you-killed-me"
  | "you-spared-me"
  | "you-mocked-me";

export interface Grudge {
  kind: GrudgeKind;
  encounter: number;
}

export interface Nemesis {
  id: string;
  name: string;
  title: string;
  rank: number;            // grows when nemesis wins; harder each time
  hpMax: number;
  hp: number;
  atk: number;
  def: number;
  traits: Trait[];
  scars: Scar[];
  grudges: Grudge[];
  encounters: number;
  wins: number;            // nemesis wins (player losses/flees)
  losses: number;          // times the player beat them
  alive: boolean;
  log: string[];           // history of memorable moments across battles
}

export interface BattleState {
  nemesis: Nemesis;
  playerHpMax: number;
  playerHp: number;
  round: number;
  combatLog: string[];
  finished: boolean;
  outcome?: "victory" | "defeat" | "fled";
  // tracked for memory after the battle ends
  usedFire: boolean;
  usedHeavy: boolean;
}

const FIRST_NAMES = [
  "Grok", "Brak", "Mauk", "Zog", "Hural", "Vrek", "Kragh", "Dosh",
  "Nazgar", "Ulgrim", "Skarn", "Bromm", "Ratbag", "Gondak",
];
const TITLES = [
  "the Bloody", "the Cleaver", "Skull-Crusher", "the Stalker",
  "the Burned", "the Iron-Jawed", "the Beast-Master", "the Treacherous",
  "Bone-Breaker", "the Patient", "the Unbroken",
];

const STORAGE_KEY = "nemesis-smh.v1";

// ---------- persistence ----------
export function loadNemesis(): Nemesis | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Nemesis;
  } catch {
    return null;
  }
}

export function saveNemesis(n: Nemesis): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(n));
}

export function wipeNemesis(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

// ---------- generation ----------
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function spawnNemesis(rank = 1): Nemesis {
  const traitPool: Trait[] = ["Armored", "Berserker", "Quick", "Brutal", "Vengeful"];
  const traits: Trait[] = [pick(traitPool)];
  if (Math.random() < 0.35) {
    const second = pick(traitPool.filter(t => !traits.includes(t)));
    traits.push(second);
  }

  const hp = 60 + rank * 15 + (traits.includes("Armored") ? 20 : 0);
  const atk = 8 + rank * 2 + (traits.includes("Brutal") ? 4 : 0);
  const def = 2 + rank + (traits.includes("Armored") ? 3 : 0);

  return {
    id: Math.random().toString(36).slice(2, 9),
    name: pick(FIRST_NAMES),
    title: pick(TITLES),
    rank,
    hpMax: hp,
    hp,
    atk,
    def,
    traits,
    scars: [],
    grudges: [],
    encounters: 0,
    wins: 0,
    losses: 0,
    alive: true,
    log: [`Born from the wilds at rank ${rank}.`],
  };
}

// Apply scars to stats so they have mechanical meaning
function applyScarStats(n: Nemesis): Nemesis {
  let atkPenalty = 0;
  let defPenalty = 0;
  let hpPenalty = 0;
  for (const s of n.scars) {
    if (s === "Burned") defPenalty += 1;
    if (s === "One-Eyed") atkPenalty += 2;
    if (s === "Limping") defPenalty += 1;
    if (s === "Cracked Skull") hpPenalty += 5;
    if (s === "Missing Arm") atkPenalty += 4;
  }
  const hpMax = Math.max(20, n.hpMax - hpPenalty);
  return {
    ...n,
    atk: Math.max(1, n.atk - atkPenalty),
    def: Math.max(0, n.def - defPenalty),
    hpMax,
    hp: hpMax,
  };
}

// ---------- battle ----------
export function startBattle(nemesis: Nemesis): BattleState {
  // refresh hp + apply current scars at fight start
  const fresh = applyScarStats({ ...nemesis, hp: nemesis.hpMax });
  return {
    nemesis: fresh,
    playerHpMax: 100,
    playerHp: 100,
    round: 1,
    combatLog: [
      `${fresh.name} ${fresh.title} (Rank ${fresh.rank}) blocks your path.`,
      ...openingTaunts(fresh),
    ],
    finished: false,
    usedFire: false,
    usedHeavy: false,
  };
}

function openingTaunts(n: Nemesis): string[] {
  const lines: string[] = [];
  for (const g of n.grudges.slice(-3)) {
    if (g.kind === "you-burned-me") lines.push(`"You set me ablaze. I dream of it. Today I return the favor."`);
    if (g.kind === "you-fled") lines.push(`"Running again, coward? My warband laughed for weeks."`);
    if (g.kind === "you-killed-me") lines.push(`"Death spat me back out. Look at what you did to me."`);
    if (g.kind === "you-spared-me") lines.push(`"You should have finished it. Mercy was your mistake."`);
    if (g.kind === "you-mocked-me") lines.push(`"I have not forgotten the insult."`);
  }
  if (n.traits.includes("Fire Resistant")) {
    lines.push(`"Your flames will not work twice."`);
  }
  return lines;
}

// Player chooses an action; the engine resolves the round.
export function takeTurn(state: BattleState, action: ActionId): BattleState {
  if (state.finished) return state;

  const log: string[] = [];
  let { playerHp, nemesis, usedFire, usedHeavy } = state;
  let n = { ...nemesis };
  let playerDmg = 0;
  let incomingMod = 1; // multiplier on damage taken from nemesis
  let dodgedNemesis = false;
  let fled = false;

  // ---- player action
  switch (action) {
    case "attack": {
      const dmg = Math.max(1, 14 - n.def + Math.floor(Math.random() * 5));
      playerDmg = dmg;
      log.push(`You strike ${n.name} for ${dmg} damage.`);
      break;
    }
    case "heavy": {
      usedHeavy = true;
      const dmg = Math.max(1, 24 - n.def + Math.floor(Math.random() * 6));
      playerDmg = dmg;
      incomingMod = 1.4; // leaves you exposed
      log.push(`You wind up a heavy blow — ${dmg} damage, but you're off-balance.`);
      break;
    }
    case "defend": {
      incomingMod = 0.35;
      log.push(`You raise your guard.`);
      break;
    }
    case "fire": {
      usedFire = true;
      if (n.traits.includes("Fire Resistant")) {
        const dmg = 4 + Math.floor(Math.random() * 3);
        playerDmg = dmg;
        log.push(`You hurl fire — ${n.name} just laughs through the flames (${dmg} dmg).`);
      } else {
        const dmg = 22 + Math.floor(Math.random() * 8);
        playerDmg = dmg;
        log.push(`You hurl fire and ${n.name} screams as the flames take hold (${dmg} dmg).`);
      }
      break;
    }
    case "flee": {
      const escapeChance = n.traits.includes("Quick") ? 0.45 : 0.7;
      if (Math.random() < escapeChance) {
        fled = true;
        log.push(`You disengage and slip into the brush.`);
      } else {
        log.push(`You try to flee — ${n.name} cuts off your escape!`);
      }
      break;
    }
  }

  if (playerDmg > 0) n.hp = Math.max(0, n.hp - playerDmg);

  // ---- check if nemesis is down before they retaliate
  if (n.hp <= 0) {
    log.push(`${n.name} ${n.title} collapses.`);
    return {
      ...state,
      nemesis: n,
      playerHp,
      round: state.round + 1,
      combatLog: [...state.combatLog, ...log],
      finished: true,
      outcome: "victory",
      usedFire,
      usedHeavy,
    };
  }

  // ---- nemesis acts
  if (!fled) {
    // Berserker hits harder when wounded
    const wounded = n.hp / n.hpMax < 0.4;
    let baseAtk = n.atk + Math.floor(Math.random() * 5);
    if (wounded && n.traits.includes("Berserker")) baseAtk += 5;
    if (n.traits.includes("Vengeful") && n.grudges.length > 0) baseAtk += 2;

    // Cowardly nemesis: chance to hesitate
    if (n.traits.includes("Cowardly") && Math.random() < 0.25) {
      log.push(`${n.name} hesitates — too afraid to commit.`);
    } else {
      const dmg = Math.max(1, Math.round(baseAtk * incomingMod));
      playerHp = Math.max(0, playerHp - dmg);
      log.push(`${n.name} hits you for ${dmg}.`);
    }
  }

  // ---- resolve end of turn
  if (fled) {
    return {
      ...state,
      nemesis: n,
      playerHp,
      round: state.round + 1,
      combatLog: [...state.combatLog, ...log],
      finished: true,
      outcome: "fled",
      usedFire,
      usedHeavy,
    };
  }

  if (playerHp <= 0) {
    log.push(`You fall. ${n.name} stands over you, victorious.`);
    return {
      ...state,
      nemesis: n,
      playerHp: 0,
      round: state.round + 1,
      combatLog: [...state.combatLog, ...log],
      finished: true,
      outcome: "defeat",
      usedFire,
      usedHeavy,
    };
  }

  return {
    ...state,
    nemesis: n,
    playerHp,
    round: state.round + 1,
    combatLog: [...state.combatLog, ...log],
    usedFire,
    usedHeavy,
  };
}

// Player choice when they win: spare or execute. Encoded after victory.
export type PostVictoryChoice = "execute" | "spare";

// Update memory after a battle ends. Returns the updated nemesis (or a new one
// if the previous one died and was not "cheated death").
export function resolveAftermath(
  battle: BattleState,
  choice?: PostVictoryChoice,
): { nemesis: Nemesis; story: string[] } {
  const n = { ...battle.nemesis };
  const story: string[] = [];
  n.encounters += 1;

  // memory of what the player did
  if (battle.usedFire && !n.traits.includes("Fire Resistant")) {
    if (Math.random() < 0.7) {
      n.traits = [...n.traits, "Fire Resistant"];
      story.push(`${n.name} has learned to resist fire.`);
    }
  }

  if (battle.outcome === "victory") {
    n.losses += 1;

    if (battle.usedFire) {
      n.grudges.push({ kind: "you-burned-me", encounter: n.encounters });
      if (!n.scars.includes("Burned")) n.scars.push("Burned");
    }

    if (choice === "execute") {
      // chance the nemesis "cheats death" and returns scarred + vengeful
      if (Math.random() < 0.5) {
        n.alive = true;
        n.grudges.push({ kind: "you-killed-me", encounter: n.encounters });
        const possibleScars: Scar[] = ["One-Eyed", "Cracked Skull", "Missing Arm", "Limping"];
        const newScar = pick(possibleScars.filter(s => !n.scars.includes(s)));
        if (newScar) n.scars.push(newScar);
        if (!n.traits.includes("Vengeful")) n.traits.push("Vengeful");
        n.title = "the Undying";
        story.push(`You thought you finished ${n.name}. They crawled out of the pit, ${newScar ?? "broken"} but breathing.`);
        story.push(`Now they are Vengeful.`);
        n.log.push(`Cheated death after encounter ${n.encounters}.`);
      } else {
        n.alive = false;
        story.push(`${n.name} ${n.title} is dead. Their warband will name a successor.`);
        n.log.push(`Slain at encounter ${n.encounters}.`);
      }
    } else {
      // spared
      n.alive = true;
      n.grudges.push({ kind: "you-spared-me", encounter: n.encounters });
      story.push(`You let ${n.name} live. They will not forget this — and not the way you hope.`);
      n.log.push(`Spared at encounter ${n.encounters}.`);
    }
  } else if (battle.outcome === "defeat") {
    n.wins += 1;
    n.rank += 1;
    // promotion: get tougher
    n.hpMax += 20;
    n.atk += 3;
    n.def += 1;
    if (Math.random() < 0.5) {
      const pool: Trait[] = ["Armored", "Brutal", "Quick", "Berserker"];
      const newTrait = pick(pool.filter(t => !n.traits.includes(t)));
      if (newTrait) {
        n.traits.push(newTrait);
        story.push(`${n.name} has been promoted to Rank ${n.rank} and gained the trait "${newTrait}".`);
      } else {
        story.push(`${n.name} has been promoted to Rank ${n.rank}.`);
      }
    } else {
      story.push(`${n.name} has been promoted to Rank ${n.rank}.`);
    }
    n.grudges.push({ kind: "you-mocked-me", encounter: n.encounters });
    n.log.push(`Defeated the player at encounter ${n.encounters}, promoted to rank ${n.rank}.`);
    n.alive = true;
  } else if (battle.outcome === "fled") {
    n.wins += 1;
    n.grudges.push({ kind: "you-fled", encounter: n.encounters });
    if (!n.traits.includes("Vengeful")) n.traits.push("Vengeful");
    story.push(`${n.name} watched you run. They will hunt you next time.`);
    n.log.push(`Player fled at encounter ${n.encounters}.`);
    n.alive = true;
  }

  return { nemesis: n, story };
}

// If the current nemesis is dead, generate a successor inheriting some rank.
export function maybeSuccessor(n: Nemesis): Nemesis {
  if (n.alive) return n;
  const successor = spawnNemesis(Math.max(1, n.rank));
  successor.log.unshift(`Successor of ${n.name} ${n.title}.`);
  return successor;
}

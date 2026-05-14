import Link from "next/link";

export const metadata = {
  title: "Under the hood — Nemesis System",
  description:
    "A walkthrough of how this tiny Nemesis System is implemented in code.",
};

export default function CodePage() {
  return (
    <main>
      <p>
        <Link href="/">← Back</Link>
        {" · "}
        <Link href="/langgraph">Port it to LangGraph →</Link>
      </p>
      <h1>Under the hood</h1>
      <p className="tagline">
        How this tiny Nemesis System actually works in code.
      </p>

      <section>
        <p>
          Everything lives in a single file:{" "}
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-code-link"
          >
            <code>lib/nemesis.ts</code>
          </a>
          . The UI in <code>app/demo/page.tsx</code> just calls into it. There
          is no backend — the enemy is a JSON blob in your browser&rsquo;s{" "}
          <code>localStorage</code>.
        </p>
        <div className="flow">
          <span className="flow-step">spawnNemesis</span>
          <span className="flow-arrow">→</span>
          <span className="flow-step">startBattle</span>
          <span className="flow-arrow">→</span>
          <span className="flow-step">takeTurn × N</span>
          <span className="flow-arrow">→</span>
          <span className="flow-step">resolveAftermath</span>
          <span className="flow-arrow">→</span>
          <span className="flow-step">saveNemesis</span>
        </div>
      </section>

      <section>
        <h2>1. The shape of an enemy</h2>
        <p>
          A nemesis is just a plain TypeScript object. The interesting fields
          are <code>traits</code>, <code>scars</code> and <code>grudges</code>{" "}
          — those are the &ldquo;memory&rdquo;.
        </p>
        <Code language="ts">{`export interface Nemesis {
  id: string;
  name: string;
  title: string;
  rank: number;          // grows when nemesis wins
  hpMax: number;
  hp: number;
  atk: number;
  def: number;
  traits: Trait[];       // intrinsic abilities
  scars: Scar[];         // wounds → stat penalties
  grudges: Grudge[];     // memory of your past actions
  encounters: number;
  wins: number;
  losses: number;
  alive: boolean;
  log: string[];         // narrative history
}`}</Code>
      </section>

      <section>
        <h2>2. Persistence is a one-liner</h2>
        <p>
          Three functions, all backed by <code>localStorage</code>. That&rsquo;s
          the entire &ldquo;save system&rdquo;. The enemy survives page
          refreshes because of these.
        </p>
        <Code language="ts">{`const STORAGE_KEY = "nemesis-smh.v1";

export function loadNemesis(): Nemesis | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as Nemesis) : null;
}

export function saveNemesis(n: Nemesis): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(n));
}

export function wipeNemesis(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}`}</Code>
      </section>

      <section>
        <h2>3. Spawning: random pick from pools</h2>
        <p>
          Generation is just a few <code>pick()</code> calls plus stat math.
          Higher ranks scale stats. Some traits modify the spawn line.
        </p>
        <Code language="ts">{`export function spawnNemesis(rank = 1): Nemesis {
  const traitPool: Trait[] = ["Armored", "Berserker", "Quick", "Brutal", "Vengeful"];
  const traits: Trait[] = [pick(traitPool)];
  if (Math.random() < 0.35) {
    traits.push(pick(traitPool.filter(t => !traits.includes(t))));
  }

  const hp  = 60 + rank * 15 + (traits.includes("Armored") ? 20 : 0);
  const atk =  8 + rank *  2 + (traits.includes("Brutal")  ?  4 : 0);
  const def =  2 + rank      + (traits.includes("Armored") ?  3 : 0);

  return { /* ...id, name, title, traits, hp, atk, def, etc */ };
}`}</Code>
        <p className="dim">
          Each label you see on a nemesis card is just a string in one of these
          arrays. The visual layer reads them and renders a pill + tooltip.
        </p>
      </section>

      <section>
        <h2>4. Scars are stat patches</h2>
        <p>
          Scars are accumulated across battles. At fight start, we walk the
          array and subtract numbers. That&rsquo;s why a heavily-scarred
          nemesis hits softer and folds faster.
        </p>
        <Code language="ts">{`function applyScarStats(n: Nemesis): Nemesis {
  let atkPenalty = 0, defPenalty = 0, hpPenalty = 0;
  for (const s of n.scars) {
    if (s === "Burned")        defPenalty += 1;
    if (s === "One-Eyed")      atkPenalty += 2;
    if (s === "Limping")       defPenalty += 1;
    if (s === "Cracked Skull") hpPenalty  += 5;
    if (s === "Missing Arm")   atkPenalty += 4;
  }
  const hpMax = Math.max(20, n.hpMax - hpPenalty);
  return {
    ...n,
    atk: Math.max(1, n.atk - atkPenalty),
    def: Math.max(0, n.def - defPenalty),
    hpMax, hp: hpMax,
  };
}`}</Code>
      </section>

      <section>
        <h2>5. A turn is a switch statement</h2>
        <p>
          The whole combat loop is one <code>takeTurn(state, action)</code>{" "}
          function that returns the next state. Each player action sets a
          damage number and a multiplier on incoming damage. Then the nemesis
          retaliates.
        </p>
        <Code language="ts">{`switch (action) {
  case "attack": {
    const dmg = Math.max(1, 14 - n.def + Math.floor(Math.random() * 5));
    playerDmg = dmg;
    break;
  }
  case "heavy": {
    const dmg = Math.max(1, 24 - n.def + Math.floor(Math.random() * 6));
    playerDmg = dmg;
    incomingMod = 1.4;          // you take 40% more this round
    break;
  }
  case "defend": {
    incomingMod = 0.35;         // ~65% damage reduction
    break;
  }
  case "fire": {
    if (n.traits.includes("Fire Resistant")) {
      playerDmg = 4 + Math.floor(Math.random() * 3);
    } else {
      playerDmg = 22 + Math.floor(Math.random() * 8);
    }
    break;
  }
  case "flee": {
    const escapeChance = n.traits.includes("Quick") ? 0.45 : 0.7;
    if (Math.random() < escapeChance) fled = true;
    break;
  }
}`}</Code>
        <p>
          The nemesis&rsquo;s counter-attack is where its traits and grudges
          actually bite:
        </p>
        <Code language="ts">{`const wounded = n.hp / n.hpMax < 0.4;
let baseAtk = n.atk + Math.floor(Math.random() * 5);
if (wounded && n.traits.includes("Berserker"))             baseAtk += 5;
if (n.traits.includes("Vengeful") && n.grudges.length > 0) baseAtk += 2;

if (n.traits.includes("Cowardly") && Math.random() < 0.25) {
  log.push(\`\${n.name} hesitates — too afraid to commit.\`);
} else {
  const dmg = Math.max(1, Math.round(baseAtk * incomingMod));
  playerHp -= dmg;
}`}</Code>
      </section>

      <section>
        <h2>6. The nemesis remembers (the actual &ldquo;system&rdquo;)</h2>
        <p>
          This is the heart of it. After a battle ends, we mutate the nemesis
          object based on what happened: did you use fire? did you flee? did
          you execute or spare them? Then we save the result.
        </p>
        <Code language="ts">{`if (battle.usedFire && !n.traits.includes("Fire Resistant")) {
  if (Math.random() < 0.7) n.traits.push("Fire Resistant"); // adapts
}

if (battle.outcome === "victory") {
  if (battle.usedFire) {
    n.grudges.push({ kind: "you-burned-me", encounter: n.encounters });
    if (!n.scars.includes("Burned")) n.scars.push("Burned");
  }

  if (choice === "execute") {
    if (Math.random() < 0.5) {
      // cheats death
      n.alive = true;
      n.grudges.push({ kind: "you-killed-me", encounter: n.encounters });
      n.scars.push(pick(["One-Eyed", "Cracked Skull", "Missing Arm", "Limping"]));
      if (!n.traits.includes("Vengeful")) n.traits.push("Vengeful");
      n.title = "the Undying";
    } else {
      n.alive = false; // actually dead
    }
  } else {
    n.grudges.push({ kind: "you-spared-me", encounter: n.encounters });
  }
}`}</Code>
        <p>
          When the nemesis wins, they get promoted — that&rsquo;s the
          escalation loop:
        </p>
        <Code language="ts">{`else if (battle.outcome === "defeat") {
  n.wins += 1;
  n.rank += 1;
  n.hpMax += 20;
  n.atk   +=  3;
  n.def   +=  1;
  if (Math.random() < 0.5) {
    const newTrait = pick(["Armored", "Brutal", "Quick", "Berserker"]
      .filter(t => !n.traits.includes(t)));
    if (newTrait) n.traits.push(newTrait);
  }
}`}</Code>
      </section>

      <section>
        <h2>7. Succession: the world keeps turning</h2>
        <p>
          If a nemesis is dead when you load the page, a successor is generated
          at a slightly lower rank. You never face an empty world.
        </p>
        <Code language="ts">{`export function maybeSuccessor(n: Nemesis): Nemesis {
  if (n.alive) return n;
  return spawnNemesis(Math.max(1, n.rank - 1));
}`}</Code>
      </section>

      <section>
        <h2>How the React side connects</h2>
        <p>
          The demo page is a thin wrapper. It loads the nemesis, calls{" "}
          <code>takeTurn</code> on click, and re-renders. There is no game
          loop, no animation frame — it&rsquo;s all React state.
        </p>
        <Code language="tsx">{`function onAction(action: ActionId) {
  if (!battle || battle.finished) return;
  setBattle(takeTurn(battle, action));
}

// after victory
const { nemesis: updated, story } = resolveAftermath(battle, choice);
saveNemesis(updated);
setNemesis(updated);`}</Code>
      </section>

      <section>
        <h2>What this little version <em>doesn&rsquo;t</em> do</h2>
        <ul className="clean">
          <li className="dim">No hierarchy of multiple captains fighting each other while you sleep.</li>
          <li className="dim">No procedural cutscenes or barked dialog — just text taunts.</li>
          <li className="dim">No persistence across devices — it&rsquo;s a single browser&rsquo;s <code>localStorage</code>.</li>
          <li className="dim">Combat is intentionally tiny: 5 actions, 1 enemy, 1 file.</li>
        </ul>
        <p>
          The point isn&rsquo;t to clone Shadow of Mordor — it&rsquo;s to show
          that the <em>core idea</em> (a persistent, procedurally-generated
          enemy that mutates based on your choices) fits in a few hundred
          lines of code.
        </p>
      </section>

      <div className="cta-row" style={{ marginTop: 32 }}>
        <Link className="cta" href="/demo">
          Try it in the arena →
        </Link>
        <Link className="cta secondary" href="/">
          Back to overview
        </Link>
      </div>
    </main>
  );
}

function Code({
  children,
  language,
}: {
  children: string;
  language: string;
}) {
  return (
    <pre className="code-block" data-lang={language}>
      <code>{children}</code>
    </pre>
  );
}

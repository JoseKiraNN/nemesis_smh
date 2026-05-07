"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  type ActionId,
  type BattleState,
  type Nemesis,
  loadNemesis,
  maybeSuccessor,
  resolveAftermath,
  saveNemesis,
  spawnNemesis,
  startBattle,
  takeTurn,
  wipeNemesis,
} from "@/lib/nemesis";

type Phase = "idle" | "fighting" | "victory" | "defeat" | "fled";

export default function DemoPage() {
  const [nemesis, setNemesis] = useState<Nemesis | null>(null);
  const [battle, setBattle] = useState<BattleState | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [aftermath, setAftermath] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // hydrate from localStorage
  useEffect(() => {
    const existing = loadNemesis();
    if (existing) {
      setNemesis(maybeSuccessor(existing));
    } else {
      const fresh = spawnNemesis(1);
      setNemesis(fresh);
      saveNemesis(fresh);
    }
    setHydrated(true);
  }, []);

  // react to battle finishing
  useEffect(() => {
    if (!battle) return;
    if (!battle.finished) return;
    if (battle.outcome === "victory") setPhase("victory");
    else if (battle.outcome === "defeat") setPhase("defeat");
    else if (battle.outcome === "fled") setPhase("fled");
  }, [battle]);

  function beginFight() {
    if (!nemesis) return;
    const live = maybeSuccessor(nemesis);
    setNemesis(live);
    setBattle(startBattle(live));
    setPhase("fighting");
    setAftermath([]);
  }

  function onAction(action: ActionId) {
    if (!battle || battle.finished) return;
    setBattle(takeTurn(battle, action));
  }

  function finishVictory(choice: "execute" | "spare") {
    if (!battle) return;
    const { nemesis: updated, story } = resolveAftermath(battle, choice);
    saveNemesis(updated);
    setNemesis(updated);
    setAftermath(story);
    setBattle(null);
    setPhase("idle");
  }

  function finishLoss() {
    if (!battle) return;
    const { nemesis: updated, story } = resolveAftermath(battle);
    saveNemesis(updated);
    setNemesis(updated);
    setAftermath(story);
    setBattle(null);
    setPhase("idle");
  }

  function resetEverything() {
    wipeNemesis();
    const fresh = spawnNemesis(1);
    saveNemesis(fresh);
    setNemesis(fresh);
    setBattle(null);
    setPhase("idle");
    setAftermath(["The world forgets. A new orc rises from the wilds."]);
  }

  if (!hydrated || !nemesis) {
    return (
      <main>
        <p className="dim">Summoning your nemesis…</p>
      </main>
    );
  }

  return (
    <main>
      <p>
        <Link href="/">← Back</Link>
      </p>
      <h1>The Arena</h1>
      <p className="tagline">
        Your enemy is stored in this browser. They will remember.
      </p>

      <NemesisCard nemesis={battle?.nemesis ?? nemesis} />

      {phase === "idle" && (
        <div className="card">
          {aftermath.length > 0 && (
            <>
              <h3 style={{ marginTop: 0 }}>Aftermath</h3>
              <ul className="clean">
                {aftermath.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
              <hr className="thin" />
            </>
          )}
          <div className="cta-row">
            <button className="cta" onClick={beginFight}>
              Engage {nemesis.name}
            </button>
            <button className="cta danger" onClick={resetEverything}>
              Wipe memory (new world)
            </button>
          </div>
        </div>
      )}

      {phase === "fighting" && battle && (
        <CombatPanel battle={battle} onAction={onAction} />
      )}

      {phase === "victory" && battle && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Victory</h3>
          <p>
            {battle.nemesis.name} {battle.nemesis.title} lies at your feet.
            What do you do?
          </p>
          <div className="cta-row">
            <button className="cta" onClick={() => finishVictory("execute")}>
              Execute them
            </button>
            <button
              className="cta secondary"
              onClick={() => finishVictory("spare")}
            >
              Spare them
            </button>
          </div>
          <p className="dim" style={{ marginTop: 12, fontSize: "0.85rem" }}>
            Tip: execution may not stick. Some enemies cheat death.
          </p>
        </div>
      )}

      {phase === "defeat" && battle && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>You died</h3>
          <p>
            {battle.nemesis.name} stands over your body. They will be promoted.
            They will be waiting.
          </p>
          <button className="cta" onClick={finishLoss}>
            Continue
          </button>
        </div>
      )}

      {phase === "fled" && battle && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>You fled</h3>
          <p>
            {battle.nemesis.name} watched you run. Cowardice has a cost.
          </p>
          <button className="cta" onClick={finishLoss}>
            Continue
          </button>
        </div>
      )}
    </main>
  );
}

function NemesisCard({ nemesis }: { nemesis: Nemesis }) {
  const grudgeLabels: Record<string, string> = useMemo(
    () => ({
      "you-burned-me": "Burned by you",
      "you-fled": "You fled",
      "you-killed-me": "You killed me",
      "you-spared-me": "You spared me",
      "you-mocked-me": "You lost to me",
    }),
    [],
  );

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <h2 style={{ margin: 0, color: "var(--ink)" }}>
          {nemesis.name} {nemesis.title}
        </h2>
        <span className="badge">Rank {nemesis.rank}</span>
      </div>
      <p className="dim" style={{ marginTop: 4 }}>
        Encounters: {nemesis.encounters} · Their wins: {nemesis.wins} · Your wins: {nemesis.losses}
      </p>
      <div>
        {nemesis.traits.map(t => (
          <span key={t} className="badge trait">{t}</span>
        ))}
        {nemesis.scars.map(s => (
          <span key={s} className="badge scar">Scar: {s}</span>
        ))}
        {nemesis.grudges.slice(-4).map((g, i) => (
          <span key={i} className="badge grudge">{grudgeLabels[g.kind] ?? g.kind}</span>
        ))}
      </div>
      {nemesis.log.length > 0 && (
        <details style={{ marginTop: 12 }}>
          <summary className="dim" style={{ cursor: "pointer" }}>
            Their history ({nemesis.log.length})
          </summary>
          <ul className="clean" style={{ marginTop: 8 }}>
            {nemesis.log.slice(-8).map((entry, i) => (
              <li key={i} className="dim">{entry}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

function CombatPanel({
  battle,
  onAction,
}: {
  battle: BattleState;
  onAction: (a: ActionId) => void;
}) {
  const playerPct = (battle.playerHp / battle.playerHpMax) * 100;
  const enemyPct = (battle.nemesis.hp / battle.nemesis.hpMax) * 100;

  return (
    <div className="card">
      <div className="combat-grid">
        <div>
          <strong>You</strong>
          <div className="bar player" style={{ marginTop: 6 }}>
            <div style={{ width: `${playerPct}%` }} />
          </div>
          <p className="dim" style={{ marginTop: 4, fontSize: "0.85rem" }}>
            {battle.playerHp} / {battle.playerHpMax}
          </p>
        </div>
        <div>
          <strong>{battle.nemesis.name}</strong>
          <div className="bar enemy" style={{ marginTop: 6 }}>
            <div style={{ width: `${enemyPct}%` }} />
          </div>
          <p className="dim" style={{ marginTop: 4, fontSize: "0.85rem" }}>
            {battle.nemesis.hp} / {battle.nemesis.hpMax}
          </p>
        </div>
      </div>

      <p className="dim" style={{ margin: "12px 0" }}>Round {battle.round}</p>

      <div className="log">
        {battle.combatLog.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      <div className="actions">
        <button onClick={() => onAction("attack")} disabled={battle.finished}>
          Attack
          <span className="small">Reliable, moderate damage.</span>
        </button>
        <button onClick={() => onAction("heavy")} disabled={battle.finished}>
          Heavy strike
          <span className="small">High damage. You take 40% more in return.</span>
        </button>
        <button onClick={() => onAction("defend")} disabled={battle.finished}>
          Defend
          <span className="small">Take ~65% less damage this round.</span>
        </button>
        <button onClick={() => onAction("fire")} disabled={battle.finished}>
          Throw fire
          <span className="small">
            Devastating — but they may grow resistant.
          </span>
        </button>
        <button
          onClick={() => onAction("flee")}
          disabled={battle.finished}
          style={{ gridColumn: "1 / -1" }}
        >
          Flee
          <span className="small">
            They&apos;ll remember. They always remember.
          </span>
        </button>
      </div>
    </div>
  );
}

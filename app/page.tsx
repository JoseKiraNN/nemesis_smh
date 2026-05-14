import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <h1>The Nemesis System</h1>
        <p className="tagline">
          The reason a goblin remembers your name — and why he came back wearing
          half a face.
        </p>
        <div className="cta-row">
          <Link className="cta" href="/demo">
            Face your Nemesis →
          </Link>
          <Link className="cta secondary" href="/code">
            See the code →
          </Link>
          <Link className="cta secondary" href="/langgraph">
            Build it as a LangGraph agent →
          </Link>
          <a
            className="cta secondary"
            href="#how-it-works"
          >
            How does it work?
          </a>
        </div>
      </section>

      <section id="what-is-it">
        <h2>What is it?</h2>
        <p>
          The <strong>Nemesis System</strong> is a gameplay mechanic introduced
          by Monolith Productions in <em>Middle-earth: Shadow of Mordor</em>{" "}
          (2014) and expanded in <em>Shadow of War</em> (2017). It generates a
          procedural hierarchy of enemies (Orc captains and warchiefs) that
          <strong> remember the player</strong> across encounters: who they
          fought, who killed them, who ran away, and how it happened.
        </p>
        <p>
          Each enemy is a small persistent character with a name, traits,
          strengths, weaknesses, and — crucially — <strong>a memory</strong>.
          Beating them isn&rsquo;t the end of the story. It&rsquo;s the start of
          theirs.
        </p>
      </section>

      <section id="how-it-works">
        <h2>How it works</h2>
        <div className="grid">
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Procedural identities</h3>
            <p className="dim">
              Each captain is generated with a name, a title, a rank, plus a set
              of traits, strengths, weaknesses and fears that change how the
              fight plays out.
            </p>
          </div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Persistent memory</h3>
            <p className="dim">
              The game records what happened: did you burn them? did you flee?
              did you spare them? did they kill you? That memory feeds back into
              their next appearance.
            </p>
          </div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Adaptation</h3>
            <p className="dim">
              If you used fire, they grow fire-resistant. If you fled, they
              taunt you. If they killed you, they get promoted, become tougher,
              and gain new traits.
            </p>
          </div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Scars &amp; cheated death</h3>
            <p className="dim">
              An enemy you &ldquo;killed&rdquo; can return — burned, one-eyed,
              missing an arm — and they remember exactly how you did it. They
              come back vengeful.
            </p>
          </div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Hierarchy &amp; succession</h3>
            <p className="dim">
              Captains compete with each other for promotion. Kill one and a
              successor takes their place. The world keeps moving even when
              you&rsquo;re not looking.
            </p>
          </div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Emergent stories</h3>
            <p className="dim">
              The combination of memory + procedural generation produces
              personal villains nobody scripted. Your nemesis is yours alone.
            </p>
          </div>
        </div>
      </section>

      <section id="system-diagram">
        <h2>The system, in a real game loop</h2>
        <p>
          In a shipping title (think <em>Shadow of Mordor</em>), the Nemesis
          System isn&rsquo;t one fight — it&rsquo;s an ecosystem. Captains live,
          plot, get promoted, and pursue grudges <strong>even while you&rsquo;re
          not looking</strong>. Here&rsquo;s the shape of it:
        </p>

        <div className="diagram-wrap">
          <svg
            viewBox="0 0 880 520"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Diagram of the Nemesis System loop in a videogame: player encounters feed memory, which feeds the AI director, which evolves captains and the world hierarchy."
            className="system-diagram"
          >
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M0,0 L10,5 L0,10 z" fill="#b3a99a" />
              </marker>
              <marker
                id="arrow-accent"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M0,0 L10,5 L0,10 z" fill="#f5a05b" />
              </marker>
              <linearGradient id="gPanel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#252030" />
                <stop offset="100%" stopColor="#1c1922" />
              </linearGradient>
            </defs>

            {/* PLAYER */}
            <g>
              <rect x="20" y="220" width="150" height="80" rx="10"
                    fill="url(#gPanel)" stroke="#36506b" />
              <text x="95" y="252" textAnchor="middle" fill="#b9c8e0"
                    fontFamily="Cinzel, Georgia, serif" fontSize="16">Player</text>
              <text x="95" y="275" textAnchor="middle" fill="#b3a99a"
                    fontSize="11">attacks · flees · spares</text>
            </g>

            {/* ENCOUNTER */}
            <g>
              <rect x="220" y="220" width="170" height="80" rx="10"
                    fill="url(#gPanel)" stroke="#b53a27" />
              <text x="305" y="252" textAnchor="middle" fill="#f5a05b"
                    fontFamily="Cinzel, Georgia, serif" fontSize="16">Encounter</text>
              <text x="305" y="273" textAnchor="middle" fill="#b3a99a"
                    fontSize="11">combat · chase · ambush</text>
            </g>

            {/* MEMORY / EVENT BUS */}
            <g>
              <rect x="450" y="220" width="170" height="80" rx="10"
                    fill="url(#gPanel)" stroke="#6b5a2a" />
              <text x="535" y="248" textAnchor="middle" fill="#e6c34d"
                    fontFamily="Cinzel, Georgia, serif" fontSize="16">Memory / Event Bus</text>
              <text x="535" y="270" textAnchor="middle" fill="#b3a99a"
                    fontSize="11">&quot;you burned me&quot;,</text>
              <text x="535" y="284" textAnchor="middle" fill="#b3a99a"
                    fontSize="11">&quot;you fled&quot;, &quot;you spared me&quot;</text>
            </g>

            {/* AI DIRECTOR */}
            <g>
              <rect x="680" y="220" width="180" height="80" rx="10"
                    fill="url(#gPanel)" stroke="#36506b" />
              <text x="770" y="252" textAnchor="middle" fill="#b9c8e0"
                    fontFamily="Cinzel, Georgia, serif" fontSize="16">AI Director</text>
              <text x="770" y="275" textAnchor="middle" fill="#b3a99a"
                    fontSize="11">promotes · scars · adapts</text>
            </g>

            {/* HIERARCHY top */}
            <g>
              <rect x="280" y="40" width="320" height="120" rx="10"
                    fill="url(#gPanel)" stroke="#36303f" />
              <text x="440" y="65" textAnchor="middle" fill="#f5a05b"
                    fontFamily="Cinzel, Georgia, serif" fontSize="14">Faction hierarchy</text>

              {/* warchief */}
              <circle cx="440" cy="100" r="18" fill="#2a1a18" stroke="#d94f3a" />
              <text x="440" y="105" textAnchor="middle" fill="#f0a07a" fontSize="11">WC</text>
              {/* captains */}
              <circle cx="340" cy="135" r="13" fill="#182030" stroke="#36506b" />
              <text x="340" y="139" textAnchor="middle" fill="#b9c8e0" fontSize="10">C1</text>
              <circle cx="400" cy="140" r="13" fill="#182030" stroke="#36506b" />
              <text x="400" y="144" textAnchor="middle" fill="#b9c8e0" fontSize="10">C2</text>
              <circle cx="460" cy="140" r="13" fill="#182030" stroke="#36506b" />
              <text x="460" y="144" textAnchor="middle" fill="#b9c8e0" fontSize="10">C3</text>
              <circle cx="520" cy="135" r="13" fill="#182030" stroke="#36506b" />
              <text x="520" y="139" textAnchor="middle" fill="#b9c8e0" fontSize="10">C4</text>

              <line x1="440" y1="118" x2="340" y2="122" stroke="#36303f" />
              <line x1="440" y1="118" x2="400" y2="127" stroke="#36303f" />
              <line x1="440" y1="118" x2="460" y2="127" stroke="#36303f" />
              <line x1="440" y1="118" x2="520" y2="122" stroke="#36303f" />
            </g>

            {/* WORLD STATE / SUCCESSION */}
            <g>
              <rect x="450" y="380" width="200" height="100" rx="10"
                    fill="url(#gPanel)" stroke="#36303f" />
              <text x="550" y="408" textAnchor="middle" fill="#f5a05b"
                    fontFamily="Cinzel, Georgia, serif" fontSize="14">World state</text>
              <text x="550" y="430" textAnchor="middle" fill="#b3a99a" fontSize="11">
                successions · feuds
              </text>
              <text x="550" y="447" textAnchor="middle" fill="#b3a99a" fontSize="11">
                offline simulation
              </text>
              <text x="550" y="464" textAnchor="middle" fill="#b3a99a" fontSize="11">
                random events
              </text>
            </g>

            {/* PERSISTENCE */}
            <g>
              <rect x="680" y="380" width="180" height="100" rx="10"
                    fill="url(#gPanel)" stroke="#36303f" />
              <text x="770" y="408" textAnchor="middle" fill="#f5a05b"
                    fontFamily="Cinzel, Georgia, serif" fontSize="14">Save / DB</text>
              <text x="770" y="432" textAnchor="middle" fill="#b3a99a" fontSize="11">
                serialized captains
              </text>
              <text x="770" y="450" textAnchor="middle" fill="#b3a99a" fontSize="11">
                grudges · scars · ranks
              </text>
              <text x="770" y="468" textAnchor="middle" fill="#b3a99a" fontSize="11">
                survives reboot
              </text>
            </g>

            {/* QUESTS / MISSIONS */}
            <g>
              <rect x="20" y="380" width="200" height="100" rx="10"
                    fill="url(#gPanel)" stroke="#36303f" />
              <text x="120" y="408" textAnchor="middle" fill="#f5a05b"
                    fontFamily="Cinzel, Georgia, serif" fontSize="14">Procedural quests</text>
              <text x="120" y="432" textAnchor="middle" fill="#b3a99a" fontSize="11">
                &quot;Hunt the orc who
              </text>
              <text x="120" y="450" textAnchor="middle" fill="#b3a99a" fontSize="11">
                burned your camp&quot;
              </text>
              <text x="120" y="468" textAnchor="middle" fill="#b3a99a" fontSize="11">
                generated from grudges
              </text>
            </g>

            {/* arrows: player <-> encounter */}
            <line x1="170" y1="260" x2="218" y2="260"
                  stroke="#b3a99a" strokeWidth="2" markerEnd="url(#arrow)" />
            {/* encounter -> memory */}
            <line x1="390" y1="260" x2="448" y2="260"
                  stroke="#b3a99a" strokeWidth="2" markerEnd="url(#arrow)" />
            {/* memory -> ai director */}
            <line x1="620" y1="260" x2="678" y2="260"
                  stroke="#b3a99a" strokeWidth="2" markerEnd="url(#arrow)" />
            {/* ai director up to hierarchy */}
            <path d="M 770 220 C 770 180, 700 160, 600 140"
                  stroke="#f5a05b" strokeWidth="2" fill="none"
                  markerEnd="url(#arrow-accent)" />
            {/* ai director down to world state */}
            <line x1="770" y1="300" x2="770" y2="378"
                  stroke="#b3a99a" strokeWidth="2" markerEnd="url(#arrow)" />
            {/* world state -> persistence */}
            <line x1="650" y1="430" x2="678" y2="430"
                  stroke="#b3a99a" strokeWidth="2" markerEnd="url(#arrow)" />
            {/* persistence -> ai director (cycle) */}
            <path d="M 770 380 C 870 360, 870 320, 820 300"
                  stroke="#36303f" strokeWidth="1.5" fill="none"
                  strokeDasharray="4 3" />
            {/* hierarchy -> encounter (which captain shows up) */}
            <path d="M 440 160 C 440 195, 380 210, 305 218"
                  stroke="#f5a05b" strokeWidth="2" fill="none"
                  markerEnd="url(#arrow-accent)" />
            {/* memory -> quests */}
            <path d="M 470 300 C 380 360, 250 365, 180 378"
                  stroke="#e6c34d" strokeWidth="2" fill="none"
                  markerEnd="url(#arrow)" />
            {/* quests -> player */}
            <path d="M 95 380 C 95 340, 95 320, 95 300"
                  stroke="#b3a99a" strokeWidth="2" fill="none"
                  markerEnd="url(#arrow)" />
          </svg>

          <ul className="diagram-legend clean">
            <li>
              <span className="dot dot-player" /> Player loop — what you do in a fight.
            </li>
            <li>
              <span className="dot dot-memory" /> Memory bus — every action emits a tagged event (burned, fled, killed).
            </li>
            <li>
              <span className="dot dot-director" /> AI Director — reads events, mutates captains, picks who shows up next.
            </li>
            <li>
              <span className="dot dot-world" /> World state — runs even while you&rsquo;re away (offline simulation).
            </li>
          </ul>
        </div>

        <p className="dim" style={{ fontSize: "0.9rem" }}>
          The little version on this site collapses the AI Director, hierarchy
          and world state into one function (<code>resolveAftermath</code>) and
          one captain. Same loop, fewer moving parts.
        </p>
      </section>

      <section>
        <h2>Why it mattered</h2>
        <p>
          Before the Nemesis System, enemies in open-world games were mostly
          interchangeable. The Nemesis System made individual mooks{" "}
          <strong>matter</strong>: players told stories about a specific orc
          who&rsquo;d killed them three times, who hated fire, who they finally
          beheaded in a duel. Warner Bros. famously{" "}
          <a
            href="https://en.wikipedia.org/wiki/Nemesis_(video_game_system)"
            target="_blank"
            rel="noreferrer"
          >
            patented the system
          </a>
          , which is why almost no other studio has shipped its equivalent.
        </p>
      </section>

      <section>
        <h2>Try a tiny version</h2>
        <p>
          The demo below is a stripped-down model of the same idea. You face a
          single enemy. Your choices — what you attack with, whether you flee,
          whether you spare them — are <strong>remembered</strong> in your
          browser. The next time you fight, they&rsquo;ll be different because
          of you.
        </p>
        <Link className="cta" href="/demo">
          Enter the arena →
        </Link>
      </section>

      <p className="foot">
        Built as a learning demo. Not affiliated with Monolith Productions or
        WB Games. <Link href="/demo">Demo</Link> ·{" "}
        <a
          href="https://github.com/"
          target="_blank"
          rel="noreferrer"
        >
          Source
        </a>
      </p>
    </main>
  );
}

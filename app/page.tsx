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

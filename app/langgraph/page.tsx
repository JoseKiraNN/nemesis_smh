import Link from "next/link";

export const metadata = {
  title: "Nemesis as a LangGraph agent",
  description:
    "How to port the Nemesis System to a LangGraph agent: state schema, nodes, conditional edges, persistence with checkpointers, and a multi-agent hierarchy.",
};

export default function LangGraphPage() {
  return (
    <main>
      <p>
        <Link href="/">← Back</Link>
        {" · "}
        <Link href="/code">See the TypeScript version →</Link>
        {" · "}
        <Link href="/demo">Demo →</Link>
      </p>
      <h1>Nemesis as a LangGraph agent</h1>
      <p className="tagline">
        The same loop, but the enemy is an LLM agent with persistent memory,
        tools, and a state machine you can draw.
      </p>

      <section>
        <h2>Why LangGraph fits this problem</h2>
        <p>
          The Nemesis System is, mechanically:{" "}
          <strong>persistent state + a finite set of nodes + conditional
          transitions based on outcomes</strong>. That is exactly what{" "}
          <a
            href="https://langchain-ai.github.io/langgraph/"
            target="_blank"
            rel="noreferrer"
          >
            LangGraph
          </a>{" "}
          models natively:
        </p>
        <ul className="clean">
          <li><strong>State</strong> — the <code>Nemesis</code> object (traits, scars, grudges) is the graph state.</li>
          <li><strong>Nodes</strong> — <code>spawn</code>, <code>perceive</code>, <code>decide</code>, <code>combat</code>, <code>remember</code>, <code>persist</code>.</li>
          <li><strong>Edges</strong> — conditional on the battle <code>outcome</code> (victory / defeat / fled).</li>
          <li><strong>Persistence</strong> — a LangGraph <code>checkpointer</code> (SQLite, Postgres, Redis) replaces <code>localStorage</code>. The enemy literally <em>survives a server restart</em>.</li>
          <li><strong>Tools</strong> — combat actions are tools the agent can call. So is <code>generate_taunt(grudges)</code>.</li>
          <li><strong>Multi-agent</strong> — one supervisor (the Warchief), N captain subgraphs. Same primitive scales to a whole faction.</li>
        </ul>
      </section>

      <section>
        <h2>The graph, visually</h2>
        <div className="diagram-wrap">
          <svg
            viewBox="0 0 880 460"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="LangGraph state machine for the Nemesis agent: load_or_spawn, perceive_player, decide_action (LLM), resolve_combat, update_memory, persist."
            className="system-diagram"
          >
            <defs>
              <marker id="lg-arrow" viewBox="0 0 10 10" refX="9" refY="5"
                      markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#b3a99a" />
              </marker>
              <marker id="lg-arrow-good" viewBox="0 0 10 10" refX="9" refY="5"
                      markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#6ec07a" />
              </marker>
              <marker id="lg-arrow-bad" viewBox="0 0 10 10" refX="9" refY="5"
                      markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#d94f3a" />
              </marker>
              <linearGradient id="lgPanel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#252030" />
                <stop offset="100%" stopColor="#1c1922" />
              </linearGradient>
            </defs>

            {/* START */}
            <circle cx="60" cy="60" r="20" fill="#0d0c11" stroke="#6ec07a" strokeWidth="2" />
            <text x="60" y="65" textAnchor="middle" fill="#6ec07a" fontSize="12">START</text>

            {/* load_or_spawn */}
            <rect x="160" y="35" width="170" height="50" rx="8"
                  fill="url(#lgPanel)" stroke="#36506b" />
            <text x="245" y="58" textAnchor="middle" fill="#b9c8e0"
                  fontFamily="Cinzel, Georgia, serif" fontSize="13">load_or_spawn</text>
            <text x="245" y="74" textAnchor="middle" fill="#b3a99a" fontSize="10">checkpointer.get()</text>

            {/* perceive */}
            <rect x="380" y="35" width="160" height="50" rx="8"
                  fill="url(#lgPanel)" stroke="#36506b" />
            <text x="460" y="58" textAnchor="middle" fill="#b9c8e0"
                  fontFamily="Cinzel, Georgia, serif" fontSize="13">perceive_player</text>
            <text x="460" y="74" textAnchor="middle" fill="#b3a99a" fontSize="10">build prompt + grudges</text>

            {/* decide (LLM) */}
            <rect x="590" y="35" width="170" height="50" rx="8"
                  fill="url(#lgPanel)" stroke="#f5a05b" />
            <text x="675" y="58" textAnchor="middle" fill="#f5a05b"
                  fontFamily="Cinzel, Georgia, serif" fontSize="13">decide_action 🤖</text>
            <text x="675" y="74" textAnchor="middle" fill="#b3a99a" fontSize="10">LLM + tool call</text>

            {/* resolve_combat */}
            <rect x="380" y="155" width="160" height="60" rx="8"
                  fill="url(#lgPanel)" stroke="#b53a27" />
            <text x="460" y="180" textAnchor="middle" fill="#f5a05b"
                  fontFamily="Cinzel, Georgia, serif" fontSize="13">resolve_combat</text>
            <text x="460" y="197" textAnchor="middle" fill="#b3a99a" fontSize="10">apply damage,</text>
            <text x="460" y="209" textAnchor="middle" fill="#b3a99a" fontSize="10">record usedFire / heavy</text>

            {/* outcome diamond */}
            <polygon points="460,250 540,295 460,340 380,295"
                     fill="#0d0c11" stroke="#36303f" />
            <text x="460" y="290" textAnchor="middle" fill="#b3a99a" fontSize="11">outcome?</text>
            <text x="460" y="305" textAnchor="middle" fill="#b3a99a" fontSize="11">(conditional</text>
            <text x="460" y="318" textAnchor="middle" fill="#b3a99a" fontSize="11">edge)</text>

            {/* update_memory */}
            <rect x="600" y="270" width="170" height="60" rx="8"
                  fill="url(#lgPanel)" stroke="#6b5a2a" />
            <text x="685" y="295" textAnchor="middle" fill="#e6c34d"
                  fontFamily="Cinzel, Georgia, serif" fontSize="13">update_memory</text>
            <text x="685" y="312" textAnchor="middle" fill="#b3a99a" fontSize="10">append grudge,</text>
            <text x="685" y="324" textAnchor="middle" fill="#b3a99a" fontSize="10">add scar / trait</text>

            {/* promote */}
            <rect x="600" y="370" width="170" height="55" rx="8"
                  fill="url(#lgPanel)" stroke="#b53a27" />
            <text x="685" y="395" textAnchor="middle" fill="#d94f3a"
                  fontFamily="Cinzel, Georgia, serif" fontSize="13">promote_or_succeed</text>
            <text x="685" y="412" textAnchor="middle" fill="#b3a99a" fontSize="10">+rank, or spawn heir</text>

            {/* persist */}
            <rect x="160" y="320" width="170" height="55" rx="8"
                  fill="url(#lgPanel)" stroke="#36303f" />
            <text x="245" y="345" textAnchor="middle" fill="#f5a05b"
                  fontFamily="Cinzel, Georgia, serif" fontSize="13">persist</text>
            <text x="245" y="362" textAnchor="middle" fill="#b3a99a" fontSize="10">checkpointer.put()</text>

            {/* END */}
            <circle cx="60" cy="345" r="20" fill="#0d0c11" stroke="#d94f3a" strokeWidth="2" />
            <text x="60" y="350" textAnchor="middle" fill="#d94f3a" fontSize="12">END</text>

            {/* edges */}
            <line x1="80" y1="60" x2="158" y2="60"
                  stroke="#b3a99a" strokeWidth="2" markerEnd="url(#lg-arrow)" />
            <line x1="330" y1="60" x2="378" y2="60"
                  stroke="#b3a99a" strokeWidth="2" markerEnd="url(#lg-arrow)" />
            <line x1="540" y1="60" x2="588" y2="60"
                  stroke="#b3a99a" strokeWidth="2" markerEnd="url(#lg-arrow)" />
            {/* decide -> resolve (loop body) */}
            <path d="M 675 85 C 675 130, 540 140, 500 153"
                  stroke="#b3a99a" strokeWidth="2" fill="none"
                  markerEnd="url(#lg-arrow)" />
            {/* resolve -> outcome */}
            <line x1="460" y1="215" x2="460" y2="248"
                  stroke="#b3a99a" strokeWidth="2" markerEnd="url(#lg-arrow)" />
            {/* outcome -> perceive (loop, "fight continues") */}
            <path d="M 380 295 C 270 270, 280 130, 380 75"
                  stroke="#6ec07a" strokeWidth="2" fill="none"
                  strokeDasharray="6 4"
                  markerEnd="url(#lg-arrow-good)" />
            <text x="270" y="180" fill="#6ec07a" fontSize="11"
                  fontFamily="ui-monospace, monospace">continue</text>
            {/* outcome -> update_memory (victory / fled) */}
            <line x1="540" y1="295" x2="598" y2="295"
                  stroke="#b3a99a" strokeWidth="2" markerEnd="url(#lg-arrow)" />
            <text x="555" y="288" fill="#e6c34d" fontSize="11"
                  fontFamily="ui-monospace, monospace">victory|fled</text>
            {/* outcome -> promote (defeat) */}
            <path d="M 480 340 C 540 360, 580 380, 598 392"
                  stroke="#d94f3a" strokeWidth="2" fill="none"
                  markerEnd="url(#lg-arrow-bad)" />
            <text x="500" y="368" fill="#d94f3a" fontSize="11"
                  fontFamily="ui-monospace, monospace">defeat</text>
            {/* memory -> persist */}
            <path d="M 600 320 C 470 345, 380 348, 332 348"
                  stroke="#b3a99a" strokeWidth="2" fill="none"
                  markerEnd="url(#lg-arrow)" />
            {/* promote -> persist */}
            <path d="M 600 395 C 470 415, 380 380, 332 360"
                  stroke="#b3a99a" strokeWidth="2" fill="none"
                  markerEnd="url(#lg-arrow)" />
            {/* persist -> END */}
            <line x1="158" y1="348" x2="82" y2="346"
                  stroke="#b3a99a" strokeWidth="2" markerEnd="url(#lg-arrow)" />
          </svg>
          <ul className="diagram-legend clean">
            <li><span className="dot dot-player" /> Deterministic node — pure Python, no LLM.</li>
            <li><span className="dot dot-director" /> LLM node — chooses action / generates taunts.</li>
            <li><span className="dot dot-memory" /> Memory mutation — appends grudges, scars, traits.</li>
            <li><span className="dot dot-world" /> Persistence boundary — checkpointer write.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>1. State schema</h2>
        <p>
          LangGraph state is a <code>TypedDict</code>. This is the direct port
          of our <code>Nemesis</code> + <code>BattleState</code>. The{" "}
          <code>Annotated[..., add]</code> reducer means &ldquo;append, don&rsquo;t
          overwrite&rdquo; — perfect for grudges and combat logs.
        </p>
        <Code language="python">{`from typing import TypedDict, Literal, Annotated
from operator import add

Trait    = Literal["Armored", "Berserker", "Quick", "Brutal",
                   "Vengeful", "Cowardly", "Fire Resistant"]
Scar     = Literal["Burned", "One-Eyed", "Limping",
                   "Cracked Skull", "Missing Arm"]
Grudge   = Literal["you-burned-me", "you-fled",
                   "you-killed-me", "you-spared-me", "you-mocked-me"]
Outcome  = Literal["victory", "defeat", "fled", "ongoing"]

class NemesisState(TypedDict):
    # identity
    id: str
    name: str
    title: str
    rank: int
    # stats
    hp: int
    hp_max: int
    atk: int
    def_: int
    # memory (append-only via reducer)
    traits:  Annotated[list[Trait],  add]
    scars:   Annotated[list[Scar],   add]
    grudges: Annotated[list[Grudge], add]
    log:     Annotated[list[str],    add]
    # battle-scoped
    player_hp: int
    round: int
    last_action: str | None
    used_fire: bool
    used_heavy: bool
    outcome: Outcome
    combat_log: Annotated[list[str], add]`}</Code>
      </section>

      <section>
        <h2>2. Nodes</h2>
        <p>
          Each node is just a function <code>(state) -&gt; partial state</code>.
          The deterministic ones port 1:1 from the TypeScript engine.
        </p>
        <Code language="python">{`import random
from langgraph.graph import StateGraph, START, END

def load_or_spawn(state: NemesisState) -> dict:
    # checkpointer already restored prior state if it exists.
    # only spawn if this is a brand new thread.
    if state.get("id"):
        return {}
    return spawn_nemesis(rank=1)

def perceive_player(state: NemesisState) -> dict:
    # build the "what does the nemesis see" context for the LLM
    return {
        "combat_log": [f"Round {state['round']}: "
                       f"player at {state['player_hp']}hp, "
                       f"{state['name']} at {state['hp']}hp"],
    }

def resolve_combat(state: NemesisState, action: str) -> dict:
    # exact same math as lib/nemesis.ts takeTurn()
    n_def = state["def_"]
    if action == "attack":
        dmg = max(1, 14 - n_def + random.randint(0, 4))
        return _apply(state, dmg, incoming_mod=1.0)
    if action == "heavy":
        dmg = max(1, 24 - n_def + random.randint(0, 5))
        return _apply(state, dmg, incoming_mod=1.4, used_heavy=True)
    if action == "defend":
        return _apply(state, 0, incoming_mod=0.35)
    if action == "fire":
        if "Fire Resistant" in state["traits"]:
            dmg = 4 + random.randint(0, 2)
        else:
            dmg = 22 + random.randint(0, 7)
        return _apply(state, dmg, incoming_mod=1.0, used_fire=True)
    if action == "flee":
        chance = 0.45 if "Quick" in state["traits"] else 0.7
        if random.random() < chance:
            return {"outcome": "fled"}
        return _apply(state, 0, incoming_mod=1.0)

def update_memory(state: NemesisState) -> dict:
    grudges, scars, traits, log = [], [], [], []
    if state["used_fire"] and "Fire Resistant" not in state["traits"]:
        if random.random() < 0.7:
            traits.append("Fire Resistant")
            log.append(f"{state['name']} learned to resist fire.")
    if state["outcome"] == "victory" and state["used_fire"]:
        grudges.append("you-burned-me")
        if "Burned" not in state["scars"]:
            scars.append("Burned")
    if state["outcome"] == "fled":
        grudges.append("you-fled")
    return {"grudges": grudges, "scars": scars,
            "traits": traits, "log": log}

def promote_or_succeed(state: NemesisState) -> dict:
    # player lost: nemesis is promoted
    new_rank = state["rank"] + 1
    return {
        "rank": new_rank,
        "hp_max": state["hp_max"] + 20,
        "atk": state["atk"] + 3,
        "def_": state["def_"] + 1,
        "log": [f"Promoted to Rank {new_rank} after killing the player."],
    }`}</Code>
      </section>

      <section>
        <h2>3. The LLM node — the enemy <em>thinks</em></h2>
        <p>
          This is the part the TypeScript demo can&rsquo;t do. The nemesis
          picks its own action based on its state, traits, and grudges. Use
          structured output so the choice is one of the legal actions.
        </p>
        <Code language="python">{`from pydantic import BaseModel
from langchain_openai import ChatOpenAI

class NemesisDecision(BaseModel):
    action: Literal["attack", "heavy", "defend", "intimidate"]
    taunt: str  # in-character line shown to the player

llm = ChatOpenAI(model="gpt-4o-mini").with_structured_output(NemesisDecision)

SYSTEM = """You are {name} {title}, a Rank {rank} orc captain.
Your traits: {traits}.
Your scars (wounds you carry): {scars}.
Your grudges against the player: {grudges}.
You are at {hp}/{hp_max} HP. The player is at {player_hp} HP.
Pick a combat action. Be in character. If Vengeful and grudges>0,
favor 'heavy'. If 'Cowardly' and hp<40%, consider 'defend'."""

def decide_action(state: NemesisState) -> dict:
    prompt = SYSTEM.format(**state, hp_max=state["hp_max"])
    decision: NemesisDecision = llm.invoke(prompt)
    return {
        "last_action": decision.action,
        "combat_log": [f'{state["name"]}: "{decision.taunt}"'],
    }`}</Code>
      </section>

      <section>
        <h2>4. Wiring the graph + conditional edges</h2>
        <p>
          This is where LangGraph earns its keep. <code>add_conditional_edges</code>
          routes on the <code>outcome</code> field after combat resolves.
        </p>
        <Code language="python">{`def route_after_combat(state: NemesisState) -> str:
    if state["outcome"] == "victory":
        return "update_memory"   # player won
    if state["outcome"] == "defeat":
        return "promote_or_succeed"
    if state["outcome"] == "fled":
        return "update_memory"
    return "perceive_player"     # fight continues

builder = StateGraph(NemesisState)
builder.add_node("load_or_spawn",       load_or_spawn)
builder.add_node("perceive_player",     perceive_player)
builder.add_node("decide_action",       decide_action)
builder.add_node("resolve_combat",      resolve_combat)
builder.add_node("update_memory",       update_memory)
builder.add_node("promote_or_succeed",  promote_or_succeed)

builder.add_edge(START,             "load_or_spawn")
builder.add_edge("load_or_spawn",   "perceive_player")
builder.add_edge("perceive_player", "decide_action")
builder.add_edge("decide_action",   "resolve_combat")
builder.add_conditional_edges("resolve_combat", route_after_combat, {
    "perceive_player":    "perceive_player",
    "update_memory":      "update_memory",
    "promote_or_succeed": "promote_or_succeed",
})
builder.add_edge("update_memory",      END)
builder.add_edge("promote_or_succeed", END)`}</Code>
      </section>

      <section>
        <h2>5. Persistence — the &ldquo;Nemesis&rdquo; bit</h2>
        <p>
          A LangGraph <code>checkpointer</code> snapshots state at every node.
          Pass a stable <code>thread_id</code> per nemesis and the agent picks
          up exactly where it left off — across processes, across deploys.
          That&rsquo;s the <code>localStorage</code> idea, scaled to a server.
        </p>
        <Code language="python">{`from langgraph.checkpoint.sqlite import SqliteSaver
# for prod: from langgraph.checkpoint.postgres import PostgresSaver

checkpointer = SqliteSaver.from_conn_string("nemesis.db")
graph = builder.compile(checkpointer=checkpointer)

# one thread_id per persistent enemy
config = {"configurable": {"thread_id": "captain-grok-the-bloody"}}

# first encounter — spawns
graph.invoke({"player_hp": 100, "round": 1, "outcome": "ongoing"},
             config=config)

# weeks later, different process — same enemy, all grudges intact
graph.invoke({"player_hp": 100, "round": 1, "outcome": "ongoing"},
             config=config)`}</Code>
        <p className="dim" style={{ fontSize: "0.9rem" }}>
          Swap <code>SqliteSaver</code> for <code>PostgresSaver</code> or{" "}
          <code>RedisSaver</code> in production. The graph code doesn&rsquo;t
          change.
        </p>
      </section>

      <section>
        <h2>6. Multi-agent: the Warchief and his captains</h2>
        <p>
          One captain is a graph. A faction is a <strong>graph of graphs</strong>.
          Use a supervisor node (the Warchief) that decides which captain
          intercepts the player, with each captain&rsquo;s own subgraph keyed
          by its own <code>thread_id</code>.
        </p>
        <Code language="python">{`captain_graph = builder.compile(checkpointer=checkpointer)

class FactionState(TypedDict):
    captains: list[str]                   # thread_ids
    warchief: str
    player_location: str
    pending_intercept: str | None

def warchief_decides(state: FactionState) -> dict:
    # LLM (or rules) picks which captain ambushes the player.
    # Captains with active grudges against the player are prioritized.
    candidate = pick_captain_with_grudge(state)
    return {"pending_intercept": candidate}

def run_captain(state: FactionState) -> dict:
    cfg = {"configurable": {"thread_id": state["pending_intercept"]}}
    result = captain_graph.invoke(
        {"player_hp": 100, "round": 1, "outcome": "ongoing"},
        config=cfg,
    )
    # bubble outcome up so the faction state can react
    return {"last_outcome": result["outcome"]}

faction = StateGraph(FactionState)
faction.add_node("warchief_decides", warchief_decides)
faction.add_node("run_captain",      run_captain)
faction.add_edge(START, "warchief_decides")
faction.add_edge("warchief_decides", "run_captain")
faction.add_edge("run_captain", END)`}</Code>
        <p>
          Background promotions, succession when a captain dies, and
          inter-captain feuds all become extra nodes on the faction graph.
          The <em>offline simulation</em> from the system diagram becomes a
          scheduled <code>faction.invoke()</code> on a cron.
        </p>
      </section>

      <section>
        <h2>7. Tools the agent can actually call</h2>
        <p>
          For a richer version, expose combat moves and memory queries as
          LangChain tools. The LLM can then both <em>act</em> and{" "}
          <em>introspect its own memory</em> mid-fight.
        </p>
        <Code language="python">{`from langchain_core.tools import tool

@tool
def recall_grudges(against: str) -> list[str]:
    """Return all grudges this nemesis holds against the named target."""
    return load_grudges_for(against)

@tool
def perform_attack(kind: Literal["light", "heavy", "intimidate"]) -> str:
    """Strike the player. Returns a description of what happened."""
    ...

llm_with_tools = ChatOpenAI(model="gpt-4o-mini").bind_tools(
    [recall_grudges, perform_attack]
)`}</Code>
      </section>

      <section>
        <h2>What you get vs the JS demo</h2>
        <ul className="clean">
          <li><strong>Real persistence</strong> — server-side, multi-user, survives restarts.</li>
          <li><strong>Actual reasoning</strong> — the orc decides its move with context, not a switch statement.</li>
          <li><strong>Generated dialogue</strong> — taunts written on the fly from the grudge list.</li>
          <li><strong>Time travel</strong> — LangGraph checkpoints let you rewind a fight to any prior step.</li>
          <li><strong>Observability</strong> — every node call is traceable in LangSmith.</li>
          <li><strong>Scales to a faction</strong> — N captain subgraphs under one supervisor.</li>
        </ul>
      </section>

      <section>
        <h2>Useful references</h2>
        <ul className="clean">
          <li>
            <a href="https://langchain-ai.github.io/langgraph/concepts/low_level/" target="_blank" rel="noreferrer">
              LangGraph: state, nodes, edges
            </a>
          </li>
          <li>
            <a href="https://langchain-ai.github.io/langgraph/concepts/persistence/" target="_blank" rel="noreferrer">
              LangGraph persistence &amp; checkpointers
            </a>
          </li>
          <li>
            <a href="https://langchain-ai.github.io/langgraph/concepts/multi_agent/" target="_blank" rel="noreferrer">
              Multi-agent supervision patterns
            </a>
          </li>
        </ul>
      </section>

      <div className="cta-row" style={{ marginTop: 32 }}>
        <Link className="cta" href="/demo">
          Try the JS version →
        </Link>
        <Link className="cta secondary" href="/code">
          Read the JS engine →
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

// KrydsFelt Arcade — retro arcade themed landing page
const { useState, useEffect, useRef } = React;

const NAVY = '#0a1420';
const NAVY_2 = '#0f1c2e';
const NAVY_3 = '#16263d';
const GREEN = '#22c55e';
const GREEN_DIM = '#15803d';
const PINK = '#ff4d8d';
const YELLOW = '#ffd23f';
const CYAN = '#22d3ee';
const TEXT = '#f5f5f3';
const TEXT_DIM = '#7a8a9c';

// ============= PIXEL ICON HELPERS =============
// Each icon is an 8x8 or 10x10 grid of px squares; rendered as inline svg

const px = (grid, color, size = 32) => {
  const rows = grid.length;
  const cols = grid[0].length;
  const cells = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === 1) {
        cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={color} />);
      } else if (grid[y][x] === 2) {
        cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={GREEN} />);
      } else if (grid[y][x] === 3) {
        cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={YELLOW} />);
      } else if (grid[y][x] === 4) {
        cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={PINK} />);
      }
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${cols} ${rows}`} shapeRendering="crispEdges">
      {cells}
    </svg>
  );
};

const ICON = {
  joystick: [
    [0,0,1,1,1,1,0,0],
    [0,1,2,2,2,2,1,0],
    [0,1,2,2,2,2,1,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,1,1,1,1,0,0],
    [0,1,1,0,0,1,1,0],
    [1,1,0,0,0,0,1,1],
  ],
  controller: [
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,2,1,1,1,1,4,1,1],
    [1,2,2,2,1,1,4,4,4,1],
    [1,1,2,1,1,1,1,4,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,0,0,1,1,0,0],
  ],
  coin: [
    [0,0,1,1,1,1,0,0],
    [0,1,3,3,3,3,1,0],
    [1,3,1,3,3,1,3,1],
    [1,3,3,3,3,3,3,1],
    [1,3,3,3,3,3,3,1],
    [1,3,1,3,3,1,3,1],
    [0,1,3,3,3,3,1,0],
    [0,0,1,1,1,1,0,0],
  ],
  trophy: [
    [1,1,1,1,1,1,1,1],
    [1,3,3,3,3,3,3,1],
    [1,3,3,3,3,3,3,1],
    [0,1,3,3,3,3,1,0],
    [0,0,1,3,3,1,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0],
  ],
  rocket: [
    [0,0,0,1,1,0,0,0],
    [0,0,1,2,2,1,0,0],
    [0,0,1,2,2,1,0,0],
    [0,1,1,2,2,1,1,0],
    [1,1,2,2,2,2,1,1],
    [1,1,2,1,1,2,1,1],
    [0,0,1,4,4,1,0,0],
    [0,0,0,4,4,0,0,0],
  ],
  heart: [
    [0,1,1,0,0,1,1,0],
    [1,4,4,1,1,4,4,1],
    [1,4,4,4,4,4,4,1],
    [1,4,4,4,4,4,4,1],
    [0,1,4,4,4,4,1,0],
    [0,0,1,4,4,1,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,0,0,0,0,0],
  ],
  star: [
    [0,0,0,1,1,0,0,0],
    [0,0,0,3,3,0,0,0],
    [1,3,3,3,3,3,3,1],
    [1,3,3,3,3,3,3,1],
    [0,1,3,3,3,3,1,0],
    [0,1,3,3,3,3,1,0],
    [1,3,1,0,0,1,3,1],
    [1,1,0,0,0,0,1,1],
  ],
  ghost: [
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1],
    [1,4,1,1,1,4,1,1],
    [1,4,1,1,1,4,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,0,1,0,1,0,1,0],
  ],
  diamond: [
    [0,0,0,1,1,0,0,0],
    [0,0,1,2,2,1,0,0],
    [0,1,2,2,2,2,1,0],
    [1,2,2,2,2,2,2,1],
    [0,1,2,2,2,2,1,0],
    [0,0,1,2,2,1,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,0,0,0,0,0],
  ],
  bolt: [
    [0,0,0,1,1,1,0,0],
    [0,0,1,3,3,1,0,0],
    [0,1,3,3,1,0,0,0],
    [1,3,3,3,3,1,0,0],
    [0,0,1,3,3,3,1,0],
    [0,0,0,1,3,3,1,0],
    [0,0,0,1,3,1,0,0],
    [0,0,0,1,1,0,0,0],
  ],
  invader: [
    [0,0,1,0,0,0,0,1,0,0],
    [0,0,0,1,0,0,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,2,1,1,2,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,1,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,1,0,1],
    [0,0,0,1,1,1,1,0,0,0],
  ],
  pacdot: [
    [0,0,1,1,1,1,0,0],
    [0,1,3,3,3,3,1,0],
    [1,3,3,3,3,3,3,1],
    [1,3,3,3,3,3,3,1],
    [1,3,3,3,3,3,3,1],
    [1,3,3,3,3,3,3,1],
    [0,1,3,3,3,3,1,0],
    [0,0,1,1,1,1,0,0],
  ],
};

const PixelIcon = ({ kind, size = 40, color = TEXT }) => {
  const grid = ICON[kind];
  if (!grid) return null;
  return px(grid, color, size);
};

// ============= MARQUEE / LOGO =============
const KrydsX = ({ size = 80, color = GREEN }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ display: 'block' }}>
    <path d="M 20 18 L 50 18 L 100 100 L 50 182 L 20 182 L 70 100 Z" fill={color} />
    <path d="M 180 18 L 150 18 L 100 100 L 150 182 L 180 182 L 130 100 Z" fill={color} />
  </svg>
);

// ============= BLINKING TEXT =============
const Blink = ({ children, speed = 600 }) => {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const i = setInterval(() => setOn(v => !v), speed);
    return () => clearInterval(i);
  }, [speed]);
  return <span style={{ visibility: on ? 'visible' : 'hidden' }}>{children}</span>;
};

// ============= TICKER COUNTER =============
const Ticker = ({ to, prefix = '', suffix = '', duration = 1200 }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setSeen(true);
    }, { threshold: 0.4 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!seen) return;
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to, duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString('da-DK')}{suffix}</span>;
};

// ============= MARQUEE BAR =============
const MarqueeBar = () => {
  const items = [
    'INSERT COIN TO START',
    'KRYDSFELT.DK',
    'NEW HIGH SCORE',
    'PLAYER 1 READY',
    'BONUS LEVEL UNLOCKED',
    '★ ★ ★ ★ ★',
    'PRESS START',
  ];
  const repeated = [...items, ...items, ...items];
  return (
    <div style={arcadeStyles.marqueeBar}>
      <div style={arcadeStyles.marqueeTrack}>
        {repeated.map((it, i) => (
          <span key={i} style={arcadeStyles.marqueeItem}>
            <span style={{ color: GREEN, marginRight: 12 }}>◆</span>
            {it}
          </span>
        ))}
      </div>
    </div>
  );
};

// ============= TOP NAV =============
const Nav = () => (
  <nav style={arcadeStyles.nav}>
    <div style={arcadeStyles.navInner}>
      <div style={arcadeStyles.navLogo}>
        <KrydsX size={28} color={GREEN} />
        <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 14, letterSpacing: 2 }}>KRYDSFELT</span>
      </div>
      <div style={arcadeStyles.navLinks} className="arcade-nav-links">
        {['GAMES', 'LEVELS', 'SCORES', 'SHOP'].map(l => (
          <a key={l} href="#" style={arcadeStyles.navLink}>{l}</a>
        ))}
      </div>
      <div style={arcadeStyles.navCoin}>
        <PixelIcon kind="coin" size={18} />
        <span>CREDITS: 03</span>
      </div>
    </div>
  </nav>
);

// ============= HERO / CABINET =============
const Hero = () => {
  const [pressStart, setPressStart] = useState(false);
  return (
    <section style={arcadeStyles.hero}>
      {/* floating arcade icons */}
      <div style={arcadeStyles.heroFloat}>
        <FloatIcon kind="invader" left="6%" top="18%" delay={0} color={GREEN} />
        <FloatIcon kind="ghost" left="88%" top="22%" delay={1.2} color={PINK} />
        <FloatIcon kind="star" left="14%" top="72%" delay={0.6} color={YELLOW} />
        <FloatIcon kind="diamond" left="82%" top="68%" delay={2.1} color={CYAN} />
        <FloatIcon kind="heart" left="92%" top="48%" delay={1.6} color={PINK} />
        <FloatIcon kind="bolt" left="4%" top="42%" delay={0.9} color={YELLOW} />
        <FloatIcon kind="pacdot" left="50%" top="8%" delay={1.4} color={YELLOW} />
      </div>

      <div style={arcadeStyles.cabinet}>
        {/* marquee */}
        <div style={arcadeStyles.marquee}>
          <div style={arcadeStyles.marqueeGlow}>
            <KrydsX size={56} color={GREEN} />
            <span style={arcadeStyles.marqueeText}>KRYDSFELT</span>
          </div>
          <div style={arcadeStyles.marqueeSub}>
            <Blink>★</Blink>&nbsp;ARCADE EDITION&nbsp;<Blink>★</Blink>
          </div>
        </div>

        {/* screen */}
        <div style={arcadeStyles.screen}>
          <div style={arcadeStyles.screenInner}>
            <div style={arcadeStyles.scanlines}></div>
            <div style={arcadeStyles.crt}>

              <div style={arcadeStyles.heroTagline}>
                ◤ PLAYER 1 — DIGITAL BUREAU ◥
              </div>

              <h1 style={arcadeStyles.heroTitle}>
                BUILD YOUR<br/>
                <span style={{ color: GREEN, textShadow: `0 0 20px ${GREEN}` }}>NEXT LEVEL</span><br/>
                BUSINESS
              </h1>

              <p style={arcadeStyles.heroSub}>
                websites &nbsp;·&nbsp; systems &nbsp;·&nbsp; google &amp; meta ads<br/>
                press start to begin your quest
              </p>

              <div style={arcadeStyles.heroCtaRow}>
                <button
                  style={{...arcadeStyles.btnStart, ...(pressStart ? arcadeStyles.btnStartPressed : {})}}
                  onMouseDown={() => setPressStart(true)}
                  onMouseUp={() => setPressStart(false)}
                  onMouseLeave={() => setPressStart(false)}
                >
                  <PixelIcon kind="coin" size={22} />
                  <span><Blink speed={500}>▶</Blink> INSERT COIN</span>
                </button>
                <button style={arcadeStyles.btnGhost}>
                  HOW TO PLAY →
                </button>
              </div>

              <div style={arcadeStyles.heroStatRow} className="arcade-stats">
                <Stat label="HI-SCORE" value="047,832" color={GREEN} />
                <Stat label="LEVEL" value="08" color={YELLOW} />
                <Stat label="LIVES" value="∞" color={PINK} />
                <Stat label="COMBO" value="x12" color={CYAN} />
              </div>
            </div>
          </div>

          {/* control panel */}
          <div style={arcadeStyles.controls}>
            <div style={arcadeStyles.joystick}>
              <PixelIcon kind="joystick" size={48} />
            </div>
            <div style={arcadeStyles.btnRow}>
              <div style={{...arcadeStyles.cabBtn, background: GREEN}}>A</div>
              <div style={{...arcadeStyles.cabBtn, background: PINK}}>B</div>
              <div style={{...arcadeStyles.cabBtn, background: YELLOW, color: NAVY}}>X</div>
              <div style={{...arcadeStyles.cabBtn, background: CYAN, color: NAVY}}>Y</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Stat = ({ label, value, color }) => (
  <div style={arcadeStyles.stat}>
    <div style={{ ...arcadeStyles.statLabel, color: TEXT_DIM }}>{label}</div>
    <div style={{ ...arcadeStyles.statValue, color }}>{value}</div>
  </div>
);

const FloatIcon = ({ kind, left, top, delay, color }) => (
  <div style={{
    position: 'absolute', left, top,
    animation: `kfFloat 4s ease-in-out ${delay}s infinite`,
    opacity: 0.6,
  }}>
    <PixelIcon kind={kind} size={36} color={color} />
  </div>
);

// ============= GAME SELECT (services) =============
const GAMES = [
  { code: '01', name: 'WEB QUEST', tag: 'WEBSITES', icon: 'rocket', color: GREEN, lines: ['+ NEXT.JS / ASTRO', '+ HEADLESS CMS', '+ A/B TESTING', '+ SEO BOSS BATTLE'] },
  { code: '02', name: 'AD BLASTER', tag: 'GOOGLE & META', icon: 'bolt', color: YELLOW, lines: ['+ PERFORMANCE MAX', '+ META ADVANTAGE+', '+ CREATIVE TESTING', '+ ROAS POWER-UP'] },
  { code: '03', name: 'SYSTEM RAIDER', tag: 'SYSTEMS & APPS', icon: 'controller', color: PINK, lines: ['+ CRM / ERP DUNGEONS', '+ AUTOMATION COMBOS', '+ AI INTEGRATIONS', '+ INTERNAL TOOLS'] },
  { code: '04', name: 'CONVERSION RUSH', tag: 'CRO / FUNNELS', icon: 'diamond', color: CYAN, lines: ['+ HEATMAP DIVE', '+ CHECKOUT BOSS', '+ FORM HACKING', '+ +30% CONVERSION'] },
];

const GameSelect = () => (
  <section style={arcadeStyles.section}>
    <SectionHeader chip="SELECT GAME" title="WHAT WE PLAY" sub="Choose your bureau-quest. All games include unlimited continues." />
    <div style={arcadeStyles.gameGrid} className="arcade-grid-4">
      {GAMES.map(g => <GameCard key={g.code} {...g} />)}
    </div>
  </section>
);

const GameCard = ({ code, name, tag, icon, color, lines }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{
        ...arcadeStyles.gameCard,
        borderColor: hover ? color : '#1f2c44',
        boxShadow: hover ? `0 0 0 1px ${color}, 0 0 30px ${color}40` : 'none',
        transform: hover ? 'translateY(-4px)' : 'none',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={arcadeStyles.gameCardTop}>
        <div style={{ ...arcadeStyles.gameCode, color }}>GAME #{code}</div>
        <div style={arcadeStyles.gameStatus}>
          <span style={{ color: GREEN }}>●</span> ONLINE
        </div>
      </div>
      <div style={{ ...arcadeStyles.gameIcon, background: `${color}1a`, borderColor: `${color}66` }}>
        <PixelIcon kind={icon} size={56} color={color} />
      </div>
      <div style={arcadeStyles.gameName}>{name}</div>
      <div style={{ ...arcadeStyles.gameTag, color }}>{tag}</div>
      <div style={arcadeStyles.gameLines}>
        {lines.map((l, i) => <div key={i} style={arcadeStyles.gameLine}>{l}</div>)}
      </div>
      <div style={{ ...arcadeStyles.gamePlay, color }}>
        <Blink>▶</Blink>&nbsp;PRESS A TO START
      </div>
    </div>
  );
};

// ============= LEVELS (process) =============
const LEVELS = [
  { num: '01', name: 'DISCOVERY', desc: 'Map the dungeon. Learn your enemies (competitors), allies (audience), and treasure (KPIs).', icon: 'pacdot' },
  { num: '02', name: 'STRATEGY',  desc: 'Pick your loadout. Channels, messaging, tech-stack, budget allocation.', icon: 'star' },
  { num: '03', name: 'BUILD',     desc: 'Forge your weapons: site, ads, automations. Ship to staging arena.', icon: 'rocket' },
  { num: '04', name: 'OPTIMIZE',  desc: 'Grind XP forever. Weekly tests, creative refresh, scaling whats working.', icon: 'bolt' },
];

const Levels = () => (
  <section style={arcadeStyles.section}>
    <SectionHeader chip="LEVELS 01–04" title="HOW THE GAME GOES" sub="A four-level loop. Beat one, the next unlocks." />
    <div style={arcadeStyles.levelStrip} className="arcade-grid-4">
      {LEVELS.map((lv, i) => (
        <div key={lv.num} style={arcadeStyles.levelCard}>
          <div style={arcadeStyles.levelTop}>
            <div style={arcadeStyles.levelNum}>LV.{lv.num}</div>
            <PixelIcon kind={lv.icon} size={28} color={GREEN} />
          </div>
          <div style={arcadeStyles.levelName}>{lv.name}</div>
          <div style={arcadeStyles.levelBar}>
            {Array.from({ length: 12 }).map((_, j) => (
              <div key={j} style={{
                ...arcadeStyles.levelBlock,
                background: j < (i + 1) * 3 ? GREEN : '#1f2c44',
                boxShadow: j < (i + 1) * 3 ? `0 0 6px ${GREEN}` : 'none',
              }} />
            ))}
          </div>
          <div style={arcadeStyles.levelDesc}>{lv.desc}</div>
          {i < LEVELS.length - 1 && (
            <div style={arcadeStyles.levelArrow}>▶</div>
          )}
        </div>
      ))}
    </div>
  </section>
);

// ============= HIGH SCORES (cases) =============
const SCORES = [
  { rank: 1, name: 'AAA', client: 'NORDIC SHOP CO.', score: 482310, badge: 'WEB+ADS', metric: '+312% ROAS', icon: 'trophy' },
  { rank: 2, name: 'BUR', client: 'BUREAU & SØN',    score: 318940, badge: 'CRM SYSTEM', metric: '–60% MANUEL TID', icon: 'star' },
  { rank: 3, name: 'CPH', client: 'CPH CLINIC',      score: 274501, badge: 'WEB+SEO', metric: '+184% LEADS', icon: 'diamond' },
  { rank: 4, name: 'FLG', client: 'FLINKE GUTTER',   score: 199203, badge: 'META ADS', metric: '4.2x ROAS',  icon: 'rocket' },
  { rank: 5, name: 'KAF', client: 'KAFFE & CO.',     score: 152080, badge: 'SHOPIFY',   metric: '+92% AOV',   icon: 'coin' },
];

const HighScores = () => (
  <section style={arcadeStyles.section}>
    <SectionHeader chip="HIGH SCORES" title="LEADERBOARD" sub="Real client wins. No cheat codes." />
    <div style={arcadeStyles.board}>
      <div style={arcadeStyles.boardHead}>
        <div style={{ width: 60 }}>RANK</div>
        <div style={{ width: 90 }}>NAME</div>
        <div style={{ flex: 1 }}>CLIENT</div>
        <div style={{ width: 130 }}>BADGE</div>
        <div style={{ width: 140, textAlign: 'right' }}>METRIC</div>
        <div style={{ width: 110, textAlign: 'right' }}>SCORE</div>
      </div>
      {SCORES.map((s, i) => (
        <div key={s.rank} style={{
          ...arcadeStyles.boardRow,
          borderBottom: i === SCORES.length - 1 ? 'none' : '1px dashed #1f2c44',
          background: i === 0 ? `${YELLOW}0a` : 'transparent',
        }}>
          <div style={{ width: 60, color: i === 0 ? YELLOW : i === 1 ? '#cbd5e1' : i === 2 ? '#d97706' : TEXT_DIM, fontWeight: 700 }}>
            {String(s.rank).padStart(2, '0')}.
          </div>
          <div style={{ width: 90, display: 'flex', alignItems: 'center', gap: 10 }}>
            <PixelIcon kind={s.icon} size={20} color={i === 0 ? YELLOW : GREEN} />
            <span style={{ color: GREEN, fontFamily: '"Press Start 2P", monospace', fontSize: 11 }}>{s.name}</span>
          </div>
          <div style={{ flex: 1, color: TEXT }}>{s.client}</div>
          <div style={{ width: 130 }}>
            <span style={arcadeStyles.boardBadge}>{s.badge}</span>
          </div>
          <div style={{ width: 140, textAlign: 'right', color: GREEN, fontWeight: 600 }}>{s.metric}</div>
          <div style={{ width: 110, textAlign: 'right', color: TEXT, fontFamily: '"Press Start 2P", monospace', fontSize: 12 }}>
            <Ticker to={s.score} />
          </div>
        </div>
      ))}
    </div>
  </section>
);

// ============= POWER-UPS (why us) =============
const POWERS = [
  { icon: 'bolt',     name: 'TURBO MODE',    desc: 'Lightning sites. Sub-1s LCP. Core Web Vitals all green.', color: YELLOW },
  { icon: 'heart',    name: 'EXTRA LIFE',    desc: 'We dont disappear after launch. Monthly optimization included.', color: PINK },
  { icon: 'rocket',   name: 'SPEED BOOST',   desc: 'From kickoff to live in 4–8 weeks. No 6-month sagas.', color: GREEN },
  { icon: 'star',     name: 'POWER STAR',    desc: 'Senior-only crew. No juniors learning on your invoice.', color: CYAN },
];

const PowerUps = () => (
  <section style={arcadeStyles.section}>
    <SectionHeader chip="POWER-UPS" title="WHY KRYDSFELT" sub="The buffs you get when you team up with us." />
    <div style={arcadeStyles.powerGrid} className="arcade-grid-4">
      {POWERS.map(p => (
        <div key={p.name} style={arcadeStyles.powerCard}>
          <div style={{ ...arcadeStyles.powerOrb, background: `${p.color}20`, borderColor: p.color }}>
            <PixelIcon kind={p.icon} size={42} color={p.color} />
          </div>
          <div style={arcadeStyles.powerName}>{p.name}</div>
          <div style={arcadeStyles.powerDesc}>{p.desc}</div>
        </div>
      ))}
    </div>
  </section>
);

// ============= INSERT COIN CTA =============
const Cta = () => (
  <section style={arcadeStyles.cta}>
    <div style={arcadeStyles.ctaScan}></div>
    <div style={arcadeStyles.ctaInner}>
      <div style={arcadeStyles.ctaIconRow}>
        <PixelIcon kind="coin" size={48} />
        <PixelIcon kind="coin" size={48} />
        <PixelIcon kind="coin" size={48} />
      </div>
      <div style={arcadeStyles.ctaChip}>GAME OVER? NOT YET.</div>
      <h2 style={arcadeStyles.ctaTitle}>
        INSERT COIN<br />
        <span style={{ color: GREEN }}>CONTINUE?</span>
      </h2>
      <div style={arcadeStyles.ctaCounter}>
        10 &nbsp; 9 &nbsp; <span style={{ color: PINK }}>8</span> &nbsp; 7 &nbsp; 6 &nbsp; ...
      </div>
      <p style={arcadeStyles.ctaSub}>
        Book a 30-min discovery call. No quarters required.
      </p>
      <div style={arcadeStyles.ctaBtnRow}>
        <button style={arcadeStyles.btnStart}>
          <PixelIcon kind="coin" size={22} />
          <span><Blink>▶</Blink> START NEW GAME</span>
        </button>
        <button style={arcadeStyles.btnGhost}>VIEW CARTRIDGES →</button>
      </div>
      <div style={arcadeStyles.ctaFinePrint}>
        © {new Date().getFullYear()} KRYDSFELT ARCADE · ALL HIGH SCORES PRESERVED
      </div>
    </div>
  </section>
);

// ============= FOOTER =============
const Footer = () => (
  <footer style={arcadeStyles.footer}>
    <div style={arcadeStyles.footerInner}>
      <div style={arcadeStyles.footerCol}>
        <div style={arcadeStyles.footerLogo}>
          <KrydsX size={24} color={GREEN} />
          <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 12, letterSpacing: 2 }}>KRYDSFELT</span>
        </div>
        <div style={arcadeStyles.footerSmall}>The arcade for ambitious bureauer.</div>
      </div>
      <div style={arcadeStyles.footerCol}>
        <div style={arcadeStyles.footerHead}>GAMES</div>
        {['Web Quest', 'Ad Blaster', 'System Raider', 'Conversion Rush'].map(x => (
          <a key={x} href="#" style={arcadeStyles.footerLink}>{x}</a>
        ))}
      </div>
      <div style={arcadeStyles.footerCol}>
        <div style={arcadeStyles.footerHead}>LOBBY</div>
        {['About', 'Cases', 'Career', 'Contact'].map(x => (
          <a key={x} href="#" style={arcadeStyles.footerLink}>{x}</a>
        ))}
      </div>
      <div style={arcadeStyles.footerCol}>
        <div style={arcadeStyles.footerHead}>FIND US</div>
        <div style={arcadeStyles.footerSmall}>hello@krydsfelt.dk</div>
        <div style={arcadeStyles.footerSmall}>+45 00 00 00 00</div>
        <div style={arcadeStyles.footerSmall}>København, DK</div>
      </div>
    </div>
    <div style={arcadeStyles.footerBottom}>
      <span><Blink>●</Blink> 1 PLAYER NOW PLAYING</span>
      <span>PUSH START TO RESTART</span>
    </div>
  </footer>
);

// ============= SECTION HEADER =============
const SectionHeader = ({ chip, title, sub }) => (
  <div style={arcadeStyles.secHead}>
    <div style={arcadeStyles.secChip}>
      <span style={{ color: GREEN }}>◆</span> {chip}
    </div>
    <h2 style={arcadeStyles.secTitle}>{title}</h2>
    <p style={arcadeStyles.secSub}>{sub}</p>
  </div>
);

// ============= APP =============
const App = () => (
  <div style={arcadeStyles.app}>
    <div style={arcadeStyles.scanlinesGlobal}></div>
    <div style={arcadeStyles.vignette}></div>
    <Nav />
    <MarqueeBar />
    <Hero />
    <GameSelect />
    <Levels />
    <PowerUps />
    <HighScores />
    <Cta />
    <Footer />
  </div>
);

// ============= STYLES =============
const arcadeStyles = {
  app: {
    minHeight: '100vh',
    background: NAVY,
    color: TEXT,
    fontFamily: '"VT323", "Courier New", monospace',
    fontSize: 18,
    position: 'relative',
    overflow: 'hidden',
  },
  scanlinesGlobal: {
    position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1000,
    background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)',
    mixBlendMode: 'multiply',
  },
  vignette: {
    position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1001,
    background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)',
  },

  // NAV
  nav: {
    position: 'sticky', top: 0, zIndex: 50,
    background: `${NAVY}f0`, backdropFilter: 'blur(8px)',
    borderBottom: `1px solid #1f2c44`,
  },
  navInner: {
    maxWidth: 1280, margin: '0 auto',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 32px', gap: 32,
  },
  navLogo: { display: 'flex', alignItems: 'center', gap: 12, color: TEXT },
  navLinks: { display: 'flex', gap: 28 },
  navLink: {
    color: TEXT_DIM, textDecoration: 'none', fontSize: 12,
    fontFamily: '"Press Start 2P", monospace', letterSpacing: 1,
    transition: 'color .2s',
  },
  navCoin: {
    display: 'flex', alignItems: 'center', gap: 8,
    color: YELLOW, fontFamily: '"Press Start 2P", monospace', fontSize: 11,
    border: `1px solid ${YELLOW}66`, padding: '8px 14px', borderRadius: 2,
  },

  // MARQUEE
  marqueeBar: {
    background: NAVY_2,
    borderTop: `1px solid #1f2c44`, borderBottom: `1px solid #1f2c44`,
    overflow: 'hidden', padding: '10px 0',
  },
  marqueeTrack: {
    display: 'flex', gap: 48, whiteSpace: 'nowrap',
    animation: 'kfMarquee 50s linear infinite',
  },
  marqueeItem: {
    display: 'inline-flex', alignItems: 'center', gap: 12,
    fontFamily: '"Press Start 2P", monospace', fontSize: 11,
    color: TEXT, letterSpacing: 2,
  },

  // HERO / CABINET
  hero: {
    position: 'relative',
    padding: '80px 32px 100px',
    maxWidth: 1280, margin: '0 auto',
  },
  heroFloat: { position: 'absolute', inset: 0, pointerEvents: 'none' },
  cabinet: {
    position: 'relative',
    margin: '0 auto', maxWidth: 980,
    border: '4px solid #1f2c44',
    borderRadius: 24,
    background: 'linear-gradient(180deg, #0e1a2c 0%, #0a1420 100%)',
    boxShadow: '0 0 0 1px #16263d, 0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
    padding: 28,
  },
  marquee: {
    textAlign: 'center', padding: '20px 0 28px',
    borderBottom: '2px dashed #1f2c44', marginBottom: 24,
  },
  marqueeGlow: {
    display: 'inline-flex', alignItems: 'center', gap: 16,
    filter: `drop-shadow(0 0 16px ${GREEN}80)`,
  },
  marqueeText: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: 38, letterSpacing: 6, color: TEXT,
    textShadow: `0 0 20px ${GREEN}, 0 0 40px ${GREEN}80`,
  },
  marqueeSub: {
    marginTop: 12, color: PINK, letterSpacing: 4,
    fontFamily: '"Press Start 2P", monospace', fontSize: 11,
  },

  screen: {
    background: '#040910',
    border: '3px solid #1a2838',
    borderRadius: 12,
    boxShadow: 'inset 0 0 60px rgba(0,0,0,0.9), inset 0 0 0 2px #000',
    overflow: 'hidden',
    position: 'relative',
  },
  screenInner: { padding: '60px 56px 70px', position: 'relative' },
  scanlines: {
    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
    background: 'repeating-linear-gradient(0deg, rgba(34,197,94,0.04) 0px, rgba(34,197,94,0.04) 2px, transparent 2px, transparent 4px)',
  },
  crt: { position: 'relative', zIndex: 1, textAlign: 'center' },

  heroTagline: {
    color: GREEN, fontFamily: '"Press Start 2P", monospace',
    fontSize: 11, letterSpacing: 4, marginBottom: 24,
    textShadow: `0 0 10px ${GREEN}80`,
  },
  heroTitle: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: 'clamp(28px, 5vw, 56px)',
    lineHeight: 1.4,
    margin: '0 0 28px',
    letterSpacing: 2,
    color: TEXT,
    textShadow: '0 0 1px #000',
  },
  heroSub: {
    color: TEXT_DIM, fontSize: 22, lineHeight: 1.5, margin: '0 0 36px',
    letterSpacing: 1,
  },
  heroCtaRow: { display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 44 },
  heroStatRow: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
    paddingTop: 28, borderTop: '2px dashed #1f2c44',
  },

  // BUTTONS
  btnStart: {
    display: 'inline-flex', alignItems: 'center', gap: 12,
    background: GREEN, color: NAVY,
    border: `3px solid ${GREEN}`,
    boxShadow: `0 5px 0 ${GREEN_DIM}, 0 0 20px ${GREEN}80`,
    padding: '14px 28px',
    fontFamily: '"Press Start 2P", monospace', fontSize: 13, letterSpacing: 2,
    cursor: 'pointer', borderRadius: 4,
    transition: 'transform .1s, box-shadow .1s',
  },
  btnStartPressed: {
    transform: 'translateY(4px)',
    boxShadow: `0 1px 0 ${GREEN_DIM}, 0 0 20px ${GREEN}80`,
  },
  btnGhost: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'transparent', color: TEXT,
    border: '2px solid #1f2c44',
    padding: '14px 28px',
    fontFamily: '"Press Start 2P", monospace', fontSize: 12, letterSpacing: 2,
    cursor: 'pointer', borderRadius: 4,
  },

  // STAT
  stat: { textAlign: 'center' },
  statLabel: { fontFamily: '"Press Start 2P", monospace', fontSize: 9, letterSpacing: 2, marginBottom: 8 },
  statValue: { fontFamily: '"Press Start 2P", monospace', fontSize: 18, letterSpacing: 1 },

  // CONTROLS PANEL
  controls: {
    background: '#0e1a2c',
    borderTop: '3px solid #1a2838',
    padding: '20px 56px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  joystick: {
    width: 70, height: 70, borderRadius: '50%',
    background: '#16263d', border: '3px solid #1a2838',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  btnRow: { display: 'flex', gap: 14 },
  cabBtn: {
    width: 50, height: 50, borderRadius: '50%',
    fontFamily: '"Press Start 2P", monospace', fontSize: 16,
    color: NAVY, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: 'inset 0 -4px 0 rgba(0,0,0,0.3), 0 4px 0 rgba(0,0,0,0.4)',
  },

  // SECTIONS
  section: {
    maxWidth: 1280, margin: '0 auto',
    padding: '100px 32px',
    position: 'relative',
  },
  secHead: { textAlign: 'center', marginBottom: 64, maxWidth: 760, margin: '0 auto 64px' },
  secChip: {
    display: 'inline-flex', gap: 8, alignItems: 'center',
    fontFamily: '"Press Start 2P", monospace', fontSize: 10,
    color: TEXT_DIM, letterSpacing: 3, marginBottom: 20,
    border: '1px solid #1f2c44', padding: '8px 14px', borderRadius: 2,
  },
  secTitle: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: 'clamp(24px, 4vw, 40px)', letterSpacing: 2,
    margin: '0 0 16px', color: TEXT, lineHeight: 1.3,
  },
  secSub: { color: TEXT_DIM, fontSize: 20, lineHeight: 1.5, margin: 0 },

  // GAME GRID
  gameGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20,
  },
  gameCard: {
    background: NAVY_2,
    border: '2px solid #1f2c44', borderRadius: 6,
    padding: 24,
    transition: 'all .25s ease',
    cursor: 'pointer', position: 'relative',
  },
  gameCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  gameCode: { fontFamily: '"Press Start 2P", monospace', fontSize: 10, letterSpacing: 2 },
  gameStatus: { fontFamily: '"Press Start 2P", monospace', fontSize: 9, color: TEXT_DIM, letterSpacing: 1 },
  gameIcon: {
    width: 88, height: 88, borderRadius: 4,
    border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 22px',
  },
  gameName: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: 14, letterSpacing: 2, color: TEXT, marginBottom: 6, textAlign: 'center',
  },
  gameTag: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: 9, letterSpacing: 2, marginBottom: 18, textAlign: 'center',
  },
  gameLines: {
    background: NAVY, borderRadius: 4, padding: '14px 12px',
    border: '1px dashed #1f2c44',
    display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18,
  },
  gameLine: { color: TEXT, fontSize: 16, letterSpacing: 1 },
  gamePlay: { fontFamily: '"Press Start 2P", monospace', fontSize: 9, letterSpacing: 2, textAlign: 'center' },

  // LEVELS
  levelStrip: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
    position: 'relative',
  },
  levelCard: {
    position: 'relative',
    background: NAVY_2, border: '2px solid #1f2c44', borderRadius: 6,
    padding: 24,
  },
  levelTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  levelNum: { fontFamily: '"Press Start 2P", monospace', fontSize: 11, color: GREEN, letterSpacing: 2, textShadow: `0 0 8px ${GREEN}80` },
  levelName: { fontFamily: '"Press Start 2P", monospace', fontSize: 14, color: TEXT, letterSpacing: 1, marginBottom: 16 },
  levelBar: { display: 'flex', gap: 3, marginBottom: 16 },
  levelBlock: { flex: 1, height: 10, borderRadius: 1 },
  levelDesc: { color: TEXT_DIM, fontSize: 17, lineHeight: 1.45 },
  levelArrow: {
    position: 'absolute', right: -18, top: '50%', transform: 'translateY(-50%)',
    color: GREEN, fontSize: 18, fontFamily: '"Press Start 2P", monospace',
    textShadow: `0 0 10px ${GREEN}`,
  },

  // POWER-UPS
  powerGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 },
  powerCard: {
    background: NAVY_2, border: '2px solid #1f2c44', borderRadius: 6,
    padding: 28, textAlign: 'center',
  },
  powerOrb: {
    width: 96, height: 96, borderRadius: '50%', border: '3px solid',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 20px',
    animation: 'kfPulse 2s ease-in-out infinite',
  },
  powerName: { fontFamily: '"Press Start 2P", monospace', fontSize: 13, color: TEXT, letterSpacing: 2, marginBottom: 10 },
  powerDesc: { color: TEXT_DIM, fontSize: 17, lineHeight: 1.5 },

  // SCOREBOARD
  board: {
    background: NAVY_2, border: '2px solid #1f2c44', borderRadius: 6,
    padding: '8px 8px',
  },
  boardHead: {
    display: 'flex', alignItems: 'center', gap: 16,
    padding: '14px 18px',
    fontFamily: '"Press Start 2P", monospace', fontSize: 9,
    color: TEXT_DIM, letterSpacing: 2,
    borderBottom: '2px solid #1f2c44',
  },
  boardRow: {
    display: 'flex', alignItems: 'center', gap: 16,
    padding: '18px',
    fontSize: 18,
  },
  boardBadge: {
    fontFamily: '"Press Start 2P", monospace', fontSize: 9,
    color: GREEN, letterSpacing: 2,
    border: `1px solid ${GREEN}66`, padding: '5px 10px', borderRadius: 2,
  },

  // CTA
  cta: {
    position: 'relative',
    margin: '60px 32px',
    background: 'linear-gradient(180deg, #0e1a2c 0%, #07101c 100%)',
    border: '4px solid #1f2c44', borderRadius: 16,
    padding: '90px 32px 70px', textAlign: 'center',
    overflow: 'hidden',
  },
  ctaScan: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    background: 'repeating-linear-gradient(0deg, rgba(34,197,94,0.04) 0px, rgba(34,197,94,0.04) 2px, transparent 2px, transparent 5px)',
  },
  ctaInner: { position: 'relative', maxWidth: 760, margin: '0 auto' },
  ctaIconRow: { display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 28 },
  ctaChip: {
    fontFamily: '"Press Start 2P", monospace', fontSize: 11,
    color: PINK, letterSpacing: 4, marginBottom: 22,
  },
  ctaTitle: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: 'clamp(28px, 5vw, 52px)', letterSpacing: 3,
    margin: '0 0 28px', color: TEXT, lineHeight: 1.4,
    textShadow: '0 0 30px rgba(34,197,94,0.3)',
  },
  ctaCounter: {
    fontFamily: '"Press Start 2P", monospace', fontSize: 14,
    color: TEXT_DIM, letterSpacing: 6, marginBottom: 24,
  },
  ctaSub: { color: TEXT_DIM, fontSize: 22, marginBottom: 36, lineHeight: 1.5 },
  ctaBtnRow: { display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 },
  ctaFinePrint: {
    fontFamily: '"Press Start 2P", monospace', fontSize: 9,
    color: TEXT_DIM, letterSpacing: 3, marginTop: 16,
  },

  // FOOTER
  footer: {
    background: NAVY_2, borderTop: '1px solid #1f2c44',
    padding: '60px 32px 24px',
  },
  footerInner: {
    maxWidth: 1280, margin: '0 auto',
    display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 40,
  },
  footerCol: { display: 'flex', flexDirection: 'column', gap: 12 },
  footerLogo: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 },
  footerHead: {
    fontFamily: '"Press Start 2P", monospace', fontSize: 10,
    color: GREEN, letterSpacing: 3, marginBottom: 8,
  },
  footerLink: { color: TEXT_DIM, textDecoration: 'none', fontSize: 18, lineHeight: 1.5 },
  footerSmall: { color: TEXT_DIM, fontSize: 17, lineHeight: 1.5 },
  footerBottom: {
    maxWidth: 1280, margin: '40px auto 0',
    paddingTop: 22, borderTop: '1px dashed #1f2c44',
    display: 'flex', justifyContent: 'space-between',
    fontFamily: '"Press Start 2P", monospace', fontSize: 9,
    color: TEXT_DIM, letterSpacing: 3,
  },
};

// MEDIA QUERIES via stylesheet (responsive)
const responsiveCSS = `
@media (max-width: 900px) {
  .game-grid, .level-strip, .power-grid, .footer-inner { grid-template-columns: 1fr 1fr !important; }
  .hero-stat-row { grid-template-columns: repeat(2, 1fr) !important; }
  .nav-links { display: none !important; }
}
@media (max-width: 560px) {
  .game-grid, .level-strip, .power-grid, .footer-inner, .hero-stat-row { grid-template-columns: 1fr !important; }
  .board-row { flex-wrap: wrap !important; gap: 8px !important; }
}
`;

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

import { useState, useMemo } from "react";
import { Search, Gamepad2, X } from "lucide-react";

type Platform = "PSP" | "PS Vita" | "PS2" | "PS3";

interface Game {
  id: number;
  title: string;
  genre: string;
  platform: Platform;
  imageId: string;
  year: number;
}

const GAMES: Game[] = [
  // PSP
  { id: 1, title: "God of War: Chains of Olympus", genre: "Action / Adventure", platform: "PSP", imageId: "1509347528160-9a37ad51d068", year: 2008 },
  { id: 2, title: "Crisis Core: Final Fantasy VII", genre: "Action RPG", platform: "PSP", imageId: "1535016120720-40c0dfd41bb6", year: 2007 },
  { id: 3, title: "Monster Hunter Freedom Unite", genre: "Action RPG", platform: "PSP", imageId: "1542751371-adc8fed8b834", year: 2008 },
  { id: 4, title: "Tekken 6", genre: "Fighting", platform: "PSP", imageId: "1614294149010-950b698f72c0", year: 2009 },
  { id: 5, title: "Patapon 2", genre: "Rhythm / Strategy", platform: "PSP", imageId: "1550745165-9bc0b252726f", year: 2008 },
  { id: 6, title: "Daxter", genre: "Platformer", platform: "PSP", imageId: "1586182987788-9e46a82dc0a2", year: 2006 },
  { id: 7, title: "Gran Turismo PSP", genre: "Racing", platform: "PSP", imageId: "1558618666-fcd25c85cd64", year: 2009 },
  { id: 8, title: "Lumines", genre: "Puzzle", platform: "PSP", imageId: "1531297484001-80022131f5a1", year: 2004 },

  // PS Vita
  { id: 9, title: "Persona 4 Golden", genre: "JRPG", platform: "PS Vita", imageId: "1677446049816-9daa4e0c5b33", year: 2012 },
  { id: 10, title: "Killzone: Mercenary", genre: "First-Person Shooter", platform: "PS Vita", imageId: "1561736778-92e52a7769ef", year: 2013 },
  { id: 11, title: "Gravity Rush", genre: "Action / Adventure", platform: "PS Vita", imageId: "1518020382113-b23696c15fb4", year: 2012 },
  { id: 12, title: "Uncharted: Golden Abyss", genre: "Action / Adventure", platform: "PS Vita", imageId: "1504215680853-026ed2a45def", year: 2011 },
  { id: 13, title: "Dragon's Crown", genre: "Beat-em-up / RPG", platform: "PS Vita", imageId: "1628277613294-3c4b85c26c4a", year: 2013 },
  { id: 14, title: "Tearaway", genre: "Platformer", platform: "PS Vita", imageId: "1595433706420-a1af6b18e53b", year: 2013 },
  { id: 15, title: "Soul Sacrifice Delta", genre: "Action RPG", platform: "PS Vita", imageId: "1616588589240-3eb50fb90e22", year: 2014 },
  { id: 16, title: "Danganronpa: Trigger Happy Havoc", genre: "Visual Novel", platform: "PS Vita", imageId: "1560419015-7c708f8b9114", year: 2010 },

  // PS2
  { id: 17, title: "Shadow of the Colossus", genre: "Action / Adventure", platform: "PS2", imageId: "1518709268805-4e9042af9f23", year: 2005 },
  { id: 18, title: "Kingdom Hearts II", genre: "Action RPG", platform: "PS2", imageId: "1578662996442-48f60103fc96", year: 2005 },
  { id: 19, title: "Grand Theft Auto: San Andreas", genre: "Open World / Action", platform: "PS2", imageId: "1547036967-3b34c8b3c473", year: 2004 },
  { id: 20, title: "Devil May Cry 3", genre: "Action / Hack and Slash", platform: "PS2", imageId: "1519074069444-1ba4fff66d16", year: 2005 },
  { id: 21, title: "Metal Gear Solid 3: Snake Eater", genre: "Stealth / Action", platform: "PS2", imageId: "1563207153-4be887be1f8a", year: 2004 },
  { id: 22, title: "Ico", genre: "Puzzle / Adventure", platform: "PS2", imageId: "1508193638397-1cc4ff75aa9b", year: 2001 },
  { id: 23, title: "Okami", genre: "Action / Adventure", platform: "PS2", imageId: "1603791440384-56cd371ee9a7", year: 2006 },
  { id: 24, title: "God of War II", genre: "Action / Adventure", platform: "PS2", imageId: "1534447677946-8c5e1b16d012", year: 2007 },

  // PS3
  { id: 25, title: "The Last of Us", genre: "Survival / Action", platform: "PS3", imageId: "1509347528160-9a37ad51d068", year: 2013 },
  { id: 26, title: "Uncharted 2: Among Thieves", genre: "Action / Adventure", platform: "PS3", imageId: "1521117184085-f07e0a9dc8c1", year: 2009 },
  { id: 27, title: "Dark Souls", genre: "Action RPG", platform: "PS3", imageId: "1598550476439-6a9abdbdfe53", year: 2011 },
  { id: 28, title: "Metal Gear Solid 4", genre: "Stealth / Action", platform: "PS3", imageId: "1580810734915-86ea8a8df2d0", year: 2008 },
  { id: 29, title: "Demon's Souls", genre: "Action RPG", platform: "PS3", imageId: "1616588589240-3eb50fb90e22", year: 2009 },
  { id: 30, title: "Red Dead Redemption", genre: "Open World / Western", platform: "PS3", imageId: "1603791440384-56cd371ee9a7", year: 2010 },
  { id: 31, title: "Ni no Kuni: Wrath of the White Witch", genre: "JRPG", platform: "PS3", imageId: "1625231946049-e5d8d3cece48", year: 2011 },
  { id: 32, title: "BlazBlue: Calamity Trigger", genre: "Fighting", platform: "PS3", imageId: "1614294149010-950b698f72c0", year: 2008 },
];

const PLATFORMS: Platform[] = ["PSP", "PS Vita", "PS2", "PS3"];

const PLATFORM_COLORS: Record<Platform, { tab: string; badge: string; glow: string }> = {
  PSP:      { tab: "from-blue-600 to-blue-800",    badge: "bg-blue-600/20 text-blue-400 border-blue-500/30",    glow: "shadow-blue-500/20" },
  "PS Vita":{ tab: "from-indigo-600 to-indigo-800", badge: "bg-indigo-600/20 text-indigo-400 border-indigo-500/30", glow: "shadow-indigo-500/20" },
  PS2:      { tab: "from-cyan-600 to-cyan-800",     badge: "bg-cyan-600/20 text-cyan-400 border-cyan-500/30",    glow: "shadow-cyan-500/20" },
  PS3:      { tab: "from-sky-600 to-sky-800",       badge: "bg-sky-600/20 text-sky-400 border-sky-500/30",       glow: "shadow-sky-500/20" },
};

const GENRE_COLORS: Record<string, string> = {
  "Action": "text-red-400",
  "RPG": "text-purple-400",
  "JRPG": "text-purple-400",
  "Racing": "text-yellow-400",
  "Fighting": "text-orange-400",
  "Puzzle": "text-green-400",
  "Platformer": "text-teal-400",
  "Strategy": "text-blue-400",
};

function getGenreColor(genre: string): string {
  for (const [key, color] of Object.entries(GENRE_COLORS)) {
    if (genre.includes(key)) return color;
  }
  return "text-muted-foreground";
}

function GameCard({ game, platform }: { game: Game; platform: Platform }) {
  const colors = PLATFORM_COLORS[platform];
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`group relative bg-card border border-border rounded-lg overflow-hidden
        transition-all duration-300 hover:scale-[1.03] hover:border-primary/40
        hover:shadow-xl ${colors.glow} cursor-pointer`}
    >
      <div className="relative aspect-[3/4] bg-muted overflow-hidden">
        {!imgError ? (
          <img
            src={`https://images.unsplash.com/photo-${game.imageId}?w=400&h=533&fit=crop&auto=format`}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-secondary">
            <Gamepad2 className="w-12 h-12 text-muted-foreground/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-2 right-2">
          <span className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border ${colors.badge}`}>
            {game.year}
          </span>
        </div>
      </div>

      <div className="p-3 space-y-1.5">
        <h3
          className="text-sm font-semibold text-foreground leading-tight line-clamp-2"
          style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.02em" }}
        >
          {game.title}
        </h3>
        <p className={`text-xs font-medium leading-none ${getGenreColor(game.genre)}`}
          style={{ fontFamily: "JetBrains Mono, monospace" }}>
          {game.genre}
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Platform>("PSP");
  const [searches, setSearches] = useState<Record<Platform, string>>({
    PSP: "", "PS Vita": "", PS2: "", PS3: "",
  });

  const filtered = useMemo(() => {
    const q = searches[activeTab].toLowerCase().trim();
    return GAMES.filter(
      (g) =>
        g.platform === activeTab &&
        (q === "" ||
          g.title.toLowerCase().includes(q) ||
          g.genre.toLowerCase().includes(q))
    );
  }, [activeTab, searches]);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        PLATFORMS.map((p) => [p, GAMES.filter((g) => g.platform === p).length])
      ) as Record<Platform, number>,
    []
  );

  const colors = PLATFORM_COLORS[activeTab];

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${colors.tab} shadow-lg`}>
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1
              className="text-xl sm:text-2xl font-bold text-foreground leading-none tracking-wide"
              style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.05em" }}
            >
              RETRO VAULT
            </h1>
            <p className="text-xs text-muted-foreground" style={{ fontFamily: "JetBrains Mono, monospace" }}>
              PlayStation Game Library
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Platform Tabs */}
        <nav className="flex gap-1 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {PLATFORMS.map((p) => {
            const isActive = p === activeTab;
            const c = PLATFORM_COLORS[p];
            return (
              <button
                key={p}
                onClick={() => setActiveTab(p)}
                className={`flex-shrink-0 relative px-4 sm:px-6 py-2.5 rounded-lg text-sm font-semibold
                  transition-all duration-200 flex items-center gap-2 border
                  ${isActive
                    ? `bg-gradient-to-r ${c.tab} text-white border-transparent shadow-lg`
                    : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-border/60"
                  }`}
                style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.06em" }}
              >
                {p}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded font-mono
                    ${isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}
                >
                  {counts[p]}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder={`Search ${activeTab} games by title or genre…`}
            value={searches[activeTab]}
            onChange={(e) =>
              setSearches((prev) => ({ ...prev, [activeTab]: e.target.value }))
            }
            className="w-full bg-secondary border border-border rounded-lg pl-11 pr-10 py-3
              text-sm text-foreground placeholder:text-muted-foreground
              focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30
              transition-all duration-200"
          />
          {searches[activeTab] && (
            <button
              onClick={() => setSearches((prev) => ({ ...prev, [activeTab]: "" }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`text-xs px-2.5 py-1 rounded-full border font-mono ${colors.badge}`}
            >
              {activeTab}
            </span>
            <span className="text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "game" : "games"}
              {searches[activeTab] && (
                <span className="text-muted-foreground/60">
                  {" "}for &quot;{searches[activeTab]}&quot;
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Gallery Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {filtered.map((game) => (
              <GameCard key={game.id} game={game} platform={activeTab} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <div className="p-4 rounded-full bg-secondary border border-border">
              <Search className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              No games found matching &quot;{searches[activeTab]}&quot;
            </p>
            <button
              onClick={() => setSearches((prev) => ({ ...prev, [activeTab]: "" }))}
              className="text-xs text-primary hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border py-6 text-center">
        <p className="text-xs text-muted-foreground" style={{ fontFamily: "JetBrains Mono, monospace" }}>
          RETRO VAULT · {GAMES.length} titles across {PLATFORMS.length} platforms
        </p>
      </footer>
    </div>
  );
}

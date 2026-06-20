import { useState, useMemo, useRef, useEffect } from "react";
import { Search, Gamepad2, X, Heart, Download, Plus, Clock, FolderOpen, ChevronDown, Check, Trash2, ChevronRight, Menu, Settings, Save, Upload, Moon, Sun, Monitor } from "lucide-react";

type Platform = "PSP" | "PS Vita" | "PS2" | "PS3";
type Tab = Platform | "Favourites" | "Recent" | "Collections";

interface Game {
  id: number;
  title: string;
  genre: string;
  platform: Platform;
  imageId: string;
  year: number;
}

interface Collection {
  id: number;
  name: string;
  gameIds: number[];
  createdAt: number;
}

const SEED_GAMES: Game[] = [
  { id: 1,  title: "God of War: Chains of Olympus",        genre: "Action / Adventure",     platform: "PSP",     imageId: "1509347528160-9a37ad51d068", year: 2008 },
  { id: 2,  title: "Crisis Core: Final Fantasy VII",        genre: "Action RPG",             platform: "PSP",     imageId: "1535016120720-40c0dfd41bb6", year: 2007 },
  { id: 3,  title: "Monster Hunter Freedom Unite",          genre: "Action RPG",             platform: "PSP",     imageId: "1542751371-adc8fed8b834",    year: 2008 },
  { id: 4,  title: "Tekken 6",                              genre: "Fighting",               platform: "PSP",     imageId: "1614294149010-950b698f72c0", year: 2009 },
  { id: 5,  title: "Patapon 2",                             genre: "Rhythm / Strategy",      platform: "PSP",     imageId: "1550745165-9bc0b252726f",    year: 2008 },
  { id: 6,  title: "Daxter",                                genre: "Platformer",             platform: "PSP",     imageId: "1586182987788-9e46a82dc0a2", year: 2006 },
  { id: 7,  title: "Gran Turismo PSP",                      genre: "Racing",                 platform: "PSP",     imageId: "1558618666-fcd25c85cd64",    year: 2009 },
  { id: 8,  title: "Lumines",                               genre: "Puzzle",                 platform: "PSP",     imageId: "1531297484001-80022131f5a1", year: 2004 },
  { id: 9,  title: "Persona 4 Golden",                      genre: "JRPG",                   platform: "PS Vita", imageId: "1677446049816-9daa4e0c5b33", year: 2012 },
  { id: 10, title: "Killzone: Mercenary",                   genre: "First-Person Shooter",   platform: "PS Vita", imageId: "1561736778-92e52a7769ef",    year: 2013 },
  { id: 11, title: "Gravity Rush",                          genre: "Action / Adventure",     platform: "PS Vita", imageId: "1518020382113-b23696c15fb4", year: 2012 },
  { id: 12, title: "Uncharted: Golden Abyss",               genre: "Action / Adventure",     platform: "PS Vita", imageId: "1504215680853-026ed2a45def", year: 2011 },
  { id: 13, title: "Dragon's Crown",                        genre: "Beat-em-up / RPG",       platform: "PS Vita", imageId: "1628277613294-3c4b85c26c4a", year: 2013 },
  { id: 14, title: "Tearaway",                              genre: "Platformer",             platform: "PS Vita", imageId: "1595433706420-a1af6b18e53b", year: 2013 },
  { id: 15, title: "Soul Sacrifice Delta",                  genre: "Action RPG",             platform: "PS Vita", imageId: "1616588589240-3eb50fb90e22", year: 2014 },
  { id: 16, title: "Danganronpa: Trigger Happy Havoc",      genre: "Visual Novel",           platform: "PS Vita", imageId: "1560419015-7c708f8b9114",    year: 2010 },
  { id: 17, title: "Shadow of the Colossus",                genre: "Action / Adventure",     platform: "PS2",     imageId: "1518709268805-4e9042af9f23", year: 2005 },
  { id: 18, title: "Kingdom Hearts II",                     genre: "Action RPG",             platform: "PS2",     imageId: "1578662996442-48f60103fc96", year: 2005 },
  { id: 19, title: "Grand Theft Auto: San Andreas",         genre: "Open World / Action",    platform: "PS2",     imageId: "1547036967-3b34c8b3c473",    year: 2004 },
  { id: 20, title: "Devil May Cry 3",                       genre: "Action / Hack and Slash", platform: "PS2",   imageId: "1519074069444-1ba4fff66d16", year: 2005 },
  { id: 21, title: "Metal Gear Solid 3: Snake Eater",       genre: "Stealth / Action",       platform: "PS2",     imageId: "1563207153-4be887be1f8a",    year: 2004 },
  { id: 22, title: "Ico",                                   genre: "Puzzle / Adventure",     platform: "PS2",     imageId: "1508193638397-1cc4ff75aa9b", year: 2001 },
  { id: 23, title: "Okami",                                 genre: "Action / Adventure",     platform: "PS2",     imageId: "1603791440384-56cd371ee9a7", year: 2006 },
  { id: 24, title: "God of War II",                         genre: "Action / Adventure",     platform: "PS2",     imageId: "1534447677946-8c5e1b16d012", year: 2007 },
  { id: 25, title: "The Last of Us",                        genre: "Survival / Action",      platform: "PS3",     imageId: "1509347528160-9a37ad51d068", year: 2013 },
  { id: 26, title: "Uncharted 2: Among Thieves",            genre: "Action / Adventure",     platform: "PS3",     imageId: "1521117184085-f07e0a9dc8c1", year: 2009 },
  { id: 27, title: "Dark Souls",                            genre: "Action RPG",             platform: "PS3",     imageId: "1598550476439-6a9abdbdfe53", year: 2011 },
  { id: 28, title: "Metal Gear Solid 4",                    genre: "Stealth / Action",       platform: "PS3",     imageId: "1580810734915-86ea8a8df2d0", year: 2008 },
  { id: 29, title: "Demon's Souls",                         genre: "Action RPG",             platform: "PS3",     imageId: "1616588589240-3eb50fb90e22", year: 2009 },
  { id: 30, title: "Red Dead Redemption",                   genre: "Open World / Western",   platform: "PS3",     imageId: "1603791440384-56cd371ee9a7", year: 2010 },
  { id: 31, title: "Ni no Kuni: Wrath of the White Witch",  genre: "JRPG",                   platform: "PS3",     imageId: "1625231946049-e5d8d3cece48", year: 2011 },
  { id: 32, title: "BlazBlue: Calamity Trigger",            genre: "Fighting",               platform: "PS3",     imageId: "1614294149010-950b698f72c0", year: 2008 },
];

const SEED_COLLECTIONS: Collection[] = [
  { id: 1, name: "RPG Masterpieces", gameIds: [2, 9, 18, 27, 29, 31], createdAt: Date.now() - 86400000 * 3 },
  { id: 2, name: "Action Legends",   gameIds: [1, 17, 20, 24, 25, 26], createdAt: Date.now() - 86400000 },
];

const PLATFORMS: Platform[] = ["PSP", "PS Vita", "PS2", "PS3"];

const PLATFORM_COLORS: Record<Platform, { grad: string; badge: string; glow: string }> = {
  PSP:       { grad: "from-blue-600 to-blue-800",    badge: "bg-blue-600/20 text-blue-400 border-blue-500/30",     glow: "hover:shadow-blue-500/20" },
  "PS Vita": { grad: "from-indigo-600 to-indigo-800",badge: "bg-indigo-600/20 text-indigo-400 border-indigo-500/30",glow: "hover:shadow-indigo-500/20" },
  PS2:       { grad: "from-cyan-600 to-cyan-800",    badge: "bg-cyan-600/20 text-cyan-400 border-cyan-500/30",     glow: "hover:shadow-cyan-500/20" },
  PS3:       { grad: "from-sky-600 to-sky-800",      badge: "bg-sky-600/20 text-sky-400 border-sky-500/30",        glow: "hover:shadow-sky-500/20" },
};

const GENRE_COLORS: [string, string][] = [
  ["RPG", "text-purple-400"], ["JRPG", "text-purple-400"], ["Racing", "text-yellow-400"],
  ["Fighting", "text-orange-400"], ["Puzzle", "text-green-400"], ["Platformer", "text-teal-400"],
  ["Strategy", "text-blue-400"], ["Stealth", "text-rose-400"], ["Survival", "text-red-400"],
  ["Visual Novel", "text-pink-400"],
];
function genreColor(genre: string) {
  for (const [k, v] of GENRE_COLORS) if (genre.includes(k)) return v;
  return "text-muted-foreground";
}

const GENRES = [
  "Action / Adventure", "Action RPG", "JRPG", "Fighting", "Platformer",
  "Racing", "Puzzle", "Rhythm / Strategy", "Stealth / Action", "Survival / Action",
  "First-Person Shooter", "Visual Novel", "Open World / Action", "Beat-em-up / RPG",
];

// ─── Add Game Dialog ─────────────────────────────────────────────────────────

function AddGameDialog({ onClose, onAdd, nextId }: { onClose: () => void; onAdd: (g: Game) => void; nextId: number }) {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState(GENRES[0]);
  const [platform, setPlatform] = useState<Platform>("PSP");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [imageId, setImageId] = useState("1509347528160-9a37ad51d068");

  const SAMPLE_COVERS = [
    "1509347528160-9a37ad51d068","1535016120720-40c0dfd41bb6","1542751371-adc8fed8b834",
    "1614294149010-950b698f72c0","1550745165-9bc0b252726f","1558618666-fcd25c85cd64",
  ];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ id: nextId, title: title.trim(), genre, platform, imageId, year: Number(year) });
    onClose();
  }

  return (
    <DialogShell onClose={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-md p-6 space-y-5 overflow-y-auto max-h-[90vh]">
        <DialogHeader title="ADD NEW GAME" onClose={onClose} />

        <Field label="Title">
          <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Final Fantasy Tactics"
            className="field-input" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Platform">
            <SelectWrap value={platform} onChange={(v) => setPlatform(v as Platform)}>
              {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
            </SelectWrap>
          </Field>
          <Field label="Year">
            <input type="number" min={1990} max={2030} value={year} onChange={(e) => setYear(e.target.value)}
              className="field-input" />
          </Field>
        </div>

        <Field label="Genre">
          <SelectWrap value={genre} onChange={setGenre}>
            {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
          </SelectWrap>
        </Field>

        <Field label="Cover Art">
          <div className="grid grid-cols-6 gap-1.5">
            {SAMPLE_COVERS.map((id) => (
              <button key={id} type="button" onClick={() => setImageId(id)}
                className={`aspect-[3/4] rounded overflow-hidden border-2 transition-all ${imageId === id ? "border-primary" : "border-transparent opacity-50 hover:opacity-80"}`}>
                <img src={`https://images.unsplash.com/photo-${id}?w=80&h=107&fit=crop&auto=format`} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </Field>

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-all">Cancel</button>
          <button type="submit" className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold tracking-widest hover:bg-primary/90 transition-all" style={{ fontFamily: "Rajdhani, sans-serif" }}>ADD GAME</button>
        </div>
      </form>
    </DialogShell>
  );
}

// ─── Add Collection Dialog ───────────────────────────────────────────────────

function AddCollectionDialog({ games, onClose, onAdd, nextId }: {
  games: Game[];
  onClose: () => void;
  onAdd: (c: Collection) => void;
  nextId: number;
}) {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState<Platform | "All">("All");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return games.filter((g) =>
      (platformFilter === "All" || g.platform === platformFilter) &&
      (q === "" || g.title.toLowerCase().includes(q) || g.genre.toLowerCase().includes(q))
    );
  }, [games, search, platformFilter]);

  function toggle(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || selected.size === 0) return;
    onAdd({ id: nextId, name: name.trim(), gameIds: [...selected], createdAt: Date.now() });
    onClose();
  }

  return (
    <DialogShell onClose={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()}
        className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="p-6 pb-4 border-b border-border">
          <DialogHeader title="NEW COLLECTION" onClose={onClose} />
          <div className="mt-4">
            <Field label="Collection Name">
              <input
                required autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Weekend Warriors, JRPG Marathon…"
                className="field-input"
              />
            </Field>
          </div>
        </div>

        {/* Game picker */}
        <div className="p-6 pt-4 flex flex-col gap-3 flex-1 min-h-0">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Select Games
            </label>
            {selected.size > 0 && (
              <span className="text-xs font-mono text-violet-400 bg-violet-500/15 border border-violet-500/30 px-2 py-0.5 rounded-full">
                {selected.size} selected
              </span>
            )}
          </div>

          {/* Filter row */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search games…"
                className="w-full bg-secondary border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
            <div className="relative">
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value as Platform | "All")}
                className="appearance-none bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 pr-7 transition-all"
              >
                <option value="All">All</option>
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Game list */}
          <div className="overflow-y-auto flex-1 space-y-1 min-h-[200px] max-h-[300px] pr-1">
            {filtered.length === 0 ? (
              <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">No games match</div>
            ) : filtered.map((game) => {
              const isSelected = selected.has(game.id);
              const colors = PLATFORM_COLORS[game.platform];
              return (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => toggle(game.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-150 text-left
                    ${isSelected
                      ? "bg-violet-500/10 border-violet-500/30"
                      : "bg-secondary/50 border-transparent hover:border-border hover:bg-secondary"}`}
                >
                  {/* Cover thumbnail */}
                  <div className="flex-shrink-0 w-8 h-10 rounded overflow-hidden bg-muted">
                    <img
                      src={`https://images.unsplash.com/photo-${game.imageId}?w=64&h=80&fit=crop&auto=format`}
                      alt={game.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                      {game.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[10px] px-1 py-px rounded border font-mono ${colors.badge}`}>{game.platform}</span>
                      <span className={`text-[10px] ${genreColor(game.genre)}`}>{game.genre}</span>
                    </div>
                  </div>

                  {/* Checkbox */}
                  <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                    ${isSelected ? "bg-violet-500 border-violet-500" : "border-border"}`}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-all">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim() || selected.size === 0}
            className="flex-1 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold tracking-widest transition-all"
            style={{ fontFamily: "Rajdhani, sans-serif" }}
          >
            CREATE ({selected.size})
          </button>
        </div>
      </form>
    </DialogShell>
  );
}

// ─── Collection Card ─────────────────────────────────────────────────────────

function CollectionCard({ collection, games, onOpen, onDelete }: {
  collection: Collection;
  games: Game[];
  onOpen: () => void;
  onDelete: () => void;
}) {
  const collGames = games.filter((g) => collection.gameIds.includes(g.id)).slice(0, 4);
  const platforms = [...new Set(games.filter((g) => collection.gameIds.includes(g.id)).map((g) => g.platform))];

  return (
    <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300">
      {/* Cover mosaic */}
      <div className="relative h-32 bg-muted grid grid-cols-4 gap-0.5 cursor-pointer" onClick={onOpen}>
        {collGames.length > 0 ? collGames.map((g) => (
          <div key={g.id} className="overflow-hidden bg-secondary">
            <img
              src={`https://images.unsplash.com/photo-${g.imageId}?w=120&h=128&fit=crop&auto=format`}
              alt={g.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        )) : (
          <div className="col-span-4 flex items-center justify-center">
            <FolderOpen className="w-10 h-10 text-muted-foreground/30" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
        {/* Game count badge */}
        <div className="absolute top-2 right-2">
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-500/20 border border-violet-500/30 text-violet-400">
            {collection.gameIds.length} games
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <button onClick={onOpen} className="text-left flex-1 min-w-0 group/title">
            <h3 className="font-bold text-foreground truncate group-hover/title:text-violet-400 transition-colors"
              style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.03em" }}>
              {collection.name}
            </h3>
          </button>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={onOpen} className="p-1.5 rounded-lg text-muted-foreground hover:text-violet-400 hover:bg-violet-500/10 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Platform pills */}
        <div className="flex flex-wrap gap-1">
          {platforms.map((p) => (
            <span key={p} className={`text-[10px] font-mono px-1.5 py-px rounded border ${PLATFORM_COLORS[p].badge}`}>{p}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Collection Detail View ───────────────────────────────────────────────────

function CollectionDetail({ collection, games, favourites, onBack, onOpenGame, onDelete }: {
  collection: Collection;
  games: Game[];
  favourites: Set<number>;
  onBack: () => void;
  onOpenGame: (g: Game) => void;
  onToggleFav: (id: number) => void;
  onDelete: () => void;
}) {
  const [search, setSearch] = useState("");
  const collGames = useMemo(() => {
    const q = search.toLowerCase();
    return games
      .filter((g) => collection.gameIds.includes(g.id))
      .filter((g) => q === "" || g.title.toLowerCase().includes(q) || g.genre.toLowerCase().includes(q));
  }, [games, collection, search]);

  return (
    <div className="space-y-5">
      {/* Back + title */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-border/60 transition-all">
          <ChevronRight className="w-4 h-4 rotate-180" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-foreground truncate" style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.04em" }}>
              {collection.name}
            </h2>
            <span className="text-xs font-mono text-violet-400 bg-violet-500/15 border border-violet-500/30 px-2 py-0.5 rounded-full flex-shrink-0">
              {collection.gameIds.length} games
            </span>
          </div>
        </div>
        <button onClick={onDelete} className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 border border-border hover:border-red-500/30 transition-all">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Search inside collection */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search in "${collection.name}"…`}
          className="w-full bg-secondary border border-border rounded-lg pl-11 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-sm text-muted-foreground">{collGames.length} {collGames.length === 1 ? "game" : "games"}</p>

      {collGames.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {collGames.map((game) => (
            <GameCard key={game.id} game={game} isFav={favourites.has(game.id)} onClick={() => onOpenGame(game)} />
          ))}
        </div>
      ) : (
        <EmptyState icon={Search} title="No results" sub={`No games match "${search}"`} />
      )}
    </div>
  );
}

// ─── Collections Tab View ─────────────────────────────────────────────────────

function CollectionsView({ collections, games, favourites, onAddCollection, onDeleteCollection, onOpenGame, onToggleFav }: {
  collections: Collection[];
  games: Game[];
  favourites: Set<number>;
  onAddCollection: () => void;
  onDeleteCollection: (id: number) => void;
  onOpenGame: (g: Game) => void;
  onToggleFav: (id: number) => void;
}) {
  const [search, setSearch] = useState("");
  const [openCollection, setOpenCollection] = useState<Collection | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return collections.filter((c) => c.name.toLowerCase().includes(q));
  }, [collections, search]);

  if (openCollection) {
    const live = collections.find((c) => c.id === openCollection.id);
    if (!live) { setOpenCollection(null); return null; }
    return (
      <CollectionDetail
        collection={live}
        games={games}
        favourites={favourites}
        onBack={() => setOpenCollection(null)}
        onOpenGame={onOpenGame}
        onToggleFav={onToggleFav}
        onDelete={() => { onDeleteCollection(live.id); setOpenCollection(null); }}
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search collections by name…"
            className="w-full bg-secondary border border-border rounded-lg pl-11 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={onAddCollection}
          className="flex items-center gap-2 px-4 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold tracking-wider shadow-lg shadow-violet-500/20 transition-all duration-200 active:scale-95 flex-shrink-0"
          style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.05em" }}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">ADD COLLECTION</span>
          <span className="sm:hidden">ADD</span>
        </button>
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "collection" : "collections"}
        {search && <span className="text-muted-foreground/60"> for &quot;{search}&quot;</span>}
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <CollectionCard
              key={c.id}
              collection={c}
              games={games}
              onOpen={() => setOpenCollection(c)}
              onDelete={() => onDeleteCollection(c.id)}
            />
          ))}
        </div>
      ) : collections.length === 0 ? (
        <EmptyState icon={FolderOpen} title="No collections yet" sub='Click "Add Collection" to curate your first list' />
      ) : (
        <EmptyState icon={Search} title="No collections found" sub={`No collection named "${search}"`} />
      )}
    </div>
  );
}

// ─── Game Card ───────────────────────────────────────────────────────────────

function GameCard({ game, isFav, onClick }: { game: Game; isFav: boolean; onClick: () => void }) {
  const colors = PLATFORM_COLORS[game.platform];
  const [imgErr, setImgErr] = useState(false);
  return (
    <div onClick={onClick}
      className={`group relative bg-card border border-border rounded-lg overflow-hidden cursor-pointer
        transition-all duration-300 hover:scale-[1.03] hover:border-primary/40 hover:shadow-xl ${colors.glow}`}>
      <div className="relative aspect-[3/4] bg-muted overflow-hidden">
        {!imgErr ? (
          <img src={`https://images.unsplash.com/photo-${game.imageId}?w=400&h=533&fit=crop&auto=format`}
            alt={game.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgErr(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-secondary">
            <Gamepad2 className="w-10 h-10 text-muted-foreground/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-2 right-2">
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${colors.badge}`}>{game.year}</span>
        </div>
        {isFav && <Heart className="absolute top-2 left-2 w-3.5 h-3.5 text-red-400 fill-current drop-shadow" />}
      </div>
      <div className="p-3 space-y-1">
        <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2"
          style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.02em" }}>{game.title}</h3>
        <p className={`text-[11px] font-medium leading-none ${genreColor(game.genre)}`}
          style={{ fontFamily: "JetBrains Mono, monospace" }}>{game.genre}</p>
      </div>
    </div>
  );
}

// ─── Game Detail Dialog ───────────────────────────────────────────────────────

function GameDialog({ game, isFav, onClose, onToggleFav }: {
  game: Game; isFav: boolean; onClose: () => void; onToggleFav: () => void;
}) {
  const colors = PLATFORM_COLORS[game.platform];
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  function handleDownload() {
    if (downloaded || downloading) return;
    setDownloading(true);
    setTimeout(() => { setDownloading(false); setDownloaded(true); }, 1800);
  }

  return (
    <DialogShell onClose={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="relative h-56 bg-muted overflow-hidden">
          <img src={`https://images.unsplash.com/photo-${game.imageId}?w=600&h=400&fit=crop&auto=format`}
            alt={game.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-colors"><X className="w-4 h-4" /></button>
          <button onClick={onToggleFav}
            className={`absolute top-3 left-3 p-1.5 rounded-lg transition-all duration-200 ${isFav ? "bg-red-500 text-white shadow-lg shadow-red-500/40" : "bg-black/50 hover:bg-black/70 text-white"}`}>
            <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
          </button>
          <div className="absolute bottom-3 left-4">
            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${colors.badge}`}>{game.platform}</span>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-foreground leading-tight" style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.03em" }}>{game.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-medium ${genreColor(game.genre)}`} style={{ fontFamily: "JetBrains Mono, monospace" }}>{game.genre}</span>
              <span className="text-muted-foreground text-xs">·</span>
              <span className="text-xs text-muted-foreground" style={{ fontFamily: "JetBrains Mono, monospace" }}>{game.year}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleDownload} disabled={downloading || downloaded}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300
                ${downloaded ? "bg-green-600/20 border border-green-500/30 text-green-400"
                  : downloading ? "bg-primary/50 text-primary-foreground/60 cursor-wait"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"}`}
              style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.05em" }}>
              <Download className={`w-4 h-4 ${downloading ? "animate-bounce" : ""}`} />
              {downloaded ? "DOWNLOADED" : downloading ? "DOWNLOADING…" : "DOWNLOAD"}
            </button>
            <button onClick={onToggleFav}
              className={`px-4 py-2.5 rounded-lg border transition-all duration-200 ${isFav ? "bg-red-500/20 border-red-500/40 text-red-400" : "border-border text-muted-foreground hover:text-foreground hover:border-border/60"}`}>
              <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </DialogShell>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function DialogShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      {children}
    </div>
  );
}

function DialogHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.05em" }}>{title}</h2>
      <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><X className="w-4 h-4" /></button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}

function SelectWrap({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-all pr-8">
        {children}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
    </div>
  );
}

function EmptyState({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-3">
      <div className="p-4 rounded-full bg-secondary border border-border">
        <Icon className="w-6 h-6 text-muted-foreground" />
      </div>
      <p className="text-foreground text-sm font-semibold" style={{ fontFamily: "Rajdhani, sans-serif" }}>{title}</p>
      <p className="text-muted-foreground text-xs text-center max-w-xs">{sub}</p>
    </div>
  );
}

// ─── Settings Dialog ─────────────────────────────────────────────────────────

type ThemeMode = "dark" | "light" | "system";

interface AppSettings {
  theme: ThemeMode;
  showGenre: boolean;
  showYear: boolean;
  compactGrid: boolean;
  notifications: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: "dark",
  showGenre: true,
  showYear: true,
  compactGrid: false,
  notifications: true,
};

function SettingsDialog({ settings, onClose, onSave }: {
  settings: AppSettings;
  onClose: () => void;
  onSave: (s: AppSettings) => void;
}) {
  const [local, setLocal] = useState<AppSettings>({ ...settings });
  const set = <K extends keyof AppSettings>(k: K, v: AppSettings[K]) =>
    setLocal((prev) => ({ ...prev, [k]: v }));

  const THEME_OPTIONS: { value: ThemeMode; label: string; icon: React.ElementType }[] = [
    { value: "dark",   label: "Dark",   icon: Moon },
    { value: "light",  label: "Light",  icon: Sun },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <DialogShell onClose={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{ fontFamily: "Outfit, sans-serif" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Settings className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.05em" }}>
              SETTINGS
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* Theme */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Appearance</p>
            <div className="grid grid-cols-3 gap-2">
              {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button key={value} onClick={() => set("theme", value)}
                  className={`flex flex-col items-center gap-2 py-3 rounded-lg border transition-all duration-200
                    ${local.theme === value
                      ? "bg-primary/10 border-primary/40 text-primary"
                      : "bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-border/60"}`}>
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Display toggles */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Gallery Display</p>
            <div className="space-y-1">
              {([
                { key: "showGenre",   label: "Show genre label",   sub: "Display genre below game title" },
                { key: "showYear",    label: "Show release year",  sub: "Badge on each game cover" },
                { key: "compactGrid", label: "Compact grid",       sub: "Smaller cards, more per row" },
                { key: "notifications", label: "Notifications",    sub: "Download and activity alerts" },
              ] as const).map(({ key, label, sub }) => (
                <div key={key} className="flex items-center justify-between px-4 py-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                  <div>
                    <p className="text-sm text-foreground font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                  <button onClick={() => set(key, !local[key] as AppSettings[typeof key])}
                    className={`relative w-10 h-5.5 rounded-full border transition-all duration-200 flex-shrink-0
                      ${local[key] ? "bg-primary border-primary" : "bg-muted border-border"}`}
                    style={{ height: "22px", width: "40px" }}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200
                      ${local[key] ? "translate-x-[19px]" : "translate-x-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-border">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-all">
            Cancel
          </button>
          <button onClick={() => { onSave(local); onClose(); }}
            className="flex-1 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold tracking-wider transition-all"
            style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.05em" }}>
            SAVE
          </button>
        </div>
      </div>
    </DialogShell>
  );
}

// ─── Backup / Restore helpers ─────────────────────────────────────────────────

interface BackupPayload {
  version: 1;
  exportedAt: string;
  games: Game[];
  collections: Collection[];
  favourites: number[];
  recentIds: number[];
}

function createBackup(data: Omit<BackupPayload, "version" | "exportedAt">): string {
  const payload: BackupPayload = { version: 1, exportedAt: new Date().toISOString(), ...data };
  return JSON.stringify(payload, null, 2);
}

function parseBackup(raw: string): BackupPayload {
  const parsed = JSON.parse(raw);
  if (parsed.version !== 1) throw new Error("Unsupported backup version");
  if (!Array.isArray(parsed.games) || !Array.isArray(parsed.collections)) throw new Error("Invalid backup structure");
  return parsed as BackupPayload;
}

// ─── Toast ───────────────────────────────────────────────────────────────────

interface ToastMsg { id: number; text: string; type: "success" | "error" | "info" }

function Toast({ toasts }: { toasts: ToastMsg[] }) {
  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id}
          className={`px-4 py-3 rounded-xl border text-sm font-medium shadow-xl backdrop-blur flex items-center gap-2 pointer-events-auto
            ${t.type === "success" ? "bg-green-900/90 border-green-500/40 text-green-300"
            : t.type === "error"   ? "bg-red-900/90 border-red-500/40 text-red-300"
            :                        "bg-card border-border text-foreground"}`}>
          {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"} {t.text}
        </div>
      ))}
    </div>
  );
}

// ─── Hamburger Menu ───────────────────────────────────────────────────────────

function HamburgerMenu({ onSettings, onBackup, onRestore }: {
  onSettings: () => void;
  onBackup: () => void;
  onRestore: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const ITEMS = [
    {
      icon: Settings, label: "Settings", sub: "Theme & display preferences",
      color: "text-blue-400", bg: "hover:bg-blue-500/10",
      action: () => { setOpen(false); onSettings(); },
    },
    {
      icon: Save, label: "Backup Library", sub: "Export your games & collections",
      color: "text-emerald-400", bg: "hover:bg-emerald-500/10",
      action: () => { setOpen(false); onBackup(); },
    },
    {
      icon: Upload, label: "Restore Backup", sub: "Import from a .json backup file",
      color: "text-amber-400", bg: "hover:bg-amber-500/10",
      action: () => { setOpen(false); onRestore(); },
    },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200
          ${open
            ? "bg-secondary border-primary/40 text-foreground"
            : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-border/60"}`}
      >
        {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-40"
          style={{ fontFamily: "Outfit, sans-serif" }}>

          {/* Arrow tip */}
          <div className="absolute -top-1.5 right-3 w-3 h-3 bg-card border-l border-t border-border rotate-45" />

          <div className="p-1.5">
            {ITEMS.map(({ icon: Icon, label, sub, color, bg, action }, i) => (
              <button
                key={i}
                onClick={action}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-150 text-left group ${bg}`}
              >
                <div className={`flex-shrink-0 p-2 rounded-lg bg-secondary border border-border group-hover:border-current/20 transition-colors`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0 ml-auto" />
              </button>
            ))}
          </div>

          <div className="px-4 py-2.5 border-t border-border bg-secondary/30">
            <p className="text-[10px] text-muted-foreground/60 text-center" style={{ fontFamily: "JetBrains Mono, monospace" }}>
              RETRO VAULT v1.0
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

const SPECIAL_TABS = ["Favourites", "Recent", "Collections"] as const;
const ALL_TABS: Tab[] = [...PLATFORMS, ...SPECIAL_TABS];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("PSP");
  const [games, setGames] = useState<Game[]>(SEED_GAMES);
  const [collections, setCollections] = useState<Collection[]>(SEED_COLLECTIONS);
  const [searches, setSearches] = useState<Record<string, string>>(Object.fromEntries(ALL_TABS.map((t) => [t, ""])));
  const [favourites, setFavourites] = useState<Set<number>>(new Set([1, 9, 17, 25]));
  const [recentIds, setRecentIds] = useState<number[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showAddGame, setShowAddGame] = useState(false);
  const [showAddCollection, setShowAddCollection] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [appSettings, setAppSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const gameNextId = useRef(SEED_GAMES.length + 1);
  const collNextId = useRef(SEED_COLLECTIONS.length + 1);
  const restoreInputRef = useRef<HTMLInputElement>(null);
  const toastIdRef = useRef(0);

  function showToast(text: string, type: ToastMsg["type"] = "info") {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }

  function handleBackup() {
    const json = createBackup({
      games,
      collections,
      favourites: [...favourites],
      recentIds,
    });
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `retrovault-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Backup downloaded successfully", "success");
  }

  function handleRestoreClick() {
    restoreInputRef.current?.click();
  }

  function handleRestoreFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const payload = parseBackup(ev.target?.result as string);
        setGames(payload.games);
        setCollections(payload.collections);
        setFavourites(new Set(payload.favourites));
        setRecentIds(payload.recentIds);
        gameNextId.current = Math.max(...payload.games.map((g) => g.id), 0) + 1;
        collNextId.current = Math.max(...payload.collections.map((c) => c.id), 0) + 1;
        showToast(`Restored ${payload.games.length} games & ${payload.collections.length} collections`, "success");
      } catch {
        showToast("Invalid backup file — restore failed", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function openGame(game: Game) {
    setSelectedGame(game);
    setRecentIds((prev) => [game.id, ...prev.filter((id) => id !== game.id)].slice(0, 20));
  }

  function toggleFav(id: number) {
    setFavourites((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function addGame(game: Game) { setGames((prev) => [...prev, game]); gameNextId.current += 1; }

  function addCollection(c: Collection) { setCollections((prev) => [...prev, c]); collNextId.current += 1; }

  function deleteCollection(id: number) { setCollections((prev) => prev.filter((c) => c.id !== id)); }

  const q = searches[activeTab]?.toLowerCase().trim() ?? "";

  const displayedGames = useMemo(() => {
    let pool: Game[] = [];
    if (activeTab === "Favourites") pool = games.filter((g) => favourites.has(g.id));
    else if (activeTab === "Recent") {
      const map = new Map(games.map((g) => [g.id, g]));
      pool = recentIds.map((id) => map.get(id)).filter(Boolean) as Game[];
    } else if (activeTab === "Collections") pool = [];
    else pool = games.filter((g) => g.platform === activeTab);
    if (!q || activeTab === "Collections") return pool;
    return pool.filter((g) => g.title.toLowerCase().includes(q) || g.genre.toLowerCase().includes(q));
  }, [activeTab, games, favourites, recentIds, q]);

  const platformCounts = useMemo(
    () => Object.fromEntries(PLATFORMS.map((p) => [p, games.filter((g) => g.platform === p).length])) as Record<Platform, number>,
    [games]
  );

  const tabMeta: Record<Tab, { icon?: React.ElementType; count: number }> = {
    PSP:         { count: platformCounts.PSP },
    "PS Vita":   { count: platformCounts["PS Vita"] },
    PS2:         { count: platformCounts.PS2 },
    PS3:         { count: platformCounts.PS3 },
    Favourites:  { icon: Heart,      count: favourites.size },
    Recent:      { icon: Clock,      count: recentIds.length },
    Collections: { icon: FolderOpen, count: collections.length },
  };

  function platformTabStyle(p: Platform) {
    const isActive = p === activeTab;
    const c = PLATFORM_COLORS[p];
    return isActive
      ? `bg-gradient-to-r ${c.grad} text-white border-transparent shadow-lg`
      : "bg-card text-muted-foreground border-border hover:text-foreground";
  }

  const searchPlaceholder =
    activeTab === "Favourites"  ? "Search favourites…" :
    activeTab === "Recent"      ? "Search recent…" :
    activeTab === "Collections" ? "Search collections…" :
    `Search ${activeTab} games by title or genre…`;

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold leading-none tracking-wide text-foreground"
                style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.05em" }}>RETRO VAULT</h1>
              <p className="text-[11px] text-muted-foreground" style={{ fontFamily: "JetBrains Mono, monospace" }}>PlayStation Game Library</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowAddGame(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 transition-all duration-200 active:scale-95"
              style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.05em" }}>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">ADD GAME</span>
              <span className="sm:hidden">ADD</span>
            </button>
            <HamburgerMenu
              onSettings={() => setShowSettings(true)}
              onBackup={handleBackup}
              onRestore={handleRestoreClick}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* ── Platform tabs ── */}
        <nav className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
          {PLATFORMS.map((p) => (
            <button key={p} onClick={() => setActiveTab(p)}
              className={`flex-shrink-0 px-4 sm:px-5 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 flex items-center gap-2 ${platformTabStyle(p)}`}
              style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.06em" }}>
              {p}
              <span className={`text-[11px] px-1.5 py-0.5 rounded font-mono ${activeTab === p ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                {tabMeta[p].count}
              </span>
            </button>
          ))}
        </nav>

        {/* ── Special tabs ── */}
        <nav className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
          {SPECIAL_TABS.map((t) => {
            const { icon: Icon, count } = tabMeta[t];
            const isActive = activeTab === t;
            const activeStyle =
              t === "Favourites"  ? "bg-red-500/15 border-red-500/30 text-red-400" :
              t === "Recent"      ? "bg-amber-500/15 border-amber-500/30 text-amber-400" :
              "bg-violet-500/15 border-violet-500/30 text-violet-400";
            return (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 flex items-center gap-2
                  ${isActive ? activeStyle : "bg-card text-muted-foreground border-border hover:text-foreground"}`}>
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {t}
                <span className={`text-[11px] px-1.5 py-0.5 rounded font-mono ${isActive ? "bg-current/10 opacity-80" : "bg-muted text-muted-foreground"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </nav>

        {/* ── Collections tab renders its own view ── */}
        {activeTab === "Collections" ? (
          <CollectionsView
            collections={collections}
            games={games}
            favourites={favourites}
            onAddCollection={() => setShowAddCollection(true)}
            onDeleteCollection={deleteCollection}
            onOpenGame={openGame}
            onToggleFav={toggleFav}
          />
        ) : (
          <>
            {/* ── Search ── */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searches[activeTab]}
                onChange={(e) => setSearches((prev) => ({ ...prev, [activeTab]: e.target.value }))}
                className="w-full bg-secondary border border-border rounded-lg pl-11 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200"
              />
              {searches[activeTab] && (
                <button onClick={() => setSearches((prev) => ({ ...prev, [activeTab]: "" }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* ── Meta ── */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{displayedGames.length} {displayedGames.length === 1 ? "game" : "games"}{q && <span className="text-muted-foreground/60"> for &quot;{q}&quot;</span>}</span>
              {activeTab === "Favourites" && favourites.size === 0 && <span className="text-xs italic text-muted-foreground/60">Open a game card and tap the heart icon</span>}
              {activeTab === "Recent"     && recentIds.length === 0  && <span className="text-xs italic text-muted-foreground/60">Click a game card to track it here</span>}
            </div>

            {/* ── Grid ── */}
            {displayedGames.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {displayedGames.map((game) => (
                  <GameCard key={game.id} game={game} isFav={favourites.has(game.id)} onClick={() => openGame(game)} />
                ))}
              </div>
            ) : (
              activeTab === "Favourites" ? <EmptyState icon={Heart} title="No favourites yet" sub="Click a game card and press the heart to save it here" /> :
              activeTab === "Recent"     ? <EmptyState icon={Clock} title="No recent games" sub="Games you open will appear here" /> :
                                           <EmptyState icon={Search} title="No results" sub={`No ${activeTab} games match "${q}"`} />
            )}
          </>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="mt-16 border-t border-border py-6 text-center">
        <p className="text-xs text-muted-foreground" style={{ fontFamily: "JetBrains Mono, monospace" }}>
          RETRO VAULT · {games.length} titles · {collections.length} collections · {favourites.size} favourites
        </p>
      </footer>

      {/* ── Dialogs ── */}
      {selectedGame && (
        <GameDialog game={selectedGame} isFav={favourites.has(selectedGame.id)}
          onClose={() => setSelectedGame(null)} onToggleFav={() => toggleFav(selectedGame.id)} />
      )}
      {showAddGame && (
        <AddGameDialog onClose={() => setShowAddGame(false)} onAdd={addGame} nextId={gameNextId.current} />
      )}
      {showAddCollection && (
        <AddCollectionDialog games={games} onClose={() => setShowAddCollection(false)} onAdd={addCollection} nextId={collNextId.current} />
      )}
      {showSettings && (
        <SettingsDialog settings={appSettings} onClose={() => setShowSettings(false)} onSave={setAppSettings} />
      )}

      {/* Hidden restore file input */}
      <input
        ref={restoreInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleRestoreFile}
      />

      <Toast toasts={toasts} />
    </div>
  );
}

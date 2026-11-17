// Fixture generators (pure functions). Server API eta use kore matches banay.

export type NewMatch = {
  id: string;
  stage: string;
  round_no: number;
  match_no: number;
  home_entry_id: string | null;
  away_entry_id: string | null;
  status: "scheduled" | "completed";
  winner_entry_id: string | null;
  next_match_id: string | null;
  next_slot: "home" | "away" | null;
};

const uuid = () => globalThis.crypto.randomUUID();

export function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function stageName(teamsInRound: number): string {
  switch (teamsInRound) {
    case 2:
      return "Final";
    case 4:
      return "Semi-final";
    case 8:
      return "Quarter-final";
    case 16:
      return "Round of 16";
    case 32:
      return "Round of 32";
    default:
      return `Round of ${teamsInRound}`;
  }
}

// size=8 -> [1,8,4,5,2,7,3,6]  (1 vs 8, 4 vs 5, 2 vs 7, 3 vs 6)
export function seedOrder(size: number): number[] {
  let order = [1, 2];
  while (order.length < size) {
    const total = order.length * 2 + 1;
    const next: number[] = [];
    for (const s of order) next.push(s, total - s);
    order = next;
  }
  return order;
}

// Single elimination. entryIds seed order e dao (1st = top seed). Bye gulo top seed ra pay.
export function generateKnockout(entryIds: string[]): NewMatch[] {
  const n = entryIds.length;
  if (n < 2) throw new Error("Knockout er jonno kom ponche 2 ta entry lagbe.");

  let size = 2;
  while (size < n) size *= 2;
  const rounds = Math.log2(size);
  const order = seedOrder(size);
  const slots: (string | null)[] = order.map((seed) => (seed <= n ? entryIds[seed - 1] : null));

  // round -> matches
  const byRound: NewMatch[][] = [];
  for (let r = 1; r <= rounds; r++) {
    const count = size / 2 ** r;
    const teamsInRound = size / 2 ** (r - 1);
    const list: NewMatch[] = [];
    for (let k = 0; k < count; k++) {
      list.push({
        id: uuid(),
        stage: stageName(teamsInRound),
        round_no: r,
        match_no: k + 1,
        home_entry_id: r === 1 ? slots[2 * k] : null,
        away_entry_id: r === 1 ? slots[2 * k + 1] : null,
        status: "scheduled",
        winner_entry_id: null,
        next_match_id: null,
        next_slot: null,
      });
    }
    byRound.push(list);
  }

  // next links
  for (let r = 0; r < rounds - 1; r++) {
    byRound[r].forEach((m, k) => {
      const next = byRound[r + 1][Math.floor(k / 2)];
      m.next_match_id = next.id;
      m.next_slot = k % 2 === 0 ? "home" : "away";
    });
  }

  // byes: ekta side null hole onno side auto-advance
  for (const m of byRound[0]) {
    const only = m.home_entry_id && !m.away_entry_id ? m.home_entry_id : !m.home_entry_id && m.away_entry_id ? m.away_entry_id : null;
    if (!only) continue;
    m.status = "completed";
    m.winner_entry_id = only;
    const next = byRound[1]?.find((x) => x.id === m.next_match_id);
    if (next) {
      if (m.next_slot === "home") next.home_entry_id = only;
      else next.away_entry_id = only;
    }
  }

  return byRound.flat();
}

// Round-robin (circle method). rounds=2 hole home/away dui leg.
export function generateLeague(entryIds: string[], rounds: 1 | 2 = 1): NewMatch[] {
  if (entryIds.length < 2) throw new Error("League er jonno kom ponche 2 ta entry lagbe.");

  const list: (string | null)[] = [...entryIds];
  if (list.length % 2 === 1) list.push(null);
  const n = list.length;
  const matchdays = n - 1;
  const out: NewMatch[] = [];

  let arr = [...list];
  for (let r = 0; r < matchdays; r++) {
    let no = 1;
    for (let i = 0; i < n / 2; i++) {
      const a = arr[i];
      const b = arr[n - 1 - i];
      if (!a || !b) continue;
      const [home, away] = r % 2 === 0 ? [a, b] : [b, a];
      out.push(mk(`Matchday ${r + 1}`, r + 1, no++, home, away));
    }
    arr = [arr[0], arr[n - 1], ...arr.slice(1, n - 1)];
  }

  if (rounds === 2) {
    const first = [...out];
    for (const m of first) {
      const md = m.round_no + matchdays;
      out.push(mk(`Matchday ${md}`, md, m.match_no, m.away_entry_id, m.home_entry_id));
    }
  }
  return out;
}

function mk(stage: string, round_no: number, match_no: number, home: string | null, away: string | null): NewMatch {
  return {
    id: uuid(),
    stage,
    round_no,
    match_no,
    home_entry_id: home,
    away_entry_id: away,
    status: "scheduled",
    winner_entry_id: null,
    next_match_id: null,
    next_slot: null,
  };
}

export function slugify(text: string): string {
  const base = text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
  return base || `tournament-${Date.now().toString(36)}`;
}

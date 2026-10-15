// Hub Contract rule 7: builds the results of finished games in the shared format.
// You do NOT need to change this file. Your work is in results.repository.js.
const resultsRepository = require('../repositories/results.repository');

// Ranks completed players by score. Equal scores share a rank: 1, 1, 3 ...
function rankPlayers(players) {
  const sorted = [...players].sort((a, b) => b.score - a.score || a.nickname.localeCompare(b.nickname));
  let rank = 0;
  let previous = null;
  let seen = 0;
  return sorted.map((player) => {
    if (player.completed) {
      seen += 1;
      if (player.score !== previous) rank = seen;
      previous = player.score;
    }
    return { ...player, rank: player.completed ? rank : null };
  });
}

async function listFinishedGames(since) {
  const rows = await resultsRepository.findFinishedGamePlayers(since);

  // One entry per finished game, in the order the games ended.
  const games = new Map();
  for (const row of rows) {
    if (!games.has(row.session_code)) {
      games.set(row.session_code, {
        session_code: String(row.session_code),
        started_at: row.started_at ? new Date(row.started_at).toISOString() : null,
        ended_at: new Date(row.ended_at).toISOString(),
        players: [],
      });
    }
    games.get(row.session_code).players.push({
      school_id: String(row.school_id),
      nickname: String(row.nickname),
      score: Number(row.score),
      completed: Boolean(row.completed),
    });
  }

  return [...games.values()]
    .sort((a, b) => a.ended_at.localeCompare(b.ended_at))
    .map((game) => {
      const players = rankPlayers(game.players);
      const podium = players
        .filter((p) => p.rank !== null && p.rank <= 3)
        .map(({ rank, school_id: schoolId, nickname, score }) => ({ rank, school_id: schoolId, nickname, score }));
      return { ...game, players, podium };
    });
}

module.exports = { listFinishedGames, rankPlayers };

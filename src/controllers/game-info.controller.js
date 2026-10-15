const gameInfo = require('../config/game-info');

function getGameInfo(req, res) {
  res.status(200).json(gameInfo);
}

module.exports = { getGameInfo };

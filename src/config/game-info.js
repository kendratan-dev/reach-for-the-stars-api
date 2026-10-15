// What the Library Game Hub shows about YOUR game (Hub Contract, rule 1).
// Lab Step 6: replace every CHANGE_ME value with your own.
const pkg = require('../../package.json');

module.exports = {
  slug: 'reach-for-the-stars',            // your group's game, lower case with hyphens, for example shelf-climb
  name: 'Reach for the Stars',            // the name players will see
  team: '5' (3-1),            // your group's name and section, for example Bookworms (3-1)
  developer: 'kendratan-dev',       // YOUR GitHub username: this build is yours
  description: 'Reach for the Stars is a library-hosted multiplayer trivia tournament where players independently answer educational questions, earn stars, use strategic mystery-chest rewards, and compete to finish with the highest score before the round timer ends. (CS 313 Software Engineering 1)',
  min_players: 1,               // change to the limits your game is designed for
  max_players: 30,
  version: pkg.version,         // read from package.json, do not edit here
};

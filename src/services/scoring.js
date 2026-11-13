function pointsFor(question, isCorrect, elapsedMs) {
  if (!isCorrect) return 0;

  const base = Number(question?.points_base ?? 1000);
  const limitSec = Number(question?.time_limit_sec ?? 20);
  const limitMs = limitSec * 1000;

  if (elapsedMs < 0 || elapsedMs > limitMs) return 0;

  return Math.round(base * (1 - elapsedMs / (2 * limitMs)));
}

module.exports = { pointsFor };
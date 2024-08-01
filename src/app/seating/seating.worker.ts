/// <reference lib="webworker" />

import { generateRounds } from 'good-enough-golfer';

addEventListener('message', ({ data }) => {
  const results = generateRounds(data);
  postMessage(results);
});

export function randomElement<T>(elements: T[]): T {
  const length = elements.length;
  const i = Math.floor(Math.random() * length);
  return elements[i];
}

// "Fisher-Yates Shuffle Algorithm"
// http://Bost.Ocks.org/mike/shuffle/
export function shuffle<T>(array: T[], modify: boolean = true): T[] {
  array = modify ? array : array.slice();
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

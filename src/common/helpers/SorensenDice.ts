// Sorensen Dice coefficient implementation
export function SorensenDiceCoefficient(s1: string, s2: string) {
  if (s1 === s2) return 1;
  if (s1.length > s2.length) {
    let swap = s2;
    s2 = s1;
    s1 = swap;
  }
  let length1 = s1.length, length2 = s2.length;
  let i = 0, j = 0;

  const space = ' '.charCodeAt(0);
  const arr1 = new Int32Array(length1);
  const arr2 = new Int32Array(length2);
  let k = 0;
  while (i < length1 - 1) {
    const firstChar = s1.charCodeAt(i);
    const secondChar = s1.charCodeAt(++i);
    if (firstChar === space || secondChar === space) continue;
    arr1[k++] = (firstChar << 16) | secondChar;
  }
  length1 = k;
  k = 0;
  while (j < length2 - 1) {
    const firstChar = s2.charCodeAt(j);
    const secondChar = s2.charCodeAt(++j);
    if (firstChar === space || secondChar === space) continue;
    arr2[k++] = (firstChar << 16) | secondChar;
  }
  i = 0;
  length2 = k;
  k = 0;
  while (i < length1) {
    j = 0;
    while (j < length2) {
      if (arr1[i] === arr2[j++]) {
        k += 2;
      }
    }
    i++;
  }
  return k / (length1 + length2);
}

export const suggestedThreshold = 0.8;
export const minimumThreshold = 0.6;

export function SorensenCompare(s1: string, s2: string, threshold = suggestedThreshold) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  if (s2.length > 4 && s2.includes(s1) || s1.includes(s2)) {
    return true;
  }
  return SorensenDiceCoefficient(s1, s2) >= threshold;
}

export function SorensenFilter(s1: string, s2s: string[], threshold = suggestedThreshold) {
  const indexes = s2s.map((v, i) => i);
  return indexes.filter(i => SorensenCompare(s1, s2s[i], threshold));
}


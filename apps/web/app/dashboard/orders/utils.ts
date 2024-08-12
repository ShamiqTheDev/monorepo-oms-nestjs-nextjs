export function getKeyByValue<T extends object>(enumerator: T, value: string) {
  const indexOfS = Object.values(enumerator).indexOf(value as unknown as T);
  const key = Object.keys(enumerator)[indexOfS];

  return key;
}


export const extractIdsFromTag = (tag: string) => {
  const regex = /<@([^>]+)>/g;
  const matches = tag.matchAll(regex);

  const ids: string[] = [];

  for (const match of matches) {
    ids.push(match[1]);
  }

  return ids;
};

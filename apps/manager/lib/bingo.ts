import { StreamerItemsFromApi } from "./api/types";
import { setBingoCookie } from "./cookie";

const getAbility = <Abilities extends StreamerItemsFromApi[]>(
  abilities: Abilities
) => {
  const index = parseInt(`${Math.random() * abilities.length}`);
  const ability = abilities.splice(index, 1);
  return ability[0];
};

const createAbility = <Abilities extends []>(abilities: Abilities) => {
  const ability = getAbility(abilities);
  return ability;
};

const createBingoRow = <Abilities extends []>(
  nColumns: number,
  abilities: Abilities
) => {
  const bingoRow = [];
  for (let i = 0; i < nColumns; i++) bingoRow.push(createAbility(abilities));

  return bingoRow;
};

export const createBingo = (nRows: number, nColumns: number, abilities: []) => {
  const bingo = [];
  for (let i = 0; i < nRows; i++)
    bingo.push(createBingoRow(nColumns, abilities));
  return bingo;
};

export const markStreamerSelectedItems = (
  bingo: ReturnType<typeof createBingo>,
  markedOptions: any,
  expires: string
) => {
  const markedBingo = [...bingo];
  const isItemChecked = (item: { id: number }) =>
    markedOptions.find(
      (markedOption: { id: number }) => markedOption.id === item.id
    ).marked;
  bingo.forEach((row, rowIdx) => {
    row.forEach((item, columnIdx) => {
      if (isItemChecked(item)) {
        markedBingo[rowIdx][columnIdx] = { ...item, marked: true };
        return;
      }
      markedBingo[rowIdx][columnIdx] = { ...item };
    });
  });
  setBingoCookie(JSON.stringify(markedBingo), expires);
  return markedBingo;
};

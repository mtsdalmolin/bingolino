import { setBingoCookie } from "./cookie";

const getAbility = <Abilities extends { name: string }[]>(
  abilities: Abilities
) => {
  const index = parseInt(`${Math.random() * abilities.length}`);
  const ability = abilities.splice(index, 1);
  return ability[0].name;
};

const createAbility = <Abilities extends []>(
  abilities: Abilities,
  marked?: boolean
) => {
  return { text: getAbility(abilities), marked: marked ?? false };
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
  markedOptions: any
) => {
  const markedBingo = [...bingo];
  const isItemChecked = (itemName: string) =>
    markedOptions.find(
      (markedOption: { itemName: string }) => markedOption.itemName === itemName
    );
  bingo.forEach((row, rowIdx) => {
    row.forEach((item, columnIdx) => {
      if (isItemChecked(item.text)) {
        markedBingo[rowIdx][columnIdx] = { ...item, marked: true };
        return;
      }
      markedBingo[rowIdx][columnIdx] = { ...item };
    });
  });
  setBingoCookie(JSON.stringify(markedBingo));
  return markedBingo;
};

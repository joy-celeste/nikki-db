import { Character } from 'models/Character';
import { Item, NIKKIS_PINKY } from 'models/Item';

export type EditorState = {
  loadedItems: Item[],
  useSubtypeSort: boolean,
  backgroundImageName: string,
  character: Character;
};

export const initialEditorState: EditorState = {
  loadedItems: [NIKKIS_PINKY],
  useSubtypeSort: false,
  backgroundImageName: 'light',
  character: new Character(),
};
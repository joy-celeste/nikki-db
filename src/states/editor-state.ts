import { ItemId } from "../models/ItemId";
import { Character } from '../models/Character';

export type EditorState = {
  hiddenItems: Set<ItemId>,
  backgroundImageName: string,
  history: Character[];
  step: number;
};

export const initialEditorState: EditorState = {
  hiddenItems: new Set(),
  backgroundImageName: 'light',
  history: [new Character()],
  step: 0,
};
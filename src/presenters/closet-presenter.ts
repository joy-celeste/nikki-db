import { createSelector } from 'reselect';
import { ItemId, Item } from 'models/Item';
import { RootState } from 'redux/reducers/store';
import { selectCurrentItemIds } from 'redux/selectors/character-selectors';

export interface PresentableClosetItem {
    readonly itemId: number;
    readonly displayLabel: string;
    readonly isWorn: boolean;
}

export const chronoSort = (a: Item, b: Item) => a.loadedTime - b.loadedTime;
export const subtypeSort = (a: Item, b: Item) => a.subtype - b.subtype || chronoSort(a, b);

export const createPresentableCloset = createSelector([
    (state: RootState) => state.editor.loadedItems,
    (state: RootState) => state.editor.useSubtypeSort,
    (state: RootState) => selectCurrentItemIds(state),
], (loadedItems: Item[], 
    useSubtypeSort: boolean,
    currentItemIds: ItemId[]
): PresentableClosetItem[] => {
    const currentlyWorn: Set<ItemId> = new Set<ItemId>(currentItemIds);
    return loadedItems
                .sort(useSubtypeSort ? subtypeSort : chronoSort)
                .map((item: Item) => {
                        return {
                            itemId: item.id,
                            displayLabel: item.label,
                            isWorn: currentlyWorn.has(item.id)
                        }})
});
import { ItemId } from '../models/ItemId';
    
export type SearchResult = {
    key?: string;
    displayName: string;
    iconId?: ItemId;
    contents: ItemId[];
    posed?: boolean;
    variation?: string;
    isSuit?: boolean;
};
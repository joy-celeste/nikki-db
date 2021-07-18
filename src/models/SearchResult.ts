import { ItemId } from 'models/Item';
    
export type SearchResult = {
    key: string;
    displayName: string;
    iconId: ItemId;
    contents: ItemId[];
};
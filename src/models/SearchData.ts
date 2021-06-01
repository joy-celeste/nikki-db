import { ItemId } from '../models/ItemId';
    
export default interface SearchData {
    name: string,
    iconId: ItemId,
    contents: ItemId[],
    posed?: boolean,
    variation?: string,
    isSuit?: boolean
}
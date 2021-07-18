import { ItemId } from 'models/Item';
    
export default interface SearchData {
    name: string,
    iconId: ItemId,
    contents: ItemId[],
    subtype?: number,
    posed?: boolean,
    variation?: string,
    isSuit?: boolean,
}
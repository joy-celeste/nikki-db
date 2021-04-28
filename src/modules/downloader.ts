import html2canvas from 'html2canvas';
import FileSaver from 'file-saver';
import { AnyAction, Dispatch } from 'redux';
import trimCanvas from '../modules/crop';
import { SearchResult } from './search';
import { ItemId, ItemsData, SubType } from './data';
import { setDownloadName, setDownloadedItems } from './editor';
import { SUBTYPES, SUBTYPES_MAP } from '../modules/constants';
import { RootState } from '.';

function getCurrentDatetime(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, '0');
  const day = `${today.getDate()}`.padStart(2, '0');
  const hour = `${today.getHours()}`.padStart(2, '0');
  const min = `${today.getMinutes()}`.padStart(2, '0');
  const seconds = `${today.getSeconds()}`.padStart(2, '0');
  return `${year}-${month}-${day}_at_${hour}-${min}-${seconds}`;
}

const specialSubtypes = new Set<SubType>([SUBTYPES.FOREGROUND, SUBTYPES.BACKGROUND, SUBTYPES.HEAD_ORNAMENT, SUBTYPES.GROUND]);

export const updateDownloadName = (result: SearchResult) =>
  async(dispatch: Dispatch<AnyAction>, getState: () => RootState): Promise<void> => {
    if (!result) { return; }

    const hiddenList: Set<ItemId> = getState().editor.hiddenItems;
    const loadedItems: ItemsData = getState().data.itemsData;
    const alreadyDownloaded: Set<ItemId> = getState().editor.downloaded;

    const suitName = result.displayName.replace(/\s+/g, '-').toLowerCase(); // "Legend of Tulans" => "legend-of-tulans"
    const posed = result?.posed ? '_posed' : '_unposed';
    let isSpecial = false;
    let isAlreadyDownloaded = false;

    let variant = '';
    if (result?.variation) {
      if (result?.variation !== '0' && !result?.posed) {
        variant = `_recolor${result.variation}`;
      } else if (result?.variation !== '0') {
        variant = `${result.variation}`;
      }
    }

    let subtype = '';
    if (hiddenList.size === 0) {
      subtype = '_0full';
    } else if (result.contents.length === hiddenList.size) {
      dispatch(setDownloadName('empty'));
      return;
    } else if (result.contents.length - hiddenList.size === 2) {
      const missingIds: ItemId[] = result.contents.filter((item) => !hiddenList.has(item));
      const skinItem = missingIds.find((itemId) => loadedItems[itemId]?.subType === SUBTYPES.SKIN);

      if (skinItem) {
        const otherItem = missingIds.find((itemId) => itemId !== skinItem);

        isAlreadyDownloaded = alreadyDownloaded.has(otherItem);
        if (!isAlreadyDownloaded) {
          const newAlreadyDownloadedList = new Set<ItemId>(alreadyDownloaded);
          newAlreadyDownloadedList.add(otherItem);
          dispatch(setDownloadedItems(newAlreadyDownloadedList));
        }

        const missingSubtype: SubType = loadedItems[otherItem]?.subType;
        subtype = `_${missingSubtype}${SUBTYPES_MAP[missingSubtype]?.toLowerCase()}_altskin`;
        isSpecial = specialSubtypes.has(missingSubtype);
      }
    } else if (result.contents.length - hiddenList.size === 1) {
      const missingId: ItemId = result.contents.find((item) => !hiddenList.has(item));
      isAlreadyDownloaded = alreadyDownloaded.has(missingId);
      if (!isAlreadyDownloaded) {
        const newAlreadyDownloadedList = new Set<ItemId>(alreadyDownloaded);
        newAlreadyDownloadedList.add(missingId);
        dispatch(setDownloadedItems(newAlreadyDownloadedList));
      }

      const missingSubtype: SubType = loadedItems[missingId]?.subType;
      if (missingSubtype) {
        subtype = `_${missingSubtype}${SUBTYPES_MAP[missingSubtype]?.toLowerCase()}`;
        isSpecial = specialSubtypes.has(missingSubtype);
      }
    } else {
      subtype = '_partialsuit';
    }

    const prefix = isAlreadyDownloaded ? 'AHH_DUPLICATE_' : '';
    const suffix = isSpecial ? '' : `${posed}${variant}`;
    dispatch(setDownloadName(`${prefix}${suitName}${subtype}${suffix}`));
  };

export const takeScreenshot = (filename: string = getCurrentDatetime()): void => {
  const input: HTMLElement = document.querySelector('.figure');
  html2canvas(input, {
    height: 4000,
    width: 4000,
    backgroundColor: null,
    windowWidth: 4000,
  }).then((canvas) => {
    const copy = trimCanvas(canvas, 30);
    copy.toBlob((blob: Blob) => {
      FileSaver.saveAs(blob, `${filename}.png`);
    });
  // eslint-disable-next-line no-console
  }).finally(() => console.log(`Saved ${filename}.png`));
};

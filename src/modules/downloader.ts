import html2canvas from 'html2canvas';
import FileSaver from 'file-saver';
import trimCanvas from '../modules/crop';

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

export const takeScreenshot = (filename: string = getCurrentDatetime()) => {
	const input: HTMLElement = document.querySelector('.figure');
	html2canvas(input, {
		height: 6000,
		width: 6000,
		backgroundColor: null,
		windowWidth: 6000,
	}).then((canvas) => {
		const copy = trimCanvas(canvas);
		copy.toBlob((blob: Blob) => {
			FileSaver.saveAs(blob, `${filename}.png`);
		});
	}).finally(() => console.log(`Saved ${filename}.png`));
};
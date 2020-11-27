import React from 'react';
import html2canvas from 'html2canvas';
import trimCanvas from '../modules/crop';
import FileSaver from 'file-saver';

export const Downloader = (): JSX.Element => {

  function getCurrentDatetime(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = `${today.getMonth() + 1}`.padStart(2, '0');
    const day = `${today.getDate()}`.padStart(2, '0');
    const hour = `${today.getHours()}`.padStart(2, '0');
    const min = `${today.getMinutes()}`.padStart(2, '0');
    const seconds = `${today.getSeconds()}`.padStart(2, '0');
    return `${year}-${month}-${day}_at_${hour}-${min}-${seconds}`
  }

  const takeScreenshot = () => {
    let input: HTMLElement = document.querySelector('.figure');
    html2canvas(input, {
      height: 6000,
      width: 6000,
      backgroundColor: null,
      windowWidth: 6000,
    }).then((canvas) => {
        let copy = trimCanvas(canvas);
        copy.toBlob(function(blob: Blob) {
          FileSaver.saveAs(blob, getCurrentDatetime() + '.png');
        });
    });
  }

  return <button type="button" onClick={() => takeScreenshot()}>Download!</button>;
};

export default Downloader;

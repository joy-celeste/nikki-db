import React, { CSSProperties, PureComponent, ReactNode } from 'react';
import { Character } from '../modules/character';

export interface FigureProps {
  characterData: Character;
}

export const Figure: React.FC<FigureProps> = (props: FigureProps) => {
  return (
    <div>
    {Object.entries(props.characterData).map(([key, value]) =>
      `Key: ${key} - Name: ${value.name} - Value: ${JSON.stringify(value)}`)}
    </div>
  )
}

    // // render the figure with the renderedData. updates renderedFigure.
    // let collectedData = [];

    // for (const clothesID in this.props.renderData) {
    //   collectedData.push(...this.props.renderData[clothesID]);
    // }

    // // console.log(collectedData[1]);

    // let renderedFigure = collectedData.map(d => {
    //   const isVisible = d[0] === '1' ? this.props.bodyHistory[this.props.step][d[1]] : true;
    //   const url = d[0] + '-' + d[1];
    //   const style = {
    //     top: -d[3],
    //     bottom: d[3],
    //     left: d[2],
    //     right: -d[2],
    //     zIndex: d[4],
    //     margin: 'auto',
    //     position: 'absolute'
    //   };

    //   return <Item visible={isVisible} key={url} style={style} url={url} />;
    //   //return this.renderPiece(d[0], d[1], d[2], d[3], d[4] ? d[4] : 18000, isVisible);
    // });

    // return (
    //   <div style={style} className='canvas'>
    //     Text
    //   </div>
    // );

export default Figure;

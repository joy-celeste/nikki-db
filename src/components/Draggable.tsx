import React, { CSSProperties, ReactNode } from 'react';

interface DraggableProps {
  top?: string;
  left?: string;
}

interface DraggableState {
  top: string;
  left: string;
  isDown: boolean;
  offset: number[];
}

const defaultStyle: CSSProperties = { position: 'absolute', width: '100%' };

class Draggable extends React.PureComponent<DraggableProps, DraggableState> {
  div!: HTMLDivElement;
  defaultStyle: CSSProperties;

  constructor(props: DraggableProps) {
    super(props);
    this.state = {
      top: props.top || 'auto',
      left: props.left || 'auto',
      isDown: false,
      offset: [0, 0],
    };
  }

  componentDidMount(): void {
    this.div.addEventListener('mousedown', this.mouseDown, true);
    window.addEventListener('mouseup', this.mouseUp, true);
    window.addEventListener('mousemove', this.mouseMove, true);
    // window.addEventListener('contextmenu', (e) => e.preventDefault(), false); // right click
  }

  mouseUp = (): void => this.setState({ isDown: false });

  mouseDown = (event: MouseEvent): void => {
    event.preventDefault();
    this.setState({
      isDown: true,
      offset: [this.div.offsetLeft - event.clientX, this.div.offsetTop - event.clientY],
    });
  };

  mouseMove = (event: MouseEvent): void => {
    const { isDown, offset } = this.state;
    event.preventDefault();
    if (isDown) {
      this.setState({ left: `${event.clientX + offset[0]}px`, top: `${event.clientY + offset[1]}px` });
    }
  };

  render(): ReactNode {
    const { children } = this.props;
    const { top, left } = this.state;
    const style: CSSProperties = { ...defaultStyle, top, left };

    return (
      <div style={style} ref={(element) => { this.div = element; }}>
        {children}
      </div>
    );
  }
}

export default Draggable;

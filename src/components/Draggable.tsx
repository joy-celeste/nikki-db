import React, { CSSProperties, ReactNode } from 'react';

interface DraggableState {
  style: CSSProperties;
  isDown: boolean;
  offset: number[];
}

class Draggable extends React.PureComponent<ReactNode, DraggableState> {
  div: HTMLDivElement;

  constructor(props: ReactNode) {
    super(props);
    this.state = {
      style: {
        position: 'absolute',
        width: '100%',
        top: '50%',
      },
      isDown: false,
      offset: [0, 0],
    };
  }

  componentDidMount(): void {
    this.div.addEventListener('mousedown', this.mouseDown, true);
    window.addEventListener('mouseup', this.mouseUp, true);
    window.addEventListener('mousemove', this.mouseMove, true);
  }

  mouseUp = (): void => {
    this.setState({ isDown: false });
  };

  mouseDown = (event: MouseEvent): void => {
    this.setState({
      isDown: true,
      offset: [this.div.offsetLeft - event.clientX, this.div.offsetTop - event.clientY],
    });
  };

  mouseMove = (event: MouseEvent): void => {
    const { isDown, offset } = this.state;

    event.preventDefault();
    if (isDown) {
      this.setState({
        style: {
          position: 'absolute',
          width: '100%',
          left: `${event.clientX + offset[0]}px`,
          top: `${event.clientY + offset[1]}px`,
        },
      });
    }
  };

  render(): ReactNode {
    const { children } = this.props;
    const { style } = this.state;

    return (
      <div style={style} ref={(element) => { this.div = element; }}>
        {children}
      </div>
    );
  }
}

export default Draggable;

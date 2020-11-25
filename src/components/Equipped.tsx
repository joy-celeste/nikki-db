import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../modules';
import { Clothes } from '../modules/character';
import { ItemData, ItemId } from '../modules/data';
import { toggleItemVisibility } from '../modules/editor';
import Icon from './Icon';
import './Icon.css';

export interface EquippedDispatchProps {
  toggleItemVisibility(itemId: ItemId): void
}

export interface EquippedStateProps {
  itemsData: Record<ItemId, ItemData>,
  hiddenList: Set<ItemId>,
  clothes: Clothes,
}

export type EquippedProps = EquippedDispatchProps & EquippedStateProps;

class UnconnectedEquipped extends PureComponent<EquippedProps, null> {
  render() {
    const { itemsData, clothes, toggleItemVisibility } = this.props;

    return clothes ? Object.values(clothes).map((clothesId) => (
      <div className="equipped-wrapper">
        <div className="equipped-icon" onClick={() => toggleItemVisibility(clothesId)}>
          <Icon clothesId={clothesId} />
        </div>
        <div className="equipped-text">{itemsData[clothesId]?.name}</div>
        <div className="equipped-trash">Vis</div>
      </div>
    )) : null;
  }
}

const mapStateToProps = (state: RootState): EquippedStateProps => ({
  itemsData: state.data.itemsData,
  hiddenList: state.editor.hiddenItems,
  clothes: state.character.history[state.character.step].clothes,
});

const mapDispatchToProps: EquippedDispatchProps = {
  toggleItemVisibility: (itemId: ItemId) => toggleItemVisibility(itemId),
};

const Equipped = connect(mapStateToProps, mapDispatchToProps)(UnconnectedEquipped);
export default Equipped;

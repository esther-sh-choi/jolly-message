import React, { useEffect, useState } from 'react';

import styles from './ItemPicker.module.scss';

interface ItemPickerProps {
  onItemChange: (arg: string[]) => void;
}

const itemOptions = [
  { id: 'bells', image: '/images/item-bell.svg' },
  { id: 'candycane', image: '/images/item-candycane.svg' },
  { id: 'gingerbread', image: '/images/item-gingerbread.svg' },
  { id: 'hearttag', image: '/images/item-hearttag.svg' },
  { id: 'mistletoe', image: '/images/item-mistletoe.svg' },
  { id: 'ornament', image: '/images/item-ornament.svg' },
  { id: 'snowman', image: '/images/item-snowman.svg' },
  { id: 'tree', image: '/images/item-tree.svg' },
];

const ItemPicker: React.FC<ItemPickerProps> = ({ onItemChange }) => {
  const [items, setItems] = useState<Array<string>>([]);
  const [itemButtons, setItemButtons] = useState(itemOptions);

  const handleItemChange = (event: any) => {
    //toggle
    const numOfSelected = items?.length;
    if (numOfSelected === 0) {
      setItems([event.target.id]);
    } else if (numOfSelected > 0 && numOfSelected < 3) {
      const selectedIndex = items?.indexOf(event.target.id);
      if (selectedIndex > -1) {
        console.log(selectedIndex);
        setItems((current) =>
          current.filter((items) => items !== event.target.id),
        );
      } else {
        setItems([...items, event.target.id]);
      }
    } else {
      setItems((current) =>
        current.filter((items) => items !== event.target.id),
      );
    }
  };

  useEffect(() => {
    // send the items array when the state is updated
    onItemChange(items);
  }, [items]);

  return (
    <div className={styles.itemPickerContainer}>
      {itemButtons.map((item) => (
        <div
          onClick={handleItemChange}
          key={item.id}
          id={item.id}
          className={styles.item}
          style={{
            border: items.includes(item.id)
              ? '2px solid #001689'
              : '2px solid #fafafa',
          }}
        >
          <img id={item.id} src={item.image} alt={`${item.id}`} />
        </div>
      ))}
    </div>
  );
};

export default ItemPicker;

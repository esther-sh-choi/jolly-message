import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box } from '@mui/material';
import { TaskAltRounded } from '@mui/icons-material';

import { BlockPicker, ColorResult } from 'react-color';

import Header from '../../components/Header';
import Stocking from '../../components/Stocking';
import Palette from '../../components/Palette';
import PatternPicker from '../../components/PatternPicker';
import ItemPicker from '../../components/ItemPicker';
import SMSButton from '../../components/SMSButton';
import SMSModal from '../../components/SMSModal';

import styles from './DecorateStocking.module.scss';
import SMSTabs from '../../components/SMSTabs';
import { useDispatch, useSelector } from 'react-redux';
import { currentStocking, resetStocking } from '../../stores/stockings';
import { currentFireplace } from '../../stores/fireplaces';
import { AddStockingRequest, stockingsApi } from '../../services/stockings';
import { currentUser } from '../../stores/auth';

const colorOptions = [
  {
    background: '#B4101A',
    selected: true,
  },
  { background: '#ff7e38', selected: false },
  { background: '#fffc3d', selected: false },
  { background: '#057f09', selected: false },
  { background: '#4466ee', selected: false },
  { background: '#794dff', selected: false },
  {
    background:
      'linear-gradient(to left, violet, blue, green, yellow, orange, red)',
    selected: false,
  },
];

const DecorateStocking = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const mode = location.pathname.includes('new') ? 'add' : 'edit';
  const [colors, setColors] = useState(colorOptions);
  const [allowCustom, setAllowCustom] = useState(false);
  const [stocking, setStocking] = useState({
    colorSelected: '#B4101A',
    patternSelected: 'solid',
    itemsSelected: [''],
  });
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [decorateType, setDecorateType] = useState('color');

  const user = useSelector(currentUser);
  const fireplace = useSelector(currentFireplace);
  const tempStocking = useSelector(currentStocking);

  const [openRestrictedAlert, setOpenRestrictedAlert] = useState(false);

  const [
    addStocking,
    { isLoading, data: addStockingResponse, isError, isSuccess, error },
  ] = stockingsApi.useAddStockingMutation();

  const handleColorChange = (newlySelectedColor: string, type: string) => {
    if (type === 'preset') {
      if (stocking.colorSelected !== newlySelectedColor) {
        // Update the colors array every time user clicks a new color on the palette.
        // The new color is selected (true) and the last selected color is unselected (false).
        setColors((current) =>
          current.map((color) => {
            if (color.background === newlySelectedColor) {
              color.selected = true;
            } else if (color.background === stocking.colorSelected) {
              color.selected = false;
            }
            return color;
          })
        );
      }

      // Checks if the color selected is a preset color or the customzation color.
      if (newlySelectedColor.includes('#')) {
        setAllowCustom(false);
      } else {
        setAllowCustom(true);
      }
    }

    if (newlySelectedColor.includes('#')) {
      setStocking({
        ...stocking,
        colorSelected: newlySelectedColor,
      });
    }
  };

  const handleCustomColorChange = (color: ColorResult) => {
    setStocking({
      ...stocking,
      colorSelected: color.hex,
    });
  };

  const handlePatternChange = (chosenPattern: string) => {
    setStocking({
      ...stocking,
      patternSelected: chosenPattern,
    });
  };

  const handleItemChange = (items: string[]) => {
    setStocking({
      ...stocking,
      itemsSelected: items,
    });
  };

  const handleSubmitStocking = async () => {
    if (user?.fireplaceId === fireplace.uid) {
      setOpenRestrictedAlert(true);
      return;
    }

    const stockingToAdd: AddStockingRequest = {
      ...tempStocking,
      fireplaceId: fireplace.uid,
      color: stocking.colorSelected,
      pattern: stocking.patternSelected,
      items: stocking.itemsSelected,
      anonymous: !user,
    };

    try {
      const response = await addStocking(stockingToAdd).unwrap();
      // @ts-ignore
      dispatch(resetStocking());
      setOpenSuccessModal(true);
    } catch (err) {
      // @ts-ignore
      if (err.status === 403) {
        setOpenRestrictedAlert(true);
      }
      console.log(err);
    }
  };

  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
    navigate(-2);
  };

  const decorateTypes = [
    {
      type: 'color',
      label: 'Color',
      title: 'Pick a Color',
      component: (
        <Palette
          className={styles.palette}
          colors={colors}
          onChange={handleColorChange}
        />
      ),
      id: 'color1',
    },
    {
      type: 'pattern',
      label: 'Pattern',
      title: 'Pick a Pattern',
      component: (
        <PatternPicker
          onPatternChange={handlePatternChange}
          colorSelected={stocking.colorSelected}
        />
      ),
      id: 'pattern2',
    },
    {
      type: 'items',
      label: 'Items',
      title: 'Pick Item (up to 3)',
      component: <ItemPicker onItemChange={handleItemChange} />,
      id: 'items3',
    },
  ];

  const handleSelectDecorateType = (decorateType: string) => {
    setDecorateType(decorateType);
  };

  return (
    <Box className={styles.decorateStockingContainer}>
      <Header mode='back' color='#ffffff' />
      <Box className={styles.decorateStockingBody}>
        <section className={styles.decorateTitle}>
          <h1>
            {mode === 'add' ? 'Decorate Your Stocking' : 'Edit Your Stocking'}
          </h1>
          <h6>This will appear in {fireplace.username}'s fireplace.</h6>
        </section>
        <div className={styles.stockingPreviewContainer}>
          <Stocking className={styles.stocking} stockingOptions={stocking} />
        </div>
        <div className={styles.decoratePickerContainer}>
          <SMSTabs
            className={styles.SMSTabs}
            selectedCategory={decorateType}
            onSelectFilter={handleSelectDecorateType}
            tabCategories={decorateTypes}
          ></SMSTabs>
          {decorateTypes
            .filter((type) => decorateType === type.type)
            .map((type) => (
              <div className={styles.decorateTypeContainer} key={type.id}>
                <h2 className={styles.decorateTypeTitle}>{type.title}</h2>
                <div className={styles.decorateTypePicker}>
                  {type.component}
                </div>
              </div>
            ))}
          <SMSButton
            className={styles.submitStockingButton}
            variant='contained'
            onClick={handleSubmitStocking}
          >
            Send
          </SMSButton>
        </div>
      </Box>
      {allowCustom && (
        <div className={styles.blockPickerContainer}>
          <div
            className={`${styles.backdrop} ${
              styles[!allowCustom ? 'close' : '']
            }`}
            onClick={() => setAllowCustom(false)}
          ></div>
          <BlockPicker
            className={styles.blockPicker}
            color={stocking.colorSelected}
            width='300px'
            onChange={handleCustomColorChange}
            triangle='hide'
          />
        </div>
      )}
      <SMSModal
        title={mode === 'add' ? 'Message sent!' : 'Message edited!'}
        open={openSuccessModal}
        onClose={handleCloseSuccessModal}
        replyButtons={
          <SMSButton onClick={handleCloseSuccessModal}>OK</SMSButton>
        }
        mainIcon={
          <TaskAltRounded
            sx={{ color: '#228C22', fontSize: '40px', mb: '10px' }}
          />
        }
      >
        {mode === 'add'
          ? 'Your stocking was successfully sent. You can edit the message, change stocking, and/or add an image until the midnight of December 25th.'
          : 'Your stocking was successfully edited. You can further edit it and change the stocking or image until the midnight of December 25th.'}
      </SMSModal>
      <SMSModal
        open={openRestrictedAlert}
        onClose={() => {
          setOpenRestrictedAlert(false);
        }}
        replyButtons={
          <SMSButton
            variant='contained'
            onClick={() => {
              setOpenRestrictedAlert(false);
            }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            sx={{ height: '48px', width: '40%' }}
            upperCase
          >
            OK
          </SMSButton>
        }
      >
        <p className={styles.modalMessage} style={{ paddingBottom: '20px' }}>
          You cannot add a new stocking to your fireplace.
        </p>
      </SMSModal>
    </Box>
  );
};

export default DecorateStocking;

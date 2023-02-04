import React, { useState, ChangeEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Typography } from '@mui/material';

import Header from '../../components/Header';
import SMSNicknameField from '../../components/SMSNicknameField';
import ImageDrop from '../../components/ImageDrop';
import SMSButton from '../../components/SMSButton';

import styles from './WriteMessage.module.scss';
import { AddStockingRequest, stockingsApi } from '../../services/stockings';
import { useDispatch, useSelector } from 'react-redux';
import { setStocking } from '../../stores/stockings';
import { isLoggedIn } from '../../stores/auth';
import Loading from '../../components/Loading';

enum Mode {
  Add = 'new',
  Edit = 'edit',
}

const WriteMessage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const mode: Mode = location.pathname.includes('new') ? Mode.Add : Mode.Edit;
  const [nicknameValid, setNicknameValid] = useState(true);
  const [messageValid, setMessageValid] = useState(true);
  const [stockingData, setStockingData] = useState<AddStockingRequest>({
    fireplaceId: '',
    nickname: '',
    message: '',
    color: '',
    pattern: '',
    items: [],
    imageUrl: '',
  });
  const [file, setFile] = useState(null);
  const isUserLoggedIn = useSelector(isLoggedIn);

  const [
    uploadImage,
    { isLoading, data: uploadImageResponse, isError, isSuccess, error },
  ] = stockingsApi.useUploadImageMutation();

  const handleSubmitMessage = async () => {
    // navigate('decorate', {
    //   state: { nickname: nickname, message: message, image: 'buffer' },
    // });

    try {
      const stockingToSave = {
        ...stockingData,
      };

      if (file) {
        const formData = new FormData();

        formData.append(
          'file',
          // @ts-ignore
          // new File([file.preview], file.name, { type: file.type })
          file
        );
        formData.append('folder', 'message');
        formData.append('anonymous', `${!isUserLoggedIn}`);

        const { url } = await uploadImage(formData).unwrap();
        stockingToSave.imageUrl = url;
      }
      dispatch(setStocking(stockingToSave));
      navigate('decorate');
    } catch (err) {
      console.log(err);
    }
  };

  const handleNicknameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStockingData({
      ...stockingData,
      nickname: event.target.value.trim(),
    });
    setNicknameValid(!!event.target.value.trim().length);
  };

  const handleMessageChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setStockingData({
      ...stockingData,
      message: event.target.value,
    });
    setMessageValid(!!event.target.value.trim().length);
  };

  const handleImageChange = (file: File) => {
    // @todo: Use FormData when you upload an image. `file` and `folder` should be included in FormData. The value of `folder` should be `profile` here. Please refer to Postman's Upload file API.
    // @ts-ignore
    setFile(file);
  };

  return (
    <>
      <div className={styles.writeMessagePage}>
        <Header mode='back' color='#ffffff' />
        <div className={styles.writeMessagesMain}>
          <div className={styles.writeMessageHeader}>
            <Typography className={styles.writeMessageTitle} variant='h5'>
              {mode === Mode.Add ? 'Add a Message' : 'Edit Message'}
            </Typography>
          </div>
          <div className={styles.writeMessageBody}>
            <SMSNicknameField
              className={styles.nicknameField}
              onChange={handleNicknameChange}
              value={stockingData?.nickname || ''}
              valid={nicknameValid}
            ></SMSNicknameField>
            <div className={styles.messageContainer}>
              <label
                className={`${styles.messageLabel} ${
                  !messageValid ? styles.error : ''
                }`}
              >
                Message
              </label>
              <textarea
                id='message'
                value={stockingData?.message || ''}
                onChange={handleMessageChange}
                placeholder='Maximum 300 characters'
                maxLength={300}
                className={`${styles.messageField} ${
                  !messageValid ? styles.error : ''
                }`}
                required
              />
              <span className={styles.textCounter}>
                {stockingData.message.length}/300
              </span>
            </div>
            <ImageDrop onChange={handleImageChange}></ImageDrop>
            <SMSButton
              variant='contained'
              className={styles.submitMessageBtn}
              onClick={handleSubmitMessage}
              disabled={!nicknameValid || !messageValid}
            >
              {mode === Mode.Add
                ? 'Decorate My Stocking'
                : 'Continue to Stocking'}
            </SMSButton>
          </div>
        </div>
      </div>
      <Loading loading={isLoading} />
    </>
  );
};

export default WriteMessage;

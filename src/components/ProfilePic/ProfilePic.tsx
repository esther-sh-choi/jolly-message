import React, {
  useState,
  useRef,
  FC,
  CSSProperties,
  ChangeEventHandler,
} from 'react';

import { Avatar, Badge } from '@mui/material';
import { CloseRounded, CameraAltRounded } from '@mui/icons-material';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import Resizer from 'react-image-file-resizer';

import styles from './ProfilePic.module.scss';
import SMSButton from '../SMSButton';
import { useDispatch, useSelector } from 'react-redux';
import { currentUser, updateUser } from '../../stores/auth';
import { usersApi } from '../../services/users';

import Loading from '../Loading';

interface ProfilePicProps {
  alt?: string;
  src?: string;
  avatarSize?: string;
  for?: string;
  style?: CSSProperties | undefined;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const ProfilePic: FC<ProfilePicProps> = ({ alt, avatarSize }) => {
  const dispatch = useDispatch();

  const [image, setImage] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [cropData, setCropData] = useState('');
  const [cropper, setCropper] = useState<any>();
  const user = useSelector(currentUser);

  const cropperRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [
    uploadImage,
    {
      isLoading: isUploadImageLoading,
      data: uploadImageResponse,
      isError: isUploadImageError,
      isSuccess: isUploadImageSuccess,
      error: uploadImageError,
    },
  ] = usersApi.useUploadImageMutation();

  const [
    updateProfileImageUrl,
    {
      isLoading: isUpdateProfileImageUrlLoading,
      data: updatedUserResponse,
      isError: isUpdateProfileImageUrlError,
      isSuccess: isUpdateProfileImageUrlSuccess,
      error: updateProfileImageUrlError,
    },
  ] = usersApi.useUpdateProfileImageUrlMutation();

  const handleInput = (e: any) => {
    setOpen(true);
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as any);
    };
    reader.readAsDataURL(files[0]);
  };

  const resizeFile = (file) => {
    // The settings for resizing image could be updated later.
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        'png',
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        'file'
      );
    });
  };

  const handleCrop = async () => {
    if (typeof cropper !== 'undefined') {
      // 이미지 업로드
      // @ts-ignore
      cropper.getCroppedCanvas().toBlob(async (blob) => {
        try {
          // @ts-ignore
          const fileName = fileInputRef.current.files[0].name;
          const fileType = blob.type;

          const file = new File([blob], fileName, {
            lastModified: new Date().getTime(),
            type: fileType,
          });

          const newFile = await resizeFile(file);

          const formData = new FormData();
          // @ts-ignore
          formData.append('file', newFile);
          formData.append('folder', 'profile');

          const { url } = await uploadImage(formData).unwrap();

          // 유저 업데이트
          const updatedUser = await updateProfileImageUrl({
            profileImageUrl: url,
          }).unwrap();
          dispatch(updateUser(updatedUser));

          setCropData(cropper.getCroppedCanvas().toDataURL());
          setOpen(false);
        } catch (err) {
          console.error(err);
        }
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setImage('');
    // Input 태그의 value를 지워주지않으면 Close나 Cancel 했을 때 같은 파일로 Cropper가 열리지 않음.
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <div>
        <label>
          <Badge
            overlap='rectangular'
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <CameraAltRounded sx={{ color: '#bebebe', fontSize: '20px' }} />
            }
          >
            {(user?.profileImageUrl || cropData) && (
              <Avatar
                alt={alt}
                src={user?.profileImageUrl || cropData}
                sx={{
                  width: avatarSize,
                  height: avatarSize,
                  cursor: 'pointer',
                }}
              />
            )}
            {!user?.profileImageUrl && (
              <span className={styles.guestAvatar}>
                <img
                  className={styles.guestStockingImage}
                  src={'/images/guest-avatar.svg'}
                  alt='white sock'
                />
              </span>
            )}
          </Badge>
          <input
            type='file'
            id='file'
            style={{ display: 'none' }}
            name='profileImg'
            accept='/image/*'
            onInput={handleInput}
            ref={fileInputRef}
          ></input>
        </label>
        {open && (
          <div className={styles.cropperModal}>
            <button className={styles.closeButton} onClick={handleClose}>
              <CloseRounded sx={{ fontSize: '30px' }} />
            </button>
            <div className={styles.previewContainer}>
              <h3 className={styles.previewTitle}>Preview</h3>
              <div
                className='preview'
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                }}
              />
            </div>
            <Cropper
              src={image}
              style={{
                maxHeight: '40%',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }}
              initialAspectRatio={1}
              aspectRatio={1}
              preview='.preview'
              guides={false}
              viewMode={1}
              minCropBoxHeight={50}
              minCropBoxWidth={50}
              responsive={true}
              background={false}
              autoCropArea={1}
              checkOrientation={false}
              ref={cropperRef}
              onInitialized={(instance) => {
                setCropper(instance);
              }}
            />
            <div className={styles.profilePicButtons}>
              <SMSButton
                variant='contained'
                onClick={handleCrop}
                style={{ width: '100%', marginRight: '10px' }}
              >
                Save
              </SMSButton>
              <SMSButton
                variant='outlined'
                onClick={handleClose}
                style={{ width: '100%' }}
                sx={{ border: '2px solid #001689' }}
              >
                Cancel
              </SMSButton>
            </div>
          </div>
        )}
      </div>
      <Loading
        loading={isUploadImageLoading || isUpdateProfileImageUrlLoading}
      />
    </>
  );
};

export default ProfilePic;

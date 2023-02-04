import React, { useEffect, useState, useMemo, useCallback } from 'react';

import { CloseRounded } from '@mui/icons-material';

import Resizer from 'react-image-file-resizer';
import { useDropzone } from 'react-dropzone';

import styles from './ImageDrop.module.scss';

const baseStyle = {
  height: '140px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  flexShrink: '1',
  padding: '5px',
  borderRadius: '18px',
  backgroundImage:
    'linear-gradient(to bottom, rgba(255, 255, 255, 0.75) 0%, #efefef 100%)',
  borderColor: 'rgba(0, 0, 0, 0.07)',
  borderStyle: 'solid',
  borderWidth: '2px',
  outline: 'none',
  color: '#001689',
  position: 'relative',
};

const focusedStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

const DROPPABLE_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/svg+xml',
  'image/heic',
  'image/heif',
];
const RESIZABLE_IMAGE_TYPES = ['image/jpeg', 'image/png'];

const ImageDrop = ({ onChange }) => {
  const [file, setFile] = useState();

  const resizeFile = (file) => {
    // The settings for resizing image could be updated later.
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        600,
        600,
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

  const onDrop = useCallback((acceptedFiles) => {
    // Ignore if user tries to drop over one image
    if (acceptedFiles.length > 1) {
      return;
    }

    acceptedFiles.forEach(async (file) => {
      let newFile = file;
      if (RESIZABLE_IMAGE_TYPES.includes(file.type)) {
        newFile = await resizeFile(file);
      }
      newFile.preview = URL.createObjectURL(newFile);
      setFile(newFile);
      onChange(newFile);
    });
  }, []);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: DROPPABLE_IMAGE_TYPES.reduce(
        (prev, cur) => ({ ...prev, [cur]: [] }),
        {}
      ),
      onDrop,
    });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const handleCancelImage = () => {
    setFile(undefined);
  };

  const thumbs = (
    <div className={styles.thumb} key={file?.name}>
      {file ? (
        <img
          src={file?.preview}
          className={styles.img}
          onLoad={() => {
            URL.revokeObjectURL(file?.preview);
          }}
        />
      ) : (
        <img
          className={styles.imageDropIcon}
          src={'/images/image-drop-icon.svg'}
        />
      )}
    </div>
  );

  useEffect(() => {
    return () => URL.revokeObjectURL(file?.preview);
  }, []);

  return (
    <div {...getRootProps({ style, className: 'dropzone' })}>
      <input {...getInputProps()} />
      <div className={styles.thumbsContainer}>
        {thumbs}
        {file ? (
          <h4 className={styles.fileName}>{file?.name}</h4>
        ) : (
          <div className={styles.imageDropInstruction}>
            <h4>Attach a photo</h4>
            <p className={styles.instructionFileType}>jpg, png, gif, svg</p>
          </div>
        )}
      </div>
      {file && (
        <button className={styles.closeButton} onClick={handleCancelImage}>
          <CloseRounded />
        </button>
      )}
    </div>
  );
};

export default ImageDrop;

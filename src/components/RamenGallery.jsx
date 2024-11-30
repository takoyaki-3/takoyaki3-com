import React, { useState } from 'react';
import '../styles/RamenGallery.css';

const RamenGallery = ({ photos }) => {
  const [grayscalePhotos, setGrayscalePhotos] = useState([]);

  const handlePhotoClick = (index) => {
    setGrayscalePhotos((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="ramen-gallery">
      {photos.map((photo, index) => (
        <div
          key={index}
          className="ramen-photo"
          onClick={() => handlePhotoClick(index)}
        >
          <img
            src={photo.url}
            alt={`Ramen ${index + 1}`}
            className={grayscalePhotos.includes(index) ? 'grayscale' : ''}
          />
        </div>
      ))}
    </div>
  );
};

export default RamenGallery;

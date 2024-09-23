import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const CropModal = ({ onClose, onConfirm, image }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [zoom, setZoom] = useState(1);

  const handleCropChange = (crop) => {
    setCrop(crop);
  };

  const handleZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const handleConfirm = () => {
    onConfirm(crop, zoom);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal show={true} onHide={handleCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Crop Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="crop-modal-container">
          <img src={image} alt="Image to crop" />
          <div className="crop-overlay" style={{
            top: `${crop.y}%`,
            left: `${crop.x}%`,
            width: `${crop.width}%`,
            height: `${crop.height}%`,
          }} />
        </div>
        <div className="crop-controls">
          <Button variant="primary" onClick={handleConfirm}>
            Confirm
          </Button>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CropModal;
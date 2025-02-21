import React, { useState } from 'react';
import axios from 'axios';
import './canvaBoard.css';
import useCanvas from './useCanva'; 

const CanvasBoard = () => {
  const [userEmail, setUserEmail] = useState('');
  const [textInput, setTextInput] = useState(''); 
  const { 
    canvasRef, 
    handleImageUpload, 
    handleAddText, 
    handleSaveCanvas, 
    handleMouseDown, 
    handleMouseMove, 
    handleMouseUp, 
    texts, 
    setTexts,
    uploadedImage, 
  } = useCanvas();

  const handleAddTextClick = () => {
    if (textInput) {
      const newText = {
        text: textInput,
        position: { x: 50, y: 100 }, 
      };
      setTexts([...texts, newText]); 
      setTextInput(''); 
    }
  };

  const handleSaveAndSend = async () => {
    const dataUrl = handleSaveCanvas();
    const base64Image = dataUrl.split(',')[1];

    // Convert base64 string to Blob
    const byteCharacters = atob(base64Image);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: 'image/png' });

    const formData = new FormData();
    formData.append('image', blob, 'userCard.png');
    formData.append('userEmail', userEmail);
    formData.append('userText', texts.map(text => text.text).join(', '));
    console.log('API URL:', process.env.REACT_APP_API_URL);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/update-and-send-card`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log(response);
      alert('Card sent successfully');
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending card');
    }
  };

  return (
    <div className="canvas-board-container">
      <h1 className="canvas-board-title">Create Your Invitation Card</h1>

      <div className="input-container">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
          className="file-input" 
        />
      </div>

      <div className="canvas-container">
        <canvas 
          ref={canvasRef} 
          width={500} 
          height={500} 
          onMouseDown={handleMouseDown} 
          onMouseMove={handleMouseMove} 
          onMouseUp={handleMouseUp}
        ></canvas>
      </div>

      <div className="input-container">
        <input 
          type="email" 
          value={userEmail} 
          onChange={(e) => setUserEmail(e.target.value)} 
          placeholder="Enter your email" 
          className="email-input" 
        />
      </div>

      <div className="input-container">
        <input 
          type="text" 
          value={textInput} 
          onChange={(e) => setTextInput(e.target.value)} 
          placeholder="Enter your text here" 
          className="text-input" 
        />
      </div>

      <div className="buttons-container">
        <button onClick={handleAddTextClick} className="add-text-btn">Add Text</button>
        <button onClick={handleSaveAndSend} className="save-send-btn">Save and Send</button>
      </div>
    </div>
  );
};

export default CanvasBoard;

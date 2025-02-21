import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import './canvaBoard.css'; 

const CanvasBoard = () => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [text, setText] = useState('');
  const [textPosition, setTextPosition] = useState(100);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setContext(ctx);
    const img = new Image(); 
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }, []);

  const handleAddText = () => {
    if (context && text) {
      context.font = '30px Arial';
      context.fillStyle = 'black';
      context.fillText(text, 50, textPosition);
      setTextPosition(textPosition + 40); 
    }
  };

  const handleSaveAndSend = async () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
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
    formData.append('userText', text);
    console.log('API URL:', process.env.REACT_APP_API_URL);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/update-and-send-card`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log(response)
      alert('Card sent successfully');
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending card');
    }
  };

  return (
    <div className="canvas-board-container">
      <h1 className="canvas-board-title">Create Your Invitation Card</h1>
      
      <div className="canvas-container">
        <canvas ref={canvasRef} width={300} height={300}></canvas>
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
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          placeholder="Enter your text here" 
          className="text-input" 
        />
      </div>

      <div className="buttons-container">
        <button onClick={handleAddText} className="add-text-btn">Add Text</button>
        <button onClick={handleSaveAndSend} className="save-send-btn">Save and Send</button>
      </div>
    </div>
  );
};

export default CanvasBoard;

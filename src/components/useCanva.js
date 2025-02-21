import { useState, useEffect, useRef } from 'react';

const useCanvas = () => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [texts, setTexts] = useState([]); 
  const [uploadedImage, setUploadedImage] = useState(null); 
  const [draggingTextIndex, setDraggingTextIndex] = useState(null); 
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      setContext(ctx);
    }
  }, []);


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = () => {
        img.src = reader.result;
      };
      reader.readAsDataURL(file);

      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = context;
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height); 
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height); 
          setUploadedImage(img); 
        }
      };
    }
  };

  const handleAddText = () => {
    if (context) {
      const newText = {
        text: 'Your text here',  
        position: { x: 50, y: 100 },  
      };
      setTexts([...texts, newText]);  
    }
  };

  const handleSaveCanvas = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    return dataUrl; 
  };


  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const canvasRect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - canvasRect.left;
    const mouseY = e.clientY - canvasRect.top;


    const selectedTextIndex = texts.findIndex((text, index) => {
      const textWidth = context.measureText(text.text).width;
      const textHeight = 30; 
      return (
        mouseX >= text.position.x &&
        mouseX <= text.position.x + textWidth &&
        mouseY >= text.position.y - textHeight &&
        mouseY <= text.position.y
      );
    });

    if (selectedTextIndex !== -1) {
      setDraggingTextIndex(selectedTextIndex); 
      setDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (dragging && draggingTextIndex !== null) {
      const canvas = canvasRef.current;
      const canvasRect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - canvasRect.left;
      const mouseY = e.clientY - canvasRect.top;


      const newTexts = [...texts];
      newTexts[draggingTextIndex].position = { x: mouseX, y: mouseY };
      setTexts(newTexts);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setDraggingTextIndex(null);
  };


  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = context;
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    if (uploadedImage) {
      ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height); 
    }


    texts.forEach((textObj) => {
      ctx.font = '30px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText(textObj.text, textObj.position.x, textObj.position.y);
    });
  };

  useEffect(() => {
    redrawCanvas();
  }, [texts, uploadedImage]); 

  return {
    canvasRef,
    handleImageUpload,
    handleAddText,
    handleSaveCanvas,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    setTexts,
    texts,
    uploadedImage, 
  };
};

export default useCanvas;

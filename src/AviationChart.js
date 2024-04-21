import React, { useRef, useEffect } from 'react';
import airplaneImage from './assets/Image/plane-1.svg'; // import your airplane image

const AviationChart = () => {
    
    const canvasRef = useRef(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
  
      let x = 50;
      let y = 50;
      let dx = 2;
      let dy = 2;
  
      const airplane = new Image();
      airplane.src = airplaneImage;
  
      const animate = () => {
        requestAnimationFrame(animate);
        context.clearRect(0, 0, canvas.width, canvas.height);
  
        // Draw airplane image
        context.drawImage(airplane, x, y, 50, 20);
  
        // Update position
        x += dx;
        y += dy;
  
        // Boundary detection
        if (x + 50 > canvas.width || x < 0) {
          dx = -dx;
        }
        if (y + 20 > canvas.height || y < 0) {
          dy = -dy;
        }
      };
  
      animate();
    }, []);
  
    return <canvas ref={canvasRef} width={800} height={600} />;
  };
  

export default AviationChart    ;

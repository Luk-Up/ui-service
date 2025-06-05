import './App.css';
import { useState } from 'react';

function App() {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const ripple = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY
    };
    setRipples([...ripples, ripple]);

    setTimeout(() => {
      setRipples([]);
    }, 600);
  };

  return (
    <div className="app-container">
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="ripple"
          style={{
            top: ripple.y - 250 + 'px',
            left: ripple.x - 250 + 'px',
            width: '500px',
            height: '500px'
          }}
        ></span>
      ))}
      <button className="btn" onClick={handleClick}>Annoying</button>
    </div>
  );
}

export default App;

import { useCallback, useRef, useState, useEffect } from "react";
import "./App.css";
import Footer from "./Footer";

const colors = ["red", "green", "yellow", "black", "blue", "white", "brown", "pink", "gray"];

function App() {
  const canvasRef = useRef(null);
  const ctx = useRef(null);

  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [mouseDown, setMouseDown] = useState(false);
  const [lastPosition, setPosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (canvasRef.current) {
      ctx.current = canvasRef.current.getContext("2d");
    }
  }, []);

  const draw = useCallback((x, y) => {
    if (mouseDown) {
      ctx.current.beginPath();
      ctx.current.strokeStyle = selectedColor;
      ctx.current.lineWidth = 10;
      ctx.current.lineJoin = "round";
      ctx.current.moveTo(lastPosition.x, lastPosition.y);
      ctx.current.lineTo(x, y);
      ctx.current.closePath();
      ctx.current.stroke();

      setPosition({
        x,
        y,
      });
    }
  }, [lastPosition, mouseDown, selectedColor, setPosition]);

  const download = async () => {
    const image = canvasRef.current.toDataURL('image/png')
    const blob = await(await fetch(image)).blob()
    const blobURL = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobURL
    link.download = "image.png"
    link.click()
  }

  const clear = () => {
    ctx.current.clearRect(0, 0, ctx.current.canvas.width, ctx.current.canvas.height)
  }

  const onMouseDown = (e) => {
    setPosition({
      x: e.pageX,
      y: e.pageY,
    })
    setMouseDown(true)
  }

  const onMouseUp = (e) => {
    setMouseDown(false)
  }

  const onMouseMove = (e) => {
    draw(e.pageX, e.pageY)
  }

  return (
    <div className="app">
      <h1 className="titulo">Dibuja en Línea</h1>
      <div className="contenedor__canvas">
        <canvas 
          className="canvas"
          width={window.innerWidth - 60}
          height={500}
          ref={canvasRef}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onMouseMove={onMouseMove}
          brushRadius={1}
        />
      </div>

      <br />

      <div className="contenedor__btn">
        <select
          className="btn colors"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
        >
          {colors.map((color) => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>

        <button className="btn borrar" onClick={clear}>Borrar</button>

        <button className="btn descargar" onClick={download}>Descargar</button>
      </div>
      <Footer />
    </div>
  );
}

export default App;

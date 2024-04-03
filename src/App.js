/* eslint-disable no-unused-vars */
/* eslint-disable react/button-has-type */
import React, { useState, useRef, useEffect } from 'react';
import {
  Navbar, Nav, Container, Col, Row,
} from 'react-bootstrap';

function App() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [shapes, setShapes] = useState([]);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
  const [shapeType, setShapeType] = useState('rectangle');
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw shapes on the canvas
    shapes.forEach((shape, index) => {
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = 2;
      if (shape.type === 'rectangle') {
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === 'circle') {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (shape.type === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(shape.x, shape.y);
        ctx.lineTo(shape.x + shape.width, shape.y);
        ctx.lineTo(shape.x + (shape.width / 2), shape.y - shape.height);
        ctx.closePath();
        ctx.stroke();
      }
    });
  }, [shapes]);

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;

    let newShape;
    if (shapeType === 'rectangle') {
      newShape = {
        type: 'rectangle', x: offsetX, y: offsetY, width: 50, height: 50, color: 'blue',
      };
    } else if (shapeType === 'circle') {
      newShape = {
        type: 'circle', x: offsetX, y: offsetY, radius: 25, color: 'red',
      };
    } else if (shapeType === 'triangle') {
      newShape = {
        type: 'triangle', x: offsetX, y: offsetY, width: 50, height: 50, color: 'green',
      };
    }

    setShapes((prevShapes) => [...prevShapes, newShape]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const lastShapeIndex = shapes.length - 1;
    const updatedShapes = [...shapes];
    const lastShape = updatedShapes[lastShapeIndex];

    if (lastShape.type === 'rectangle' || lastShape.type === 'triangle') {
      lastShape.width = offsetX - lastShape.x;
      lastShape.height = offsetY - lastShape.y;
    } else if (lastShape.type === 'circle') {
      const dx = offsetX - lastShape.x;
      const dy = offsetY - lastShape.y;
      lastShape.radius = Math.sqrt(dx * dx + dy * dy);
    }

    setShapes(updatedShapes);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleDeleteShape = () => {
    if (selectedShapeIndex !== null) {
      const updatedShapes = [...shapes];
      updatedShapes.splice(selectedShapeIndex, 1);
      setShapes(updatedShapes);
      setSelectedShapeIndex(null);
    }
  };

  return (
    <div>
      <Navbar bg="light" variant="light">
        <Navbar.Brand>My Navbar</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link>Link 1</Nav.Link>
          <Nav.Link>Link 2</Nav.Link>
          <Nav.Link>Link 3</Nav.Link>
        </Nav>
      </Navbar>

      <Container fluid>
        <Row>
          {/* Sidebar */}
          <Col md={2} style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
            <h2>Sidebar</h2>
            <ul>
              <li><button onClick={() => setShapeType('rectangle')}>Rectangle</button></li>
              <li><button onClick={() => setShapeType('circle')}>Circle</button></li>
              <li><button onClick={() => setShapeType('triangle')}>Triangle</button></li>
            </ul>
            <button onClick={handleDeleteShape}>Delete Shape</button>
          </Col>

          {/* Main Content */}
          <Col md={10}>
            {/* Canvas */}
            <canvas
              ref={canvasRef}
              width={window.innerWidth} // Adjusted width to take full window width
              height={window.innerHeight} // Adjusted height to take full window height
              style={{ width: '100%', height: '100%', border: '1px solid black' }} // Updated style
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;

/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
/* eslint-disable react/button-has-type */
import React, { useState, useRef, useEffect } from 'react';
import {
  Navbar, Nav, Container, Col, Row,
} from 'react-bootstrap';
import {
  Stage, Layer, Text, Arrow, Circle, Rect, RegularPolygon,
} from 'react-konva';

function App() {
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const [arrowPoints, setArrowPoints] = useState(null);
  const [arrows, setArrows] = useState([]);
  const [selectedArrowIndex, setSelectedArrowIndex] = useState(null);
  const [shapes, setShapes] = useState([]);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null); // Add this state variable

  useEffect(() => {
    const handleMouseDown = (e) => {
      const stageElement = stageRef.current;
      const layer = layerRef.current;
      if (!stageElement) return;

      const pos = stageElement.getPointerPosition();
      const selectedShape = layer.getIntersection(pos);

      if (selectedShape) {
        const { className } = selectedShape;
        if (className === 'Circle' || className === 'Rect' || className === 'RegularPolygon') {
          const shapeIndex = selectedShape.index;
          setSelectedArrowIndex(null);
          setArrowPoints([pos.x, pos.y, pos.x, pos.y]);
          setSelectedShapeIndex(shapeIndex);
        }
      } else {
        setArrowPoints([pos.x, pos.y, pos.x, pos.y]);
        setSelectedShapeIndex(null);
        setSelectedArrowIndex(null);
      }
    };

    const handleMouseMove = () => {
      const stageElement = stageRef.current;
      if (!stageElement) return;
      if (arrowPoints) {
        const pos = stageElement.getPointerPosition();
        setArrowPoints((prevPoints) => [prevPoints[0], prevPoints[1], pos.x, pos.y]);
      }
    };

    const handleMouseUp = () => {
      if (selectedArrowIndex !== null && arrowPoints) {
        setArrows((prevArrows) => {
          const updatedArrows = [...prevArrows];
          updatedArrows[selectedArrowIndex] = arrowPoints;
          return updatedArrows;
        });
        setArrowPoints(null);
        setSelectedArrowIndex(null);
      } else if (selectedShapeIndex !== null && arrowPoints) {
        const shape = shapes[selectedShapeIndex];
        const { x, y } = shape.attrs;
        const newArrowPoints = [...arrowPoints, x, y];
        setArrows((prevArrows) => [...prevArrows, newArrowPoints]);
        setArrowPoints(null);
        setSelectedShapeIndex(null);
      } else if (arrowPoints) {
        // Draw an arrow from any point on the canvas
        setArrows((prevArrows) => [...prevArrows, arrowPoints]);
        setArrowPoints(null);
        setSelectedShapeIndex(null);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    const stageElement = stageRef.current;
    if (stageElement) {
      stageElement.addEventListener('mousedown', handleMouseDown);
      stageElement.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (stageElement) {
        stageElement.removeEventListener('mousedown', handleMouseDown);
        stageElement.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, [arrowPoints, selectedArrowIndex, selectedShapeIndex, shapes]);

  const addCircle = () => {
    const circle = {
      type: 'circle',
      attrs: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        radius: 50,
        fill: 'red',
      },
    };
    setShapes([...shapes, circle]);
  };

  const addRectangle = () => {
    const rect = {
      type: 'rect',
      attrs: {
        x: window.innerWidth / 2 - 50,
        y: window.innerHeight / 2 - 25,
        width: 100,
        height: 50,
        fill: 'blue',
      },
    };
    setShapes([...shapes, rect]);
  };

  const addDiamond = () => {
    const diamond = {
      type: 'diamond',
      attrs: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        radius: 50,
        fill: 'green',
        rotation: 45,
      },
    };
    setShapes([...shapes, diamond]);
  };

  return (
    <div>
      <Navbar bg="light" variant="light">
        <Navbar.Brand>Diagram Editor</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link>File</Nav.Link>
          <Nav.Link>Edit</Nav.Link>
          <Nav.Link>Select</Nav.Link>
          <Nav.Link>View</Nav.Link>
          <Nav.Link>Insert</Nav.Link>
        </Nav>
      </Navbar>

      <Container fluid>
        <Row>
          {/* Sidebar */}
          <Col md={2} style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
            <button onClick={addCircle}>Add Circle</button>
            <button onClick={addRectangle}>Add Rectangle</button>
            <button onClick={addDiamond}>Add Diamond</button>
          </Col>

          {/* Main Content */}
          <Col md={10}>
            <div id="container">
              <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                ref={stageRef}
              >
                <Layer ref={layerRef}>
                  {shapes.map((shape, index) => {
                    switch (shape.type) {
                      case 'circle':
                        return (
                          <Circle
                            key={index}
                            {...shape.attrs}
                            draggable
                          />
                        );
                      case 'rect':
                        return (
                          <Rect
                            key={index}
                            {...shape.attrs}
                            draggable
                          />
                        );
                      case 'diamond':
                        return (
                          <RegularPolygon
                            key={index}
                            {...shape.attrs}
                            sides={4}
                            draggable
                          />
                        );
                      default:
                        return null;
                    }
                  })}
                  {arrows.map((points, index) => (
                    <Arrow
                      key={index}
                      points={points}
                      stroke="black"
                      fill="black"
                    />
                  ))}
                  {arrowPoints && (
                    <Arrow
                      points={arrowPoints}
                      stroke="black"
                      fill="black"
                    />
                  )}
                </Layer>
              </Stage>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;

/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
/* eslint-disable react/button-has-type */
import React, { useState, useRef, useEffect } from 'react';
import {
  Navbar, Nav, Container, Col, Row, Form,
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
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
  const [brandName, setBrandName] = useState('Blank diagram');

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
        if (shape && shape.attrs) { // Null check for shape and shape.attrs
          const { x, y } = shape.attrs;
          const newArrowPoints = [...arrowPoints, x, y];
          setArrows((prevArrows) => [...prevArrows, newArrowPoints]);
          setArrowPoints(null);
          setSelectedShapeIndex(null);
        }
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

  const handleTextDblClick = (index) => {
    const updatedShapes = [...shapes];
    const shape = updatedShapes[index];
    const newText = prompt('Enter text:');
    if (newText !== null) {
      shape.attrs.text = newText;
      setShapes(updatedShapes);
    }
  };

  const addCircle = () => {
    const circle = {
      type: 'circle',
      attrs: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        radius: 50,
        fill: 'red',
        text: '', // Initialize text property
        fillText: 'white', // Add fillText property
        fontSize: 12, // Add fontSize property
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
        text: '', // Initialize text property
        fillText: 'white', // Add fillText property
        fontSize: 12, // Add fontSize property
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
        text: '', // Initialize text property
        fillText: 'white', // Add fillText property
        fontSize: 12, // Add fontSize property
      },
    };
    setShapes([...shapes, diamond]);
  };

  const addText = () => {
    const text = {
      type: 'text',
      attrs: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        text: 'Sample Text', // Default text
        fill: 'black',
        fontSize: 18,
        draggable: true,
      },
    };
    setShapes([...shapes, text]);
  };

  return (
    <div>
      <Navbar bg="light" variant="light">
        <Navbar.Brand>
          <Form.Control
            type="text"
            placeholder="Enter brand name"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />
        </Navbar.Brand>
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
            <button onClick={addText}>Add Text</button>
            {' '}
            {/* Button to add text */}
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
                    if (shape && shape.attrs) { // Check if shape and shape.attrs are defined
                      switch (shape.type) {
                        case 'circle':
                          return (
                            <React.Fragment key={index}>
                              <Circle
                                {...shape.attrs}
                                draggable
                                onDblClick={() => handleTextDblClick(index)}
                              />
                              <Text
                                text={shape.attrs.text}
                                x={shape.attrs.x - 20} // Adjust position as needed
                                y={shape.attrs.y - 10} // Adjust position as needed
                                fill={shape.attrs.fillText}
                                fontSize={shape.attrs.fontSize}
                                visible={!!shape.attrs.text}
                              />
                            </React.Fragment>
                          );
                        case 'rect':
                          return (
                            <React.Fragment key={index}>
                              <Rect
                                {...shape.attrs}
                                draggable
                                onDblClick={() => handleTextDblClick(index)}
                              />
                              <Text
                                text={shape.attrs.text}
                                x={shape.attrs.x + 5} // Adjust position as needed
                                y={shape.attrs.y + 20} // Adjust position as needed
                                fill={shape.attrs.fillText}
                                fontSize={shape.attrs.fontSize}
                                visible={!!shape.attrs.text}
                              />
                            </React.Fragment>
                          );
                        case 'diamond':
                          return (
                            <React.Fragment key={index}>
                              <RegularPolygon
                                {...shape.attrs}
                                sides={4}
                                draggable
                                onDblClick={() => handleTextDblClick(index)}
                              />
                              <Text
                                text={shape.attrs.text}
                                x={shape.attrs.x - 25} // Adjust position as needed
                                y={shape.attrs.y - 10} // Adjust position as needed
                                fill={shape.attrs.fillText}
                                fontSize={shape.attrs.fontSize}
                                visible={!!shape.attrs.text}
                              />
                            </React.Fragment>
                          );
                        case 'text':
                          return (
                            <Text
                              key={index}
                              {...shape.attrs}
                              onDblClick={() => handleTextDblClick(index)}
                            />
                          );
                        default:
                          return null;
                      }
                    } else {
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

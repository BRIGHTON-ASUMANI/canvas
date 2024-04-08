/* eslint-disable no-unused-vars */
/* eslint-disable react/button-has-type */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useRef, useEffect } from 'react';
import {
  Navbar, Nav, Container, Col, Row, Form, Button,
} from 'react-bootstrap';
import {
  Stage, Layer, Text, Circle, Rect, RegularPolygon,
} from 'react-konva';
import './App.css'; // Import the CSS file for styling

function App() {
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const [shapes, setShapes] = useState([]);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
  const [brandName, setBrandName] = useState('Blank diagram');
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const applyAction = (action, type) => {
    const { shape, index } = action;
    const updatedShapes = [...shapes];
    switch (type) {
      case 'undo':
        if (shape) {
          updatedShapes.splice(index, 1);
        }
        break;
      case 'redo':
        if (shape) {
          updatedShapes.splice(index, 0, shape);
        }
        break;
      default:
        break;
    }
    setShapes(updatedShapes);
  };

  useEffect(() => {
    const handleUndoRedo = (e) => {
      if (e.ctrlKey) {
        if (e.key === 'z' && undoStack.length > 0) {
          const lastAction = undoStack.pop();
          setRedoStack([...redoStack, lastAction]);
          applyAction(lastAction, 'undo');
        } else if (e.key === 'y' && redoStack.length > 0) {
          const lastAction = redoStack.pop();
          setUndoStack([...undoStack, lastAction]);
          applyAction(lastAction, 'redo');
        }
      }
    };

    document.addEventListener('keydown', handleUndoRedo);

    return () => {
      document.removeEventListener('keydown', handleUndoRedo);
    };
  }, [undoStack, redoStack, shapes]);

  const handleMouseDown = (e) => {
    const stageElement = stageRef.current;
    const layer = layerRef.current;
    if (!stageElement) return;

    const pos = stageElement.getPointerPosition();
    const selectedShape = layer.getIntersection(pos);

    if (selectedShape) {
      const { className } = selectedShape;
      if (className === 'Circle' || className === 'Rect' || className === 'RegularPolygon' || className === 'Text') {
        const shapeIndex = selectedShape.index;
        setSelectedShapeIndex(shapeIndex);
      }
    } else {
      setSelectedShapeIndex(null);
    }
  };

  const handleTextDblClick = (index) => {
    const updatedShapes = [...shapes];
    const shape = updatedShapes[index];

    // Check if the shape is a text shape
    if (shape && shape.type === 'text' && shape.attrs) {
      const newText = prompt('Enter new text:', shape.attrs.text);
      if (newText !== null) {
        shape.attrs.text = newText;
        const action = { shape, index, type: 'update' };
        setUndoStack([...undoStack, action]);
        setShapes(updatedShapes);
      }
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
    const action = { shape: circle, index: shapes.length };
    setUndoStack([...undoStack, action]);
    setShapes([...shapes, circle]);
    setRedoStack([]); // Clear redo stack when a new action is performed
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
    const action = { shape: rect, index: shapes.length };
    setUndoStack([...undoStack, action]);
    setShapes([...shapes, rect]);
    setRedoStack([]); // Clear redo stack when a new action is performed
  };

  const addDiamond = () => {
    const diamond = {
      type: 'diamond',
      attrs: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        radius: 50,
        fill: 'cyan',
        rotation: 90,
        text: '', // Initialize text property
        fillText: 'white', // Add fillText property
        fontSize: 12, // Add fontSize property
      },
    };
    const action = { shape: diamond, index: shapes.length };
    setUndoStack([...undoStack, action]);
    setShapes([...shapes, diamond]);
    setRedoStack([]); // Clear redo stack when a new action is performed
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
    const action = { shape: text, index: shapes.length };
    setUndoStack([...undoStack, action]);
    setShapes([...shapes, text]);
    setRedoStack([]); // Clear redo stack when a new action is performed
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const lastAction = undoStack.pop();
      setRedoStack([...redoStack, lastAction]);
      applyAction(lastAction, 'undo');
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const lastAction = redoStack.pop();
      setUndoStack([...undoStack, lastAction]);
      applyAction(lastAction, 'redo');
    }
  };

  const handleDelete = () => {
    if (selectedShapeIndex !== null) {
      const updatedShapes = shapes.filter((shape, index) => index !== selectedShapeIndex);
      setShapes(updatedShapes);
      setSelectedShapeIndex(null);
    }
  };

  const handleDownload = () => {
    const stage = stageRef.current.getStage();
    const dataURL = stage.toDataURL();
    const link = document.createElement('a');
    link.download = 'canvas_screenshot.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <Navbar
        bg="light"
        variant="
light">
        <Navbar.Brand>
          <Form.Control
            type="text"
            placeholder="Enter brand name"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />
        </Navbar.Brand>
        <Nav>
          <Nav.Link onClick={() => handleUndo()}>Undo</Nav.Link>
          <Nav.Link onClick={() => handleRedo()}>Redo</Nav.Link>
          <Nav.Link onClick={() => handleDelete()}>Delete</Nav.Link>
          {' '}
          {/* Delete button */}
        </Nav>
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
            <Button variant="primary" onClick={handleDownload}>Download Screenshot</Button>

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
                <Layer ref={layerRef} onMouseDown={handleMouseDown}>
                  {shapes.map((shape, index) => {
                    if (shape && shape.attrs) { // Check if shape and shape.attrs are defined
                      const isSelected = selectedShapeIndex === index;
                      return (
                        <React.Fragment key={index}>
                          {shape.type === 'circle' && (
                          <>
                            <Circle
                              {...shape.attrs}
                              draggable
                              onDblClick={() => handleTextDblClick(index)}
                              className={isSelected ? 'selected' : ''}
                            />
                            <Text
                              text={shape.attrs.text}
                              x={shape.attrs.x - 20} // Adjust position as needed
                              y={shape.attrs.y - 10} // Adjust position as needed
                              fill={shape.attrs.fillText}
                              fontSize={shape.attrs.fontSize}
                              visible={!!shape.attrs.text}
                              width={60} // Set the width to limit text to 30 characters
                              align="center" // Align text to center
                              wrap="word" // Wrap text by word
                            />
                          </>
                          )}
                          {shape.type === 'rect' && (
                          <>
                            <Rect
                              {...shape.attrs}
                              draggable
                              onDblClick={() => handleTextDblClick(index)}
                              className={isSelected ? 'selected' : ''}
                            />
                            <Text
                              text={shape.attrs.text}
                              x={shape.attrs.x + 5} // Adjust position as needed
                              y={shape.attrs.y + 20} // Adjust position as needed
                              fill={shape.attrs.fillText}
                              fontSize={shape.attrs.fontSize}
                              visible={!!shape.attrs.text}
                              width={60} // Set the width to limit text to 30 characters
                              align="center" // Align text to center
                              wrap="word" // Wrap text by word
                            />
                          </>
                          )}
                          {shape.type === 'diamond' && (
                          <>
                            <RegularPolygon
                              {...shape.attrs}
                              sides={4}
                              draggable
                              onDblClick={() => handleTextDblClick(index)}
                              className={isSelected ? 'selected' : ''}
                            />
                            <Text
                              text={shape.attrs.text}
                              x={shape.attrs.x - 25} // Adjust position as needed
                              y={shape.attrs.y - 10} // Adjust position as needed
                              fill={shape.attrs.fillText}
                              fontSize={shape.attrs.fontSize}
                              visible={!!shape.attrs.text}
                              width={60} // Set the width to limit text to 30 characters
                              align="center" // Align text to center
                              wrap="word" // Wrap text by word
                            />
                          </>
                          )}
                          {shape.type === 'text' && (
                          <Text
                            key={index}
                            {...shape.attrs}
                            onDblClick={() => handleTextDblClick(index)}
                            className={isSelected ? 'selected' : ''}
                          />
                          )}
                        </React.Fragment>
                      );
                    }
                    return null;
                  })}
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

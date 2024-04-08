/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable react/button-has-type */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useRef, useEffect } from 'react';
import {
  Navbar, Nav, Container, Col, Row, Form, Card, Dropdown,
} from 'react-bootstrap';
import {
  Stage, Layer, Text, Circle, Rect, RegularPolygon,
} from 'react-konva';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faRedo, faTrash } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function App() {
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const [shapes, setShapes] = useState([]);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
  const [brandName, setBrandName] = useState('Name of the project');
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
        fill: 'transparent', // Inside color
        stroke: 'red', // Border color
        text: '', // Initialize text property
        strokeWidth: 5,
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
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        width: 150,
        height: 100,
        fill: 'transparent', // Inside color
        stroke: 'blue', // Border color
        strokeWidth: 5,
        text: 'teststst', // Initialize text property
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
        fill: 'transparent', // Inside color
        stroke: 'cyan', // Border color
        strokeWidth: 5,
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
            style={{ fontWeight: 'bold', fontSize: '16px' }}
          />
        </Navbar.Brand>
        <Nav>
          <Nav.Link onClick={handleUndo}>
            <FontAwesomeIcon icon={faUndo} />
&nbsp;
            Undo
          </Nav.Link>
          <Nav.Link onClick={handleRedo}>
            <FontAwesomeIcon icon={faRedo} />
&nbsp;
            Redo
          </Nav.Link>
          <Nav.Link onClick={() => handleDelete()}>
            {' '}
            <FontAwesomeIcon icon={faTrash} />
&nbsp;
            Delete
          </Nav.Link>

        </Nav>
        <Nav className="mr-auto">
          <Dropdown>
            <Dropdown.Toggle as={Nav.Link} id="file-dropdown">
              File
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                variant="primary"
                onClick={handleDownload}
              >
                Download Project
              </Dropdown.Item>
              <Dropdown.Item>test</Dropdown.Item>
              <Dropdown.Item>test</Dropdown.Item>
              <Dropdown.Item>test</Dropdown.Item>
              <Dropdown.Item>test</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Nav.Link disabled>Edit</Nav.Link>
          <Nav.Link disabled>Select</Nav.Link>
          <Nav.Link disabled>View</Nav.Link>
          <Nav.Link disabled>Insert</Nav.Link>
        </Nav>
      </Navbar>
      <Container fluid>
        <Row>
          <Col md={2} className="sidebar">
            <Card className="px-2 pt-2">
              <h6>Add Shapes</h6>
              <div className="shape-container">
                <svg width="40" height="40" onClick={addCircle}>
                  <circle stroke="black" strokeWidth="3" fill="transparent" cx="20" cy="20" r="18" />
                </svg>
                <svg width="40" height="40" onClick={addRectangle}>
                  <rect stroke="black" strokeWidth="3" fill="transparent" x="2" y="2" width="46" height="26" />
                </svg>
                <svg width="40" height="40" onClick={addDiamond}>
                  <polygon stroke="black" strokeWidth="3" fill="transparent" rotate={90} points="20,2 38,20 20,38 2,20" />
                </svg>
                <svg width="50" height="50" onClick={addText}>
                  <text stroke="black" strokeWidth="3" x="10" y="30" fontSize="24" fontWeight="bold">T</text>
                </svg>

                <div onClick={() => handleDelete()}>
                  <span>Delete shape</span>
                  <FontAwesomeIcon icon={faTrash} />
                </div>
              </div>
            </Card>
          </Col>

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
                          <Circle
                            {...shape.attrs}
                            draggable
                            onDblClick={() => handleTextDblClick(index)}
                            className={isSelected ? 'selected' : ''}
                          />
                          )}
                          {shape.type === 'rect' && (
                          <Rect
                            {...shape.attrs}
                            draggable
                            onDblClick={() => handleTextDblClick(index)}
                            className={isSelected ? 'selected' : ''}
                          />
                          )}
                          {shape.type === 'diamond' && (
                          <RegularPolygon
                            {...shape.attrs}
                            sides={4}
                            draggable
                            onDblClick={() => handleTextDblClick(index)}
                            className={isSelected ? 'selected' : ''}
                          />
                          )}
                          {shape.type === 'text' && (
                          <Text
                            key={index}
                            {...shape.attrs}
                            onDblClick={() => handleTextDblClick(index)}
                            className={isSelected ? 'selected' : ''}
                            width={90} // Set the width to limit text to 30 characters
                            align="center" // Align text to center
                            wrap="word"
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

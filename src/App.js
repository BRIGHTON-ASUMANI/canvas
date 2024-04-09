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
  Transformer,
  Arrow,
} from 'react-konva';
import './App.css';
import Sidebar from './components/SideBar';
import CustomNavbar from './components/Navbar';

function App() {
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const [shapes, setShapes] = useState([]);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
  const [brandName, setBrandName] = useState('Enter Name');
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [circleColor, setCircleColor] = useState('red');
  const [rectangleColor, setRectangleColor] = useState('blue');
  const [diamondColor, setDiamondColor] = useState('cyan');
  const [textColor, setTextColor] = useState('black');
  const [selectedId, setSelectedId] = useState(null);
  const trRef = useRef();

  useEffect(() => {
    if (selectedId) {
      trRef.current.nodes([stageRef.current.findOne(`#${selectedId}`)]);
      trRef.current.getLayer().batchDraw();
    }
  }, [selectedId]);

  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const handleDragEnd = (index, e) => {
    const newShapes = [...shapes];
    newShapes[index] = {
      ...newShapes[index],
      x: e.target.x(),
      y: e.target.y(),
    };
    setShapes(newShapes);
  };

  const handleTransformEnd = (index, e) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const width = Math.max(5, node.width() * scaleX);
    const height = Math.max(node.height() * scaleY);
    const newShapes = [...shapes];
    newShapes[index] = {
      ...newShapes[index],
      x: node.x(),
      y: node.y(),
      width,
      height,
    };
    setShapes(newShapes);
    node.scaleX(1);
    node.scaleY(1);
  };

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
      if (
        className === 'Circle'
        || className === 'Rect'
        || className === 'RegularPolygon'
        || className === 'Text'
      ) {
        const shapeIndex = selectedShape.index;
        setSelectedShapeIndex(shapeIndex);
        setSelectedId(selectedShape.attrs.id); // Update selectedId state as well
      }
    } else {
      setSelectedShapeIndex(null);
      setSelectedId(null); // Clear selectedId state when clicking on empty area
    }
  };

  const handleTextDblClick = (index) => {
    const updatedShapes = [...shapes];
    const shape = updatedShapes[index];

    // Check if the shape is a text shape
    if (shape && shape.type === 'text') {
      const newText = prompt('Enter new text:', shape.text);
      if (newText !== null) {
        shape.text = newText;
        const action = { shape, index, type: 'update' };
        setUndoStack([...undoStack, action]);
        setShapes(updatedShapes);
      }
    }
  };

  const addCircle = () => {
    const circle = {
      type: 'circle',
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      radius: 50,
      fill: 'transparent', // Inside color
      stroke: circleColor, // Border color
      text: '',
      // strokeWidth: 3,
      fillText: 'white',
      fontSize: 12,
      id: `circle${shapes.length + 1}`,
    };
    const action = { shape: circle, index: shapes.length };
    setUndoStack([...undoStack, action]);
    setShapes([...shapes, circle]);
    setSelectedId(circle.id);
    setRedoStack([]);
  };

  const addRectangle = () => {
    const rect = {
      type: 'rect',
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      width: 150,
      height: 100,
      fill: 'transparent', // Inside color
      stroke: rectangleColor, // Border color
      // strokeWidth: 3,
      fontSize: 12,
      id: `rect${shapes.length + 1}`,

    };
    const action = { shape: rect, index: shapes.length };
    setUndoStack([...undoStack, action]);
    setShapes([...shapes, rect]);
    setSelectedId(rect.id);
    setRedoStack([]);
  };

  const addDiamond = () => {
    const diamond = {
      type: 'diamond',
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      sides: 4,
      radius: 50 * Math.sqrt(2), // Calculate radius based on side length for a regular polygon
      fill: 'transparent',
      stroke: diamondColor,
      // strokeWidth: 3,
      rotation: 45,
      text: '',
      fillText: 'white',
      fontSize: 12,
      id: `diamond${shapes.length + 1}`,
    };
    const action = { shape: diamond, index: shapes.length };
    setUndoStack([...undoStack, action]);
    setShapes([...shapes, diamond]);
    setSelectedId(diamond.id);
    setRedoStack([]);
  };

  const addArrow = () => {
    const arrow = {
      type: 'arrow',
      points: [100, 100, 200, 200], // Change points as needed
      pointerLength: 10,
      pointerWidth: 10,
      fill: 'black',
      stroke: 'black',
      strokeWidth: 2,
      draggable: true,
      id: `arrow${shapes.length + 1}`,
    };
    const action = { shape: arrow, index: shapes.length };
    setUndoStack([...undoStack, action]);
    setShapes([...shapes, arrow]);
    setSelectedId(arrow.id);
    setRedoStack([]);
  };

  const addText = () => {
    const text = {
      type: 'text',
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      text: 'Sample Text',
      fill: textColor,
      fontSize: 18,
      draggable: true,
    };
    const action = { shape: text, index: shapes.length };
    setUndoStack([...undoStack, action]);
    setShapes([...shapes, text]);
    // setSelectedId(text.id);
    setRedoStack([]);
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
      <CustomNavbar
        brandName={brandName}
        setBrandName={setBrandName}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        handleDownload={handleDownload}
      />
      <Container fluid>
        <Row>
          <Col md={2} className="sidebar">
            <Sidebar
              addCircle={addCircle}
              addRectangle={addRectangle}
              addDiamond={addDiamond}
              addText={addText}
              addArrow={addArrow}
              circleColor={circleColor}
              setCircleColor={setCircleColor}
              rectangleColor={rectangleColor}
              setRectangleColor={setRectangleColor}
              diamondColor={diamondColor}
              setDiamondColor={setDiamondColor}
              textColor={textColor}
              setTextColor={setTextColor}
            />
          </Col>

          <Col md={10}>
            <div id="container">
              <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                ref={stageRef}
              >
                <Layer>
                  {shapes.map((shape, index) => {
                    if (shape) {
                      return (
                        <React.Fragment key={index}>
                          {shape.type === 'circle' && (
                          <Circle
                            {...shape}
                            draggable
                            onClick={() => setSelectedId(shape.id)}
                            onTap={() => setSelectedId(shape.id)}
                            onDragEnd={(e) => handleDragEnd(index, e)}
                          />
                          )}
                          {shape.type === 'rect' && (
                          <Rect
                            {...shape}
                            draggable
                            onClick={() => setSelectedId(shape.id)}
                            onTap={() => setSelectedId(shape.id)}
                            onDragEnd={(e) => handleDragEnd(index, e)}
                            onTransformEnd={(e) => handleTransformEnd(index, e)}
                          />
                          )}
                          {shape.type === 'diamond' && (
                          <RegularPolygon
                            {...shape}
                            draggable
                            onClick={() => setSelectedId(shape.id)}
                            onTap={() => setSelectedId(shape.id)}
                            onDragEnd={(e) => handleDragEnd(index, e)}
                            onTransformEnd={(e) => handleTransformEnd(index, e)}
                          />
                          )}
                          {shape.type === 'text' && (
                          <Text
                            // key={index}
                            onDblClick={() => handleTextDblClick(index)}
                            {...shape}
                            draggable
                            onClick={() => setSelectedId(shape.id)}
                            onTap={() => setSelectedId(shape.id)}
                            onDragEnd={(e) => handleDragEnd(index, e)}
                            onTransformEnd={(e) => handleTransformEnd(index, e)}
                          />
                          )}
                          {shape.type === 'arrow' && (
                          <Arrow
                            key={shape.id}
                            {...shape}
                            onClick={() => setSelectedId(shape.id)}
                            onTap={() => setSelectedId(shape.id)}
                            onDragStart={() => {
                              // Add logic to update the selected shape index
                              const selectedIndex = shapes.findIndex(
                                (item) => item.id === shape.id,
                              );
                              setSelectedShapeIndex(selectedIndex);
                            }}
                            onDragEnd={(e) => {
                              // Update the position of the arrow shape when drag ends
                              const selectedIndex = shapes.findIndex(
                                (item) => item.id === shape.id,
                              );
                              const newShapes = [...shapes];
                              newShapes[selectedIndex] = {
                                ...newShapes[selectedIndex],
                                x: e.target.x(),
                                y: e.target.y(),
                              };
                              setShapes(newShapes);
                            }}
                            draggable
                          />
                          )}
                          {selectedId === shape.id && (
                          <Transformer
                            ref={trRef}
                            boundBoxFunc={(oldBox, newBox) => {
                              if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                                return oldBox;
                              }
                              return newBox;
                            }}
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

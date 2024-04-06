/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
/* eslint-disable react/button-has-type */
import React, { useState, useRef, useEffect } from 'react';
import {
  Navbar, Nav, Container, Col, Row,
} from 'react-bootstrap';
import {
  Stage, Layer, Text, Arrow,
} from 'react-konva';

function App() {
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const [arrowPoints, setArrowPoints] = useState(null);
  const [arrows, setArrows] = useState([]);
  const [selectedArrowIndex, setSelectedArrowIndex] = useState(null);

  useEffect(() => {
    const handleMouseDown = (e) => {
      const stageElement = stageRef.current;
      const layer = layerRef.current;
      if (!stageElement) return;

      const pos = stageElement.getPointerPosition();
      const selectedArrow = layer.getIntersection(pos);
      if (selectedArrow && selectedArrow.className === 'Arrow') {
        const { index } = selectedArrow;
        setSelectedArrowIndex(index);
        const points = selectedArrow.points();
        setArrowPoints([points[0], points[1], points[2], points[3]]);
      } else {
        setArrowPoints([pos.x, pos.y, pos.x, pos.y]);
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
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    const stageElement = stageRef.current; // Renamed to stageElement to avoid conflict
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
  }, [arrowPoints, selectedArrowIndex]);

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
          <Col md={2} style={{ backgroundColor: '#f0f0f0', padding: '10px' }} />

          {/* Main Content */}
          <Col md={10}>
            <div id="container">
              <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                ref={stageRef}
              >
                <Layer ref={layerRef}>
                  <Text text="Try to draw an arrow" />
                  {arrows.map((points, index) => (
                    <Arrow
                      key={index}
                      points={points}
                      stroke="black"
                      fill="black"
                      draggable
                      onDragEnd={(e) => {
                        const updatedArrows = [...arrows];
                        updatedArrows[index] = [e.target.x(), e.target.y(),
                          e.target.x() + (points[2] - points[0]),
                          e.target.y() + (points[3] - points[1])];
                        setArrows(updatedArrows);
                      }}
                    />
                  ))}
                  {/* Render the currently drawing arrow if arrowPoints is not null */}
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

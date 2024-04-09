/* eslint-disable react/prop-types */
/* eslint-disable react/button-has-type */
import React from 'react';
import { Form, Card } from 'react-bootstrap';

function Sidebar({
  addCircle,
  addRectangle,
  addDiamond,
  addText,
  addArrow, // New prop for adding arrows
  circleColor,
  setCircleColor,
  rectangleColor,
  setRectangleColor,
  diamondColor,
  setDiamondColor,
  textColor,
  setTextColor,
}) {
  return (
    <Card className="px-2 pt-2">
      <div>
        <h6>Add Colors</h6>
        <div className="shape-container">
          {/* Input for Circle Color */}
          <Form.Group controlId="circleColor">
            <Form.Label>Circle Color</Form.Label>
            <Form.Control
              type="color"
              value={circleColor}
              onChange={(e) => setCircleColor(e.target.value)}
            />
          </Form.Group>

          {/* Input for Rectangle Color */}
          <Form.Group controlId="rectangleColor">
            <Form.Label>Rectangle Color</Form.Label>
            <Form.Control
              type="color"
              value={rectangleColor}
              onChange={(e) => setRectangleColor(e.target.value)}
            />
          </Form.Group>

          {/* Input for Diamond Color */}
          <Form.Group controlId="diamondColor">
            <Form.Label>Diamond Color</Form.Label>
            <Form.Control
              type="color"
              value={diamondColor}
              onChange={(e) => setDiamondColor(e.target.value)}
            />
          </Form.Group>

          {/* Input for Text Color */}
          <Form.Group controlId="textColor">
            <Form.Label>Text Color</Form.Label>
            <Form.Control
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
            />
          </Form.Group>
        </div>
      </div>
      <hr />
      {/* Divider between color and shape sections */}
      <div>
        <h6>Add Shapes & Text</h6>
        <div className="shape-container">
          {/* SVG Icons for adding shapes */}
          <div className="shape-icons">
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
            <svg width="50" height="50" onClick={addArrow}>
              <polygon points="0,20 30,10 30,30" fill="black" />
            </svg>
          </div>

          {/* Delete shape button */}
          {/* <div className="delete-shape" onClick={() => handleDelete()}> */}
          {/* <span>Delete shape</span> */}
          {/* <FontAwesomeIcon
            icon={faTrash}
            size="5x"
            shake={selectedShapeIndex !== null}
            onClick={() => handleDelete()}
          /> */}
          {/* </div> */}
        </div>
      </div>
    </Card>
  );
}

export default Sidebar;

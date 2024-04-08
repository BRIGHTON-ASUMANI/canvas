/* eslint-disable react/prop-types */
/* eslint-disable react/button-has-type */
// Sidebar.js
import React from 'react';
import { Col, Button } from 'react-bootstrap';

function Sidebar({
  addCircle, addRectangle, addDiamond, addText, handleDownload,
}) {
  return (
    <Col md={2} style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
      <button onClick={addCircle}>Add Circle</button>
      <button onClick={addRectangle}>Add Rectangle</button>
      <button onClick={addDiamond}>Add Diamond</button>
      <button onClick={addText}>Add Text</button>
      <Button variant="primary" onClick={handleDownload}>Download Screenshot</Button>
    </Col>
  );
}

export default Sidebar;

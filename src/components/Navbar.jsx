/* eslint-disable react/prop-types */
// Navbar.js
import React from 'react';
import { Navbar, Nav, Form } from 'react-bootstrap';

function CustomNavbar({
  brandName, setBrandName, handleUndo, handleRedo, handleDelete,
}) {
  return (
    <Navbar bg="light" variant="light">
      <Navbar.Brand>
        <Form.Control
          type="text"
          placeholder="Enter brand name"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
        />
      </Navbar.Brand>
      <Nav>
        <Nav.Link onClick={handleUndo}>Undo</Nav.Link>
        <Nav.Link onClick={handleRedo}>Redo</Nav.Link>
        <Nav.Link onClick={handleDelete}>Delete</Nav.Link>
      </Nav>
      <Nav className="mr-auto">
        <Nav.Link>File</Nav.Link>
        <Nav.Link>Edit</Nav.Link>
        <Nav.Link>Select</Nav.Link>
        <Nav.Link>View</Nav.Link>
        <Nav.Link>Insert</Nav.Link>
      </Nav>
    </Navbar>
  );
}

export default CustomNavbar;

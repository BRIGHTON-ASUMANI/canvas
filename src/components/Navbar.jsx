/* eslint-disable react/prop-types */
// Navbar.js
import React from 'react';
import {
  Navbar, Nav, Form, Dropdown,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faRedo } from '@fortawesome/free-solid-svg-icons';

function CustomNavbar({
  brandName, setBrandName, handleUndo, handleRedo, handleDownload,
}) {
  return (
    <Navbar
      bg="light"
      variant="
light"
    >
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
  );
}

export default CustomNavbar;

import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const schemaOptions = [
  { label: 'First Name', value: 'first_name' },
  { label: 'Last Name', value: 'last_name' },
  { label: 'Gender', value: 'gender' },
  { label: 'Age', value: 'age' },
  { label: 'Account Name', value: 'account_name' },
  { label: 'City', value: 'city' },
  { label: 'State', value: 'state' },
];

const App = () => {
  const [show, setShow] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [availableSchemas, setAvailableSchemas] = useState(schemaOptions);
  const [currentSchema, setCurrentSchema] = useState('');

  const handleAddSchema = () => {
    if (currentSchema && !selectedSchemas.includes(currentSchema)) {
      const newSchema = availableSchemas.find(schema => schema.value === currentSchema);
      setSelectedSchemas([...selectedSchemas, newSchema]);
      setAvailableSchemas(availableSchemas.filter(schema => schema.value !== currentSchema));
      setCurrentSchema('');
    }
  };

  const handleRemoveSchema = (value) => {
    const removedSchema = selectedSchemas.find(schema => schema.value === value);
    setSelectedSchemas(selectedSchemas.filter(schema => schema.value !== value));
    setAvailableSchemas([...availableSchemas, removedSchema]);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        segment_name: segmentName,
        schema: selectedSchemas.map(schema => ({ [schema.value]: schema.label })),
      };
      const response = await fetch('https://webhook.site/705898df-0563-4fb6-8f97-391b05480058', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Success:', data);
      setShow(false);
    } catch (error) {
      console.error('Submit failed:', error);
    }
  };

  return (
    <div className="container mt-4">
      <Button variant="primary" onClick={() => setShow(true)}>
        Save Segment
      </Button>

      <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Saving Segment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Enter the Name of the Segment</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name of the segment"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
            />
          </Form.Group>

          <div className="mt-3">
            <p>To save your segment, you need to add the schemas to build the query:</p>
            <div className="border p-3 rounded bg-light">
              {selectedSchemas.map((schema, index) => (
                <Row key={index} className="align-items-center mb-2">
                  <Col md={10}>
                    <Form.Control as="select" disabled value={schema.value}>
                      <option value={schema.value}>{schema.label}</option>
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button variant="danger" onClick={() => handleRemoveSchema(schema.value)}>
                      Remove
                    </Button>
                  </Col>
                </Row>
              ))}

              <Row className="align-items-center mt-3">
                <Col md={10}>
                  <Form.Control
                    as="select"
                    value={currentSchema}
                    onChange={(e) => setCurrentSchema(e.target.value)}
                  >
                    <option value="">Add schema to segment</option>
                    {availableSchemas.map((schema) => (
                      <option key={schema.value} value={schema.value}>
                        {schema.label}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
                <Col md={2}>
                  <Button variant="success" onClick={handleAddSchema}>
                    + Add
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save the Segment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default App;

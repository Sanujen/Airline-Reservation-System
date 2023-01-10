import React, { useState, useEffect } from "react";
import Axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.css";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import ShowTable from "./showTable";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
const date = new Date();
const futureDate = date.getDate();
date.setDate(futureDate);
const currentDate = date.toLocaleDateString("en-CA");

function SearchFlights({ userid }) {
  const [show, setShow] = useState(false);
  const [departDate, setDepartDate] = useState(currentDate);
  const [flights, setflights] = useState([]);
  const [returnDate, setReturnDate] = useState(currentDate);
  const [origins, setOrigins] = useState([]);
  const [newOrigin, setNewOrigin] = useState("");
  const [newDestination, setNewDestination] = useState("");

  useEffect(() => {
    Axios.get("http://localhost:4000/flight/origins").then((response) => {
      const { data } = response;
      setOrigins(data);
    });
  }, []);

  const showFlights = () => {
    const origin = newOrigin.slice(0, 3);
    const destination = newDestination.slice(0, 3);
    const flightInfo = { origin: origin, destination: destination, departDate: departDate, returnDate: returnDate };
    console.log([origin, destination, departDate, returnDate]);
    Axios.post("http://localhost:4000/flight/viewFlights", flightInfo).then((response) => {
      console.log(response.data.length);
      setflights(response.data);
      setShow(true);
    });
  };

  return (
    <>
      <Container className="rounded rounded-5 bg-secondary bg-gradient border-secondary  my-5 hover-shadow">
        <Row>
          <Form.Group as={Col} controlId="formGridState">
            <Form.Label>Origin</Form.Label>
            <Form.Select onChange={(e) => setNewOrigin(e.target.value)} value={newOrigin}>
              <option>Choose...</option>
              {origins.map((from) => {
                const { origin } = from;
                return (
                  <option key={origin} value={origin}>
                    {origin}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} controlId="formGridState">
            <Form.Label>Destination</Form.Label>
            <Form.Select onChange={(e) => setNewDestination(e.target.value)} value={newDestination}>
              <option>Choose...</option>
              {origins.map((from) => {
                const { origin } = from;
                return (
                  <option key={origin} value={origin}>
                    {origin}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} controlId="formGridState">
            <Form.Label>From </Form.Label>
            <Form.Control type="date" name="datepic" placeholder="DatzeRange" value={departDate} onChange={(e) => setDepartDate(e.target.value)} />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridState">
            <Form.Label>To</Form.Label>
            <Form.Control type="date" name="datepic" placeholder="DateRange" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
          </Form.Group>
        </Row>
        <Row className="mt-3">
          <Button
            variant="primary"
            onClick={() => {
              showFlights();
            }}
          >
            Show Flights
          </Button>
        </Row>
      </Container>
      {flights.length === 0 && show && (
        <Container>
          <Alert variant="warning"> No Flights Available</Alert>
        </Container>
      )}

      {flights.length !== 0 && show && <ShowTable flights={flights} userid={userid} />}
    </>
  );
}

export { SearchFlights, currentDate };

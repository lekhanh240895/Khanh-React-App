import React from "react";
import { Form } from "react-bootstrap";

export default function CountrySelector({ countries, value, handleOnChange }) {
  return (
    <Form className="mb-4">
      <Form.Label htmlFor="country">Quốc gia</Form.Label>
      <Form.Select
        id="country"
        value={value}
        onChange={handleOnChange}
        name="country"
      >
        {countries.map((country) => (
          <option key={country.Country} value={country.ISO2.toLowerCase()}>
            {country.Country}
          </option>
        ))}
      </Form.Select>
      <Form.Text muted>Lựa chọn quốc gia</Form.Text>
    </Form>
  );
}

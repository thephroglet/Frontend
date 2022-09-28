import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const DatepickerRangeMultiple = (props) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  return (
    <>
      <Row className="g-2">
        <Col xs="auto">
          <DatePicker
            className="form-control"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy/MM/dd"
            startDate={startDate}
            endDate={endDate}
          />
        </Col>
        <Col xs="auto">
          <DatePicker
            className="form-control"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy/MM/dd"
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
          />
        </Col>
      </Row>
    </>
  );
};

export const DatepickerRangeSingle = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  return (
    <>
      <DatePicker className="form-control" selected={startDate} onChange={onChange} startDate={startDate} endDate={endDate} selectsRange />
    </>
  );
};

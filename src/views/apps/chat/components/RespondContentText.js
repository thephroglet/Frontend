import React from 'react';

const RespondContentText = ({ name, text, time }) => {
  return (
    <div className="bg-separator-light d-inline-block rounded-md py-3 px-3 pe-7 position-relative text-alternate">
      <p className="text"><strong>{name}</strong></p>
      <p className="text">{text}</p>
      <p className="position-absolute text-extra-small text-alternate opacity-75 b-2 e-2 time">{time}</p>
    </div>
  );
};
export default RespondContentText;

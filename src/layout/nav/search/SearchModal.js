import React from 'react';
import { Modal } from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import SearchInput from './SearchInput';

const SearchModal = ({ show, setShow }) => {
  return (
    <Modal id="searchPagesModal" className="modal-under-nav modal-search modal-close-out" size="lg" show={show} onHide={() => setShow(false)}>
     
    </Modal>
  );
};

export default SearchModal;

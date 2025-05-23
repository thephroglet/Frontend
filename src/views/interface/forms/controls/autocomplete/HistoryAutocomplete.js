import React, { useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';


const API_URL = 'http://localhost:8080/'

const HistoryAutoComplete = () => {
  const [valueState, setValueState] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [data, setData] = useState(null);

  useEffect((idUser) => {
    axios.get(`${API_URL}/file/getUserFiles/${idUser}`).then((res) => {
      setData(res.data);
    });
  }, []);

  const escapeRegexCharacters = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const getSuggestions = (value) => {
    const escapedValue = escapeRegexCharacters(value.trim());
    if (escapedValue === '') {
      return [];
    }
    const regex = new RegExp(`^${escapedValue}`, 'i');
    return data.filter((product) => regex.test(product.name));
  };

  const changeInput = (event, { newValue }) => {
    setValueState(newValue);
  };

  const onSuggestionsFetchRequested = ({ value: val }) => {
    setSuggestions(getSuggestions(val));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = (suggestion) => suggestion.name;

  const renderSuggestion = (suggestion) => <div>{suggestion.name}</div>;

  const renderInputComponent = (props) => <input {...props} className="form-control" />;

  if (!data) {
    return <></>;
  }

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      focusInputOnSuggestionClick={false}
      inputProps={{
        placeholder: '',
        value: valueState,
        onChange: changeInput,
      }}
      renderInputComponent={renderInputComponent}
    />
  );
};

export default HistoryAutoComplete;

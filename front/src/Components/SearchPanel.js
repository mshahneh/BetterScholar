import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import "./CSS/SearchPanel.css"


export default function SearchPanel({ onSubmit }) {
  // Declare a new state variable, which we'll call "count"
  const [inputValue, setInputValue] = useState("");
  const onChangeHandler = event => {
    setInputValue(event.target.value);
  };

  return (
    <div id="search-panel">
      <TextField fullWidth InputProps={{
        disableUnderline: true, startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        )
      }} id="filled-basic" label="Add Researcher" variant="filled" onChange={onChangeHandler} />
      <Button disableElevation onClick={() => onSubmit(inputValue)} variant="contained"> Submit </Button>
    </div>
  );
}
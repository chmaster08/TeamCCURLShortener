"use client";
import { TextField } from "@mui/material";
import { useState } from "react";

interface SearchBoxProps {
  onSearchChanged: (searchText: string) => void;
}

export default function SearchBox(props: SearchBoxProps) {
  const [searchText, setSearchText] = useState<string>("");

  const handleSearchTextChanged = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    props.onSearchChanged(event.target.value);
    setSearchText(event.target.value);
  };

  return (
    <TextField
      label="Search"
      variant="outlined"
      fullWidth
      value={searchText}
      onChange={handleSearchTextChanged}
      sx={{ maxWidth: 300 }}
    />
  );
}

"use client";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
} from "@mui/material";
import { URLItem } from "../types/urlItem";
import { useState } from "react";

export interface URLListProps {
  urls: URLItem[];
  onSelectionChange: (url: URLItem | undefined) => void;
}

export default function URLList(props: URLListProps) {
  const [selectedItem, setSelectedItem] = useState<URLItem | undefined>(
    undefined,
  );

  const handleListItemClick = (e: URLItem) => {
    setSelectedItem(e);
    props.onSelectionChange(e);
  };
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 300,
        overflow: "auto",
        bgcolor: "background.papaer",
      }}
    >
      <List style={{ overflow: "auto" }}>
        {props.urls.map((item) => (
          <ListItemButton
            key={item.OriginalURL}
            selected={selectedItem?.OriginalURL === item.OriginalURL}
            onClick={() => handleListItemClick(item)}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <ListItemText
                primary={item.OriginalURL}
                secondary={item.ShortenedURL}
              />
            </Box>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}

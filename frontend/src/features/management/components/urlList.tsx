import Url from "@/libs/model/url";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import URLCard from "./urlCard";
import EditDialog from "../EditDialog";
import DeleteDialog from "../DeleteDialog";

interface URLCardListProps {
  urls: Url[];
  onSelect: (url: Url | null) => void;
}

export default function URLCardList(props: URLCardListProps) {
  const [selectedUrl, setSelectedUrl] = useState<Url | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [editedUrl, setEditedUrl] = useState<Url | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedShortUrl, setEditedShortUrl] = useState("");

  const handleSelect = (url: Url) => {
    setSelectedUrl(url);
    props.onSelect(url);
  };

  const handleEdit = (url: Url) => {
    setEditedUrl(url);
    setEditedName(url.name);
    setEditedShortUrl(url.shortCode);
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setEditedUrl(null);
    setEditedName("");
    setEditedShortUrl("");
  };

  const handleEditSave = () => {
    if (editedUrl) {
    }
    handleEditDialogClose();
  };

  const handleDelete = () => {};

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  if (props.urls.length === 0) {
    return (
      <Paper elevation={3} sx={{ position: "relative", p: 9, mb: 4 }}>
        <Box sx={{ position: "absolute", top: "30%", left: "40%" }}>
          <Typography variant="h6">you do not have any links.</Typography>
        </Box>
      </Paper>
    );
  }
  return (
    <>
      <List>
        {props.urls.map((url) => (
          <ListItem key={url.id} disablePadding>
            <ListItemButton
              selected={selectedUrl?.id === url.id}
              onClick={() => handleSelect(url)}
            >
              <Box width="100%">
                <URLCard
                  urlItem={url}
                  onEdit={() => handleEdit(url)}
                  onDelete={() => handleDelete()}
                  onCopy={() => {}}
                  onQrCode={() => {}}
                />
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <EditDialog
        openEditDialog={openEditDialog}
        editedName={editedName}
        editedShortUrl={editedShortUrl}
        setEditedName={setEditedName}
        setEditedShortUrl={setEditedShortUrl}
        handleEditDialogClose={handleEditDialogClose}
        handleEditSave={handleEditSave}
      />
      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        handleDeleteDialogClose={handleDeleteDialogClose}
        handleDelete={handleDelete}
      />
    </>
  );
}

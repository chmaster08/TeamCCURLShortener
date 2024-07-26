"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  InputAdornment,
} from "@mui/material";

interface DialogsProps {
  openEditDialog: boolean;
  editedName: string;
  editedShortUrl: string;
  setEditedName: (name: string) => void;
  setEditedShortUrl: (shortUrl: string) => void;
  handleEditDialogClose: () => void;
  handleEditSave: () => void;
}

export default function EditDialog({
  openEditDialog,
  editedName,
  editedShortUrl,
  setEditedName,
  setEditedShortUrl,
  handleEditDialogClose,
  handleEditSave,
}: DialogsProps) {
  // TODO: do we not allow editing the original URL?
  return (
    <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
      <DialogTitle>Edit Link</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          fullWidth
          variant="standard"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Short URL"
          fullWidth
          variant="standard"
          value={editedShortUrl}
          onChange={(e) => setEditedShortUrl(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {"https://teamcc.com"}/
              </InputAdornment>
            ),
            endAdornment: <InputAdornment position="end">/</InputAdornment>,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleEditDialogClose}>Cancel</Button>
        <Button onClick={handleEditSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

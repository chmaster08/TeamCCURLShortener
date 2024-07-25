"use client";

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface DialogsProps {
  openDeleteDialog: boolean;
  handleDeleteDialogClose: () => void;
  handleDelete: () => void;
}

export default function DeleteDialogs({ openDeleteDialog, handleDeleteDialogClose, handleDelete }: DialogsProps) {
  return (
    <Dialog
      open={openDeleteDialog}
      onClose={handleDeleteDialogClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Delete link?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteDialogClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDelete} sx={{ color: "red" }} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

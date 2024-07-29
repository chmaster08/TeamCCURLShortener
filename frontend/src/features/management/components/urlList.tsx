import Url from "@/libs/model/url";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import URLCard from "./urlCard";
import EditDialog from "../EditDialog";
import DeleteDialog from "../DeleteDialog";
import Alerts from "../Alerts";
import { deleteUrl } from "@/libs/urls";

interface URLCardListProps {
  urls: Url[];
  onSelect: (url: Url | null) => void;
  onEditSave: (url: Url) => void;
  onDelete: (url: Url) => void;
}

export default function URLCardList(props: URLCardListProps) {
  const [selectedUrl, setSelectedUrl] = useState<Url | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [editedUrl, setEditedUrl] = useState<Url | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedShortUrl, setEditedShortUrl] = useState("");
  const [deletedAlertOpen, setDeletedAlertOpen] = useState(false);
  const [copiedAlertOpen, setCopiedAlertOpen] = useState(false);
  const [failedAlert, setFailedAlert] = useState(false);
  const [deleteUrl, setDeleteUrl] = useState<Url | null>(null);

  const handleSelect = (url: Url) => {
    setSelectedUrl(url);
    props.onSelect(url);
  };

  const handleEdit = (url: Url) => {
    setEditedName(url.name);
    setEditedShortUrl(url.shortCode.split("/").pop() || "");
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setEditedName("");
    setEditedShortUrl("");
  };

  const handleEditSave = () => {
    props.onEditSave({
      id: editedUrl?.id || 0,
      name: editedName,
      original: editedUrl?.original || "",
      shortCode: editedShortUrl,
      createdAt: editedUrl?.createdAt || "",
    });
    handleEditDialogClose();
  };

  const handleDeleteOpen = (url: Url) => {
    setOpenDeleteDialog(true);
    setDeleteUrl(url);
  };

  const handleDelete = () => {
    if (deleteUrl === null) return;
    props.onDelete(deleteUrl);
    setOpenDeleteDialog(false);
  };

  const handleDeleteDialogClose = () => {
    setDeletedAlertOpen(true);
    setTimeout(() => setDeletedAlertOpen(false), 1500);
  };

  const handleCopyLink = (url: Url) => {
    navigator.clipboard
      .writeText(url.original)
      .then(() => {
        setCopiedAlertOpen(true);
        setTimeout(() => setCopiedAlertOpen(false), 1500);
      })
      .catch(() => {
        setFailedAlert(true);
        setTimeout(() => setFailedAlert(false), 1500);
      });
  };

  if (props.urls.length === 0) {
    return (
      <Box sx={{ position: "absolute", top: "30%", left: "40%" }}>
        <Typography variant="h6">you do not have any links.</Typography>
      </Box>
    );
  }
  return (
    <Box>
      <List style={{ overflow: "auto", maxHeight: 1000 }}>
        {props.urls.map((url) => (
          <ListItem key={url.id} disablePadding style={{ overflow: "auto" }}>
            <ListItemButton
              selected={selectedUrl?.id === url.id}
              onClick={() => handleSelect(url)}
            >
              <Box width="100%">
                <URLCard
                  urlItem={url}
                  onEdit={() => handleEdit(url)}
                  onDelete={() => handleDeleteOpen(url)}
                  onCopy={() => handleCopyLink(url)}
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
      <Alerts
        copiedAlertOpen={copiedAlertOpen}
        deletedAlertOpen={deletedAlertOpen}
        failedAlert={failedAlert}
      />
    </Box>
  );
}

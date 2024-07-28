"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import QrCodeIcon from "@mui/icons-material/QrCode";
import EditDialog from "./EditDialog";
import DeleteDialog from "./DeleteDialog";
import Alerts from "./Alerts";
import { deleteUrl, listUrls, updateUrl } from "@/libs/urls";
import { createClient } from "@/utils/supabase/client";
import Url from "@/libs/model/url";

export default function Links() {
  const supabase = useMemo(() => createClient(), []);

  const [linksData, setLinksData] = useState<Url[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<number | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState<number | null>(null);
  // TODO: combine these two states into one
  const [editedName, setEditedName] = useState("");
  const [editedShortUrl, setEditedShortUrl] = useState("");
  const [deletedAlertOpen, setDeletedAlertOpen] = useState(false);
  const [copiedAlertOpen, setCopiedAlertOpen] = useState(false);
  const [failedAlert, setFailedAlert] = useState(false);

  useEffect(() => {
    const loadLinksData = async () => {
      const data = await listUrls(supabase);
      if (data) {
        setLinksData(data);
      }
    };

    loadLinksData();
  }, [supabase]);

  const handleDeleteDialogOpen = (id: number) => {
    setOpenDeleteDialog(id);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(null);
  };

  const handleDelete = async (id: number) => {
    setOpenDeleteDialog(null);
    const isDeleted = await deleteUrl(supabase, id);
    if (isDeleted) {
      setDeletedAlertOpen(true);
      setTimeout(() => setDeletedAlertOpen(false), 1500);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopiedAlertOpen(true);
        setTimeout(() => setCopiedAlertOpen(false), 1500);
      })
      .catch(() => {
        setFailedAlert(true);
        setTimeout(() => setFailedAlert(false), 1500);
      });
  };

  const handleOpenEditDialog = (link: Url) => {
    setEditedName(link.name);
    setEditedShortUrl(link.shortCode.split("/").pop() || "");
    setOpenEditDialog(link.id);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(null);
  };

  const handleEditSave = async (id: number) => {
    // TODO:DBの更新処理
    const url = await updateUrl(supabase, id, editedName, editedShortUrl);
    if (url) {
      setOpenEditDialog(null);
      setLinksData(
        linksData.map((link) => {
          if (link.id === id) {
            return url;
          }
          return link;
        }),
      );
    }
  };

  if (linksData.length === 0) {
    return (
      <Paper elevation={3} sx={{ position: "relative", p: 9, mb: 4 }}>
        <Box sx={{ position: "absolute", top: "30%", left: "40%" }}>
          <Typography variant="h6">you do not have any links.</Typography>
        </Box>
      </Paper>
    );
  } else {
    return linksData.map((link) => (
      <Paper
        key={link.id}
        elevation={3}
        sx={{ position: "relative", p: 9, mb: 4 }}
      >
        <Box sx={{ position: "absolute", top: 8, right: 8 }}>
          <IconButton
            aria-label="copy"
            onClick={() => handleCopyLink(link.original)}
          >
            <CopyIcon />
          </IconButton>
          <IconButton
            aria-label="edit"
            onClick={() => handleOpenEditDialog(link)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => handleDeleteDialogOpen(link.id)}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton aria-label="qr code">
            <QrCodeIcon />
          </IconButton>
        </Box>
        <Box sx={{ position: "absolute", top: 27, left: 20 }}>
          <Stack direction="row" spacing={2}>
            <Avatar
              alt={link.name}
              src={`http://www.google.com/s2/favicons?domain=${link.original}&size=100`}
            />
            <Typography variant="h5" gutterBottom>
              {link.name}
            </Typography>
          </Stack>
        </Box>
        <Box mt={4}>
          <Link
            href={link.original}
            variant="h6"
            gutterBottom
            underline="hover"
          >
            {link.shortCode}
          </Link>
          <Box>
            <Link
              href={link.original}
              variant="body1"
              gutterBottom
              underline="hover"
              color="inherit"
            >
              {link.original}
            </Link>
          </Box>
        </Box>
        <EditDialog
          openEditDialog={openEditDialog === link.id}
          handleEditDialogClose={handleEditDialogClose}
          handleEditSave={() => handleEditSave(link.id)}
          editedName={editedName}
          editedShortUrl={editedShortUrl}
          setEditedName={setEditedName}
          setEditedShortUrl={setEditedShortUrl}
        />
        <DeleteDialog
          openDeleteDialog={openDeleteDialog === link.id}
          handleDeleteDialogClose={handleDeleteDialogClose}
          handleDelete={() => handleDelete(link.id)}
        />
        <Alerts
          copiedAlertOpen={copiedAlertOpen}
          deletedAlertOpen={deletedAlertOpen}
          failedAlert={failedAlert}
        />
      </Paper>
    ));
  }
}

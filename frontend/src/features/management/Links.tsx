"use client";

import { useEffect, useState } from "react";
import { Avatar, Box, Button, Card, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, TextField, InputAdornment, IconButton, Link, Paper, Stack, Typography } from "@mui/material";
  import CopyIcon from "@mui/icons-material/ContentCopy";
  import EditIcon from "@mui/icons-material/Edit";
  import DeleteIcon from "@mui/icons-material/Delete";
  import QrCodeIcon from "@mui/icons-material/QrCode";
import EditDialog from "./EditDialog";
import DeleteDialog from "./DeleteDialog";
import Alerts from "./Alerts";

export interface LinkData {
  id: number;
  name: string;
  url: string;
  shortUrl: string;
}

const fetchLinksData = async (): Promise<LinkData[]> => {
  return [
    { id: 1, name: "TeamCC URLShortener", url: "https://github.com/chmaster08/TeamCCURLShortener", shortUrl: "teamcc.com/ab123" },
    { id: 2, name: "TeamAA URLShortener", url: "https://github.com/chmaster08/TeamCCURLShortener", shortUrl: "teamcc.com/ab123" },
    { id: 3, name: "TeamBB URLShortener", url: "https://github.com/chmaster08/TeamCCURLShortener", shortUrl: "teamcc.com/ab123" },
    { id: 4, name: "TeamA URLShortener", url: "https://github.com/chmaster08/TeamCCURLShortener", shortUrl: "teamcc.com/ab123" },
    { id: 5, name: "TeamB URLShortener", url: "https://github.com/chmaster08/TeamCCURLShortener", shortUrl: "teamcc.com/ab123" },
    { id: 6, name: "TeamC URLShortener", url: "https://github.com/chmaster08/TeamCCURLShortener", shortUrl: "teamcc.com/ab123" },
  ];
};

export default function Links() {
  const [linksData, setLinksData] = useState<LinkData[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<number | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState<number | null>(null);
  const [editingLink, setEditingLink] = useState<LinkData | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedShortUrl, setEditedShortUrl] = useState("");
  const [deletedAlertOpen, setDeletedAlertOpen] = useState(false);
  const [copiedAlertOpen, setCopiedAlertOpen] = useState(false);
  const [failedAlert, setFailedAlert] = useState(false);

  useEffect(() => {
    const loadLinksData = async () => {
      const data = await fetchLinksData();
      setLinksData(data);
    };

    loadLinksData();
  }, []);


  const handleDeleteDialogOpen = (id: number) => {
    setOpenDeleteDialog(id);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(null);
  };

  const handleDelete = () => {
    // TODO: DBからの削除処理
    setOpenDeleteDialog(null);
    setDeletedAlertOpen(true);
    setTimeout(() => setDeletedAlertOpen(false), 1500);
  };

  const handleCopyLink = (url:string) => {
    navigator.clipboard.writeText(url)
    .then(() => {
      setCopiedAlertOpen(true);
      setTimeout(() => setCopiedAlertOpen(false), 1500);
    })
    .catch(() => {
      setFailedAlert(true);
      setTimeout(() => setFailedAlert(false), 1500);
    });
  };

  const handleOpenEditDialog = (link: LinkData) => {
    setEditingLink(link);
    setEditedName(link.name);
    setEditedShortUrl(link.shortUrl.split("/").pop() || "");
    setOpenEditDialog(link.id);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(null);
    setEditingLink(null);
  };

  const handleEditSave = () => {
    // TODO:DBの更新処理
    setOpenEditDialog(null);
    setEditingLink(null);
  };

  if (linksData.length === 0){
    return (
      <Paper elevation={3} sx={{ position: "relative", p: 9, mb: 4 }}>
        <Box sx={{ position: "absolute", top: "30%", left: "40%" }}>
          <Typography variant="h6">you do not have any links.</Typography>
        </Box>
      </Paper>
    );
  } else{
    return (
      linksData.map((link) => (
        <Paper key={link.id} elevation={3} sx={{ position: "relative", p: 9, mb: 4 }}>
          <Box sx={{ position: "absolute", top: 8, right: 8 }}>
            <IconButton aria-label="copy" onClick={() => handleCopyLink(link.url)}>
              <CopyIcon />
            </IconButton>
            <IconButton aria-label="edit" onClick={() => handleOpenEditDialog(link)}>
              <EditIcon />
            </IconButton>
            <IconButton aria-label="delete" onClick={() => handleDeleteDialogOpen(link.id)}>
              <DeleteIcon />
            </IconButton>
            <IconButton aria-label="qr code">
              <QrCodeIcon />
            </IconButton>
          </Box>
          <Box sx={{ position: "absolute", top: 27, left: 20 }}>
            <Stack direction="row" spacing={2}>
              <Avatar alt={link.name} src={`http://www.google.com/s2/favicons?domain=${link.url}&size=100`} />
              <Typography variant="h5" gutterBottom>
                {link.name}
              </Typography>
            </Stack>
          </Box>
          <Box mt={4}>
            <Link href={link.url} variant="h6" gutterBottom underline="hover">
              {link.shortUrl}
            </Link>
            <Box>
                <Link href={link.url} variant="body1" gutterBottom underline="hover" color="inherit">
                  {link.url}
              </Link>
            </Box>
          </Box>
          <EditDialog
              openEditDialog={openEditDialog === link.id}
              handleEditDialogClose={handleEditDialogClose}
              handleEditSave={handleEditSave}
              link={editingLink}
              editedName={editedName}
              editedShortUrl={editedShortUrl}
              setEditedName={setEditedName}
              setEditedShortUrl={setEditedShortUrl}
            />
            <DeleteDialog
              openDeleteDialog={openDeleteDialog === link.id}
              handleDeleteDialogClose={handleDeleteDialogClose}
              handleDelete={handleDelete}
            />
          <Alerts
              copiedAlertOpen={copiedAlertOpen}
              deletedAlertOpen={deletedAlertOpen}
              failedAlert={failedAlert}
            />
        </Paper>
      ))
    );
  }
}


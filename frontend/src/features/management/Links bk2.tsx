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
    { id: 2, name: "TeamAA URLShortener", url: "https://github.com/chmaster08/TeamCCURLShortener", shortUrl: "teamaa.com/ab123" },
    { id: 3, name: "TeamBB URLShortener", url: "https://github.com/chmaster08/TeamCCURLShortener", shortUrl: "teambb.com/ab123" },
    { id: 4, name: "TeamAA URLShortener", url: "https://github.com/chmaster08/TeamCCURLShortener", shortUrl: "teamaa.com/ab123" },
    { id: 5, name: "TeamBB URLShortener", url: "https://github.com/chmaster08/TeamCCURLShortener", shortUrl: "teambb.com/ab123" },
    { id: 6, name: "TeamAA URLShortener", url: "https://github.com/chmaster08/TeamCCURLShortener", shortUrl: "teamaa.com/ab123" },
    { id: 7, name: "TeamBB URLShortener", url: "https://github.com/chmaster08/TeamCCURLShortener", shortUrl: "teambb.com/ab123" },
  ];
};

export default function Links() {
  const [linksData, setLinksData] = useState<LinkData[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
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

  const handleDeleteDialogOpen = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleDelete = () => {
    // TODO:DBからの削除処理
    setOpenDeleteDialog(false);
    setDeletedAlertOpen(true);
    setTimeout(() => setDeletedAlertOpen(false), 3000);
  };

  const handleCopyLink = (url:string) => {
    navigator.clipboard.writeText("https://github.com/chmaster08/TeamCCURLShortener")
    .then(() => {
      setCopiedAlertOpen(true);
      setTimeout(() => setCopiedAlertOpen(false), 3000);
    })
    .catch(() => {
      setFailedAlert(true);
      setTimeout(() => setFailedAlert(false), 3000);
    });
  };

  const handleOpenEditDialog = (link: LinkData) => {
    setEditingLink(link);
    setEditedName(link.name);
    setEditedShortUrl(link.shortUrl.split("/").pop() || "");
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setEditingLink(null);
  };

  const handleEditSave = () => {
    // TODO:DBの更新処理
    setOpenEditDialog(false);
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
            <IconButton aria-label="delete" onClick={handleDeleteDialogOpen}>
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
              openEditDialog={openEditDialog}
              handleEditDialogClose={handleEditDialogClose}
              handleEditSave={handleEditSave}
              link={editingLink}
              editedName={editedName}
              editedShortUrl={editedShortUrl}
              setEditedName={setEditedName}
              setEditedShortUrl={setEditedShortUrl}
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
        </Paper>
      ))
    );
  }
}


// "use client";

// import { useState } from "react";
// import { Box, Container, Paper, IconButton, Avatar, Typography, Link, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
// import CopyIcon from "@mui/icons-material/ContentCopy";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import QrCodeIcon from "@mui/icons-material/QrCode";

// export default function Links() {
//   const linksData = [
//     { id: 1, name: "TeamCC URLShortener", url: "https://github.com/chmaster08/TeamCCURLShortener", shortUrl: "teamcc.com/ab123" },
//     { id: 2, name: "TeamAA URLShortener", url: "https://github.com/chmaster08/TeamCCURLShortener", shortUrl: "teamaa.com/ab123" },
//     // その他のリンクデータ...
//   ];

//   const [openDeleteDialog, setOpenDeleteDialog] = useState<{ [key: number]: boolean }>({});

//   const handleDeleteDialogOpen = (id: number) => {
//     setOpenDeleteDialog((prev) => ({ ...prev, [id]: true }));
//   };

//   const handleDeleteDialogClose = (id: number) => {
//     setOpenDeleteDialog((prev) => ({ ...prev, [id]: false }));
//   };

//   const handleDelete = (id: number) => {
//     // TODO: DBからの削除処理
//     setOpenDeleteDialog((prev) => ({ ...prev, [id]: false }));
//   };

//   return (
//     <Box mt={4}>
//       {linksData.map((link) => (
//         <Paper key={link.id} elevation={3} sx={{ position: "relative", p: 9, mb: 4 }}>
//           <Box sx={{ position: "absolute", top: 8, right: 8 }}>
//             <IconButton aria-label="copy">
//               <CopyIcon />
//             </IconButton>
//             <IconButton aria-label="edit">
//               <EditIcon />
//             </IconButton>
//             <IconButton aria-label="delete" onClick={() => handleDeleteDialogOpen(link.id)}>
//               <DeleteIcon />
//             </IconButton>
//             <IconButton aria-label="qr code">
//               <QrCodeIcon />
//             </IconButton>
//           </Box>
//           <Box sx={{ position: "absolute", top: 27, left: 20 }}>
//             <Stack direction="row" spacing={2}>
//               <Avatar alt={link.name} src={`http://www.google.com/s2/favicons?domain=${link.url}&size=100`} />
//               <Typography variant="h5" gutterBottom>
//                 {link.name}
//               </Typography>
//             </Stack>
//           </Box>
//           <Box mt={4}>
//             <Link href={link.url} variant="h6" gutterBottom underline="hover">
//               {link.shortUrl}
//             </Link>
//             <Box>
//               <Link href={link.url} variant="body1" gutterBottom underline="hover" color="inherit">
//                 {link.url}
//               </Link>
//             </Box>
//           </Box>

//           <Dialog
//             open={openDeleteDialog[link.id] || false}
//             onClose={() => handleDeleteDialogClose(link.id)}
//             aria-labelledby="alert-dialog-title"
//             aria-describedby="alert-dialog-description"
//           >
//             <DialogTitle id="alert-dialog-title">{"Delete link?"}</DialogTitle>
//             <DialogContent>
//               <DialogContentText id="alert-dialog-description">
//                 This cannot be undone.
//               </DialogContentText>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => handleDeleteDialogClose(link.id)} color="primary">
//                 Cancel
//               </Button>
//               <Button onClick={() => handleDelete(link.id)} sx={{ color: "red" }} autoFocus>
//                 Delete
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </Paper>
//       ))}
//     </Box>
//   );
// }

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
import URLCard from "./components/urlCard";
import URLCardList from "./components/urlList";

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
      } else {
        const dummyData: Url[] = [
          {
            id: 1,
            name: "dummy",
            original: "https://example.com",
            shortCode: "https://example.com",
            createdAt: "2021-10-10",
          },
          {
            id: 2,
            name: "dummy2",
            original: "https://example2.com",
            shortCode: "https://example2.com",
            createdAt: "2021-10-11",
          },
          {
            id: 3,
            name: "dummy3",
            original: "https://example3.com",
            shortCode: "https://example3.com",
            createdAt: "2021-10-12",
          },
        ];
        setLinksData(dummyData);
      }
    };

    loadLinksData();
  }, [supabase]);

  const handleDeleteDialogOpen = (id: Url) => {
    console.log(id);
    setOpenDeleteDialog(id.id);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(null);
  };

  const handleDelete = async (id: Url) => {
    setOpenDeleteDialog(null);
    const isDeleted = await deleteUrl(supabase, id.id);
    if (isDeleted) {
      setDeletedAlertOpen(true);
      setTimeout(() => setDeletedAlertOpen(false), 1500);
    }
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

  return (
    <Box
      sx={{
        m: 2,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        width: "100%",
      }}
      gap={3}
    >
      <URLCardList urls={linksData} onSelect={() => {}} />
    </Box>
  );
}

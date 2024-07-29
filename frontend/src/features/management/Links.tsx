"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { deleteUrl, listUrls, updateUrl } from "@/libs/urls";
import { createClient } from "@/utils/supabase/client";
import Url from "@/libs/model/url";
import URLCardList from "./components/urlList";
import { useAccessData } from "../analyze/hooks/useAccessData";
import AnalyzePage from "../analyze/pages/analyzepage";

export default function Links() {
  const supabase = useMemo(() => createClient(), []);

  const [linksData, setLinksData] = useState<Url[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<Url | null>(null);
  const { accessData } = useAccessData(selectedUrl);

  const handleSelectedUrl = (url: Url | null) => {
    setSelectedUrl(url);
    console.log(url);
  };

  const handleDelete = async (url: Url) => {
    const isDeleted = await deleteUrl(supabase, url.id);
    if (isDeleted) {
      await retrieveData();
    }
  };

  const handleEditSave = async (url: Url) => {
    const isUpdated = await updateUrl(
      supabase,
      url.id,
      url.name,
      url.shortCode,
    );
    if (isUpdated) {
      await retrieveData();
    }
  };

  const retrieveData = useCallback(async () => {
    const data = await listUrls(supabase);
    if (data) {
      setLinksData(data);
      setSelectedUrl(null);
    }
  }, [supabase]);

  useEffect(() => {
    retrieveData();
  }, [retrieveData, supabase]);

  return (
    <Box
      sx={{
        m: 2,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        width: "100%",
        height: "100%",
      }}
      gap={3}
    >
      <URLCardList
        urls={linksData}
        onSelect={handleSelectedUrl}
        onDelete={handleDelete}
        onEditSave={handleEditSave}
      />
      <AnalyzePage selectedURL={selectedUrl} />
    </Box>
  );
}

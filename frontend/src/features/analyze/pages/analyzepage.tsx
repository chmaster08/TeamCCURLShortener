"use client";
import { Box } from "@mui/material";
import URLList from "../components/urlList";
import SearchBox from "../components/searchbox";
import { URLItem } from "../types/urlItem";
import { useEffect, useState } from "react";
import TimeSeriesChart from "../components/timeseriesChart";
import { AccessDataType } from "../types/TimeSeriesType";
import { useURLItemList } from "../hooks/useURLItemList";
import { useAccessData } from "../hooks/useAccessData";

export default function AnalyzePage() {
  const {
    filteredURLs,
    selectedItem,
    handleSearchChanged,
    handleSelectionChange,
  } = useURLItemList();
  const { accessData } = useAccessData(selectedItem);
  return (
    <Box
      sx={{ m: 5, display: "flex", flexDirection: { xs: "column", md: "row" } }}
      gap={3}
    >
      <Box
        sx={{
          width: { xs: "100%", md: "300px" },
          display: "flex",
          flexDirection: "column",
        }}
        gap={2}
      >
        <SearchBox onSearchChanged={handleSearchChanged} />
        <URLList
          urls={filteredURLs}
          onSelectionChange={handleSelectionChange}
        />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <TimeSeriesChart Data={accessData} />
      </Box>
    </Box>
  );
}

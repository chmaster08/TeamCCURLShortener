"use client";
import { Box, Typography } from "@mui/material";
import URLList from "../components/urlList";
import SearchBox from "../components/searchbox";
import TimeSeriesChart from "../components/timeseriesChart";
import { useURLItemList } from "../hooks/useURLItemList";
import { useAccessData } from "../hooks/useAccessData";
import Url from "@/libs/model/url";

interface AnalyzePageProps {
  selectedURL: Url | null;
}

export default function AnalyzePage(props: AnalyzePageProps) {
  const { accessData } = useAccessData(props.selectedURL);
  if (props.selectedURL === null) {
    return <></>;
  }
  return (
    <Box sx={{ m: 1, flexGrow: 1 }}>
      <TimeSeriesChart Data={accessData} />
    </Box>
  );
}

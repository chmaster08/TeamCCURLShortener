import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  AccessDataType,
  TimeScale,
  TimeScaleType,
} from "../types/TimeSeriesType";
import { useMemo, useState } from "react";

const formatDate = (timestamp: number, timeScale: TimeScaleType): string => {
  const date = new Date(timestamp);
  switch (timeScale) {
    case TimeScale.Minute:
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    case TimeScale.Hour:
      return date.toLocaleString([], { hour: "2-digit", minute: "2-digit" });
    case TimeScale.Day:
      return date.toLocaleDateString();
    case TimeScale.Month:
      return date.toLocaleString("default", { month: "long" });
    default:
      return "";
  }
};

interface TimeSeriesChartProps {
  Data: AccessDataType[];
}

export default function TimeSeriesChart(props: TimeSeriesChartProps) {
  const [selectedTimeScale, setSelectedTimeScale] = useState<TimeScaleType>(
    TimeScale.Hour,
  );
  const aggregatedData = useMemo(() => {
    const aggregateMap = new Map<number, number>();

    props.Data.forEach((point) => {
      let key: number;
      const date = new Date(point.timestamp);
      switch (selectedTimeScale) {
        case TimeScale.Minute:
          key = date.setSeconds(0, 0);
          break;
        case TimeScale.Hour:
          key = date.setMinutes(0, 0, 0);
          break;
        case TimeScale.Day:
          key = date.setHours(0, 0, 0, 0);
          break;
        case TimeScale.Month:
          key = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
          break;
        default:
          throw new Error("Invalid time scale");
      }
      aggregateMap.set(key, (aggregateMap.get(key) || 0) + point.value);
    });

    return Array.from(aggregateMap, ([timestamp, value]) => ({
      timestamp,
      value,
    })).sort((a, b) => a.timestamp - b.timestamp);
  }, [props.Data, selectedTimeScale]);
  const handleTimeScaleChange = (event: SelectChangeEvent<string>) => {
    setSelectedTimeScale(event.target.value as TimeScaleType);
  };
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader
        title="アクセス数推移"
        style={{ textAlign: "center" }}
      ></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={aggregatedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(tick) => formatDate(tick, selectedTimeScale)}
              interval="preserveStartEnd"
            />
            <YAxis />
            <Tooltip
              labelFormatter={(label) => formatDate(label, selectedTimeScale)}
              formatter={(value: number) => [value, "アクセス数"]}
            />
            <Bar dataKey="value" fill="#1876d2" />
          </BarChart>
        </ResponsiveContainer>
        <FormControl variant="outlined" style={{ width: 150 }}>
          <InputLabel id="time-scale-select-label">時間スケール</InputLabel>
          <Select
            labelId="time-scale-select-label"
            id="time-scale-select"
            value={selectedTimeScale}
            label="時間スケール"
            onChange={(e) => handleTimeScaleChange(e)}
          >
            <MenuItem value={TimeScale.Hour}>時間</MenuItem>
            <MenuItem value={TimeScale.Day}>日</MenuItem>
            <MenuItem value={TimeScale.Month}>月</MenuItem>
          </Select>
        </FormControl>
      </CardContent>
    </Card>
  );
}

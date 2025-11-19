// app/components/domain/Profile/ProfileTabs/SeasonInfograph.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts";
import "./SeasonInfograph.css";

export default function SeasonInfograph({
  seasonLabel,
  series = [],
  onSelect,
}) {
  // normalize series and attach index
  const data = useMemo(
    () =>
      (series || []).map((s, i) => ({
        ...s,
        _idx: i,
        label: s.label ?? `S${i + 1}`,
      })),
    [series],
  );

  // initial selection: try to match seasonLabel, otherwise last item
  const initialIndex = useMemo(() => {
    if (!data.length) return -1;
    const idx = data.findIndex((d) => String(d.label) === String(seasonLabel));
    return idx >= 0 ? idx : data.length - 1;
  }, [data, seasonLabel]);

  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  // keep selectedIndex synced when external seasonLabel/series changes
  useEffect(() => {
    setSelectedIndex(initialIndex);
  }, [initialIndex]);

  // notify parent when selection changes
  useEffect(() => {
    if (typeof onSelect === "function" && selectedIndex >= 0) {
      onSelect(selectedIndex);
    }
  }, [selectedIndex, onSelect]);

  const selected = data[selectedIndex] || {};
  const totalMatches = selected.matches ?? 0;
  const totalGoals = selected.goals ?? 0;
  const totalAssists = selected.assists ?? 0;
  const displaySeasonLabel = selected.label || seasonLabel || "—";

  // clickable dot renderer
  const renderDot = (props) => {
    const { cx, cy, payload } = props;
    if (cx == null || cy == null) return null;
    const idx = payload._idx;
    const isSelected = idx === selectedIndex;

    const r = isSelected ? 6 : 3;
    const fill = isSelected ? "#3742fa" : "#fff";
    const stroke = "#3742fa";
    const strokeWidth = isSelected ? 2 : 1.2;

    return (
      <g onClick={() => setSelectedIndex(idx)} style={{ cursor: "pointer" }}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
        {/* larger invisible hit area */}
        <circle cx={cx} cy={cy} r={12} fill="transparent" />
      </g>
    );
  };

  return (
    <div className="season-infograph-card">
      <div className="chart-wrap" aria-hidden>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart
            data={data}
            margin={{ top: 8, right: 8, left: 8, bottom: 12 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="_idx"
              tickFormatter={(idx) => {
                const item = data[idx];
                return item ? item.label : "";
              }}
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [value, name]}
              labelFormatter={(lab) => {
                const d = data[lab];
                return d ? d.label : lab;
              }}
            />
            <Legend verticalAlign="top" height={30} />
            {selectedIndex >= 0 && (
              <ReferenceLine
                x={selectedIndex}
                stroke="#3742fa"
                strokeOpacity={0.12}
              />
            )}
            <Line
              type="monotone"
              dataKey="matches"
              name="Matches"
              stroke="#3742fa"
              dot={renderDot}
              activeDot={renderDot}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="goals"
              name="Goals"
              stroke="#2ecc71"
              dot={renderDot}
              activeDot={renderDot}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="assists"
              name="Assists"
              stroke="#caa2ff"
              dot={renderDot}
              activeDot={renderDot}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

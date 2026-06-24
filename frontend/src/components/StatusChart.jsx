import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function StatusChart({ stats }) {
  const data = [
    { name: "Applied", value: stats.applied },
    { name: "OA", value: stats.oa },
    { name: "Interview", value: stats.interview },
    { name: "Offer", value: stats.offer },
    { name: "Rejected", value: stats.rejected },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: 350,
        background: "#fff",
        padding: "20px",
        borderRadius: "15px",
        marginTop: "30px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
        Application Status Overview
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis allowDecimals={false} />

          <Tooltip />

          <Bar
            dataKey="value"
            fill="#2563eb"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StatusChart;
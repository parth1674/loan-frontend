"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = {
  ACTIVE: "#22c55e",
  OVERDUE: "#ef4444",
  CLOSED: "#9ca3af",
};

export default function LoanStatusChart({ summary }: any) {
  const data = [
    { name: "Active", value: summary.activeLoans, key: "ACTIVE" },
    { name: "Overdue", value: summary.overdueLoans, key: "OVERDUE" },
    {
      name: "Closed",
      value:
        summary.totalLoans -
        (summary.activeLoans + summary.overdueLoans),
      key: "CLOSED",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Loan Status Distribution
      </h3>

      {/* 🔥 HEIGHT IS MANDATORY */}
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[entry.key as keyof typeof COLORS]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { ApiClient } from "adminjs";
import { Box, H2, H5, Loader, Text } from "@adminjs/design-system";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TEAL = "#0d9488";
const TEAL_LIGHT = "#14b8a6";
const SLATE = "#64748b";
const AMBER = "#f59e0b";
const ROSE = "#f43f5e";
const PIE_COLORS = [TEAL, AMBER, ROSE, "#6366f1", "#8b5cf6", SLATE];

const cardStyle = {
  background: "#fff",
  border: "1px solid #e4e4e7",
  borderRadius: "12px",
  padding: "16px 18px",
  boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)",
};

const chartCardStyle = {
  ...cardStyle,
  padding: "18px 20px 12px",
  minHeight: "320px",
};

const StatCard = ({ label, value, hint }) => (
  <Box style={cardStyle}>
    <Text fontSize="xs" color="grey60" fontWeight="bold" style={{ textTransform: "uppercase", letterSpacing: "0.04em" }}>
      {label}
    </Text>
    <Text fontSize="xxl" fontWeight="bold" color="grey100" style={{ marginTop: "6px", lineHeight: 1.1 }}>
      {value}
    </Text>
    {hint ? (
      <Text fontSize="xs" color="grey60" style={{ marginTop: "4px" }}>
        {hint}
      </Text>
    ) : null}
  </Box>
);

const ChartTitle = ({ children }) => (
  <H5 fontWeight="bold" color="grey100" style={{ marginBottom: "12px" }}>
    {children}
  </H5>
);

const formatMoney = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    value || 0
  );

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const api = new ApiClient();
    api
      .getDashboard()
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.message || "Failed to load analytics");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box variant="grey" p="xxl" flex justifyContent="center">
        <Loader />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box variant="grey" p="xxl">
        <Text color="error">{error || "No analytics data available"}</Text>
      </Box>
    );
  }

  const { stats, revenueTrend, ordersTrend, topProducts, revenueByCategory, orderStatus, fulfillmentStatus } =
    data;

  const gridStyle = {
    display: "grid",
    gap: "16px",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  };

  const chartsRowStyle = {
    display: "grid",
    gap: "16px",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    marginTop: "20px",
  };

  return (
    <Box variant="grey" p="xl">
      <Box mb="lg">
        <H2 fontWeight="bold">Store analytics</H2>
        <Text color="grey60" fontSize="sm">
          Revenue, orders, and product performance at a glance.
        </Text>
      </Box>

      <Box style={gridStyle}>
        <StatCard label="Paid revenue" value={formatMoney(stats.paidRevenue)} hint={`${stats.paidOrders} paid orders`} />
        <StatCard label="Avg order value" value={formatMoney(stats.averageOrderValue)} />
        <StatCard label="Total orders" value={stats.orders} hint={`${stats.unpaidOrders} awaiting payment`} />
        <StatCard label="Customers" value={stats.users} />
        <StatCard label="Products" value={stats.products} hint={`${stats.lowStockProducts} low stock`} />
        <StatCard label="Active carts" value={stats.activeCarts} hint={`${stats.wishlists} wishlists`} />
      </Box>

      <Box style={chartsRowStyle}>
        <Box style={chartCardStyle}>
          <ChartTitle>Revenue (last 14 days)</ChartTitle>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueTrend}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={TEAL} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={TEAL} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: SLATE }} />
              <YAxis tick={{ fontSize: 11, fill: SLATE }} tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(value) => [formatMoney(value), "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke={TEAL} fill="url(#revenueFill)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        <Box style={chartCardStyle}>
          <ChartTitle>Orders (last 14 days)</ChartTitle>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={ordersTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: SLATE }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: SLATE }} />
              <Tooltip />
              <Bar dataKey="orders" fill={TEAL_LIGHT} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      <Box style={chartsRowStyle}>
        <Box style={chartCardStyle}>
          <ChartTitle>Top products (units sold)</ChartTitle>
          {topProducts?.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topProducts} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: SLATE }} />
                <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 10, fill: SLATE }} />
                <Tooltip formatter={(value, name) => [value, name === "units" ? "Units" : "Revenue"]} />
                <Bar dataKey="units" fill={TEAL} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Text color="grey60" fontSize="sm">No paid orders yet — top sellers will appear here.</Text>
          )}
        </Box>

        <Box style={chartCardStyle}>
          <ChartTitle>Revenue by category</ChartTitle>
          {revenueByCategory?.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revenueByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: SLATE }} />
                <YAxis tick={{ fontSize: 11, fill: SLATE }} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(value) => [formatMoney(value), "Revenue"]} />
                <Bar dataKey="revenue" fill={TEAL} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Text color="grey60" fontSize="sm">Category revenue appears after your first paid orders.</Text>
          )}
        </Box>
      </Box>

      <Box style={chartsRowStyle}>
        <Box style={chartCardStyle}>
          <ChartTitle>Payment status</ChartTitle>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={orderStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={3}>
                {orderStatus.map((entry, index) => (
                  <Cell key={entry.name} fill={index === 0 ? TEAL : AMBER} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Box style={chartCardStyle}>
          <ChartTitle>Fulfillment status</ChartTitle>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={fulfillmentStatus}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={78}
                paddingAngle={3}
              >
                {fulfillmentStatus.map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;

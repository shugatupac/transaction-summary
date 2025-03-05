import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { motion } from "framer-motion";

interface IncomeVsExpensesProps {
  data?: {
    month: string;
    income: number;
    expenses: number;
  }[];
  title?: string;
  className?: string;
}

const defaultData = [
  { month: "Jan", income: 4000, expenses: 2400 },
  { month: "Feb", income: 3000, expenses: 2800 },
  { month: "Mar", income: 5000, expenses: 3200 },
  { month: "Apr", income: 4500, expenses: 3800 },
  { month: "May", income: 6000, expenses: 4000 },
  { month: "Jun", income: 5500, expenses: 3500 },
];

const IncomeVsExpenses: React.FC<IncomeVsExpensesProps> = ({
  data = defaultData,
  title = "Income vs Expenses",
  className = "",
}) => {
  const [chartType, setChartType] = useState("grouped");
  const [timeRange, setTimeRange] = useState("6m");

  // Filter data based on time range (in a real app, this would be more sophisticated)
  const filteredData = data.slice(0, timeRange === "3m" ? 3 : 6);

  return (
    <Card className={`w-full h-full bg-white ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[100px] h-8">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs value={chartType} onValueChange={setChartType} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="grouped">Grouped</TabsTrigger>
            <TabsTrigger value="stacked">Stacked</TabsTrigger>
          </TabsList>
          <TabsContent value="grouped" className="w-full h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  formatter={(value) => [
                    `${value.toLocaleString()}`,
                    undefined,
                  ]}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={{
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    border: "1px solid #f0f0f0",
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span className="text-sm font-medium">{value}</span>
                  )}
                />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#4ade80"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                  animationBegin={0}
                  barSize={30}
                >
                  <LabelList
                    dataKey="income"
                    position="top"
                    formatter={(value) => `${value.toLocaleString()}`}
                    style={{ fontSize: "10px", fill: "#4ade80" }}
                  />
                </Bar>
                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill="#f87171"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                  animationBegin={300}
                  barSize={30}
                >
                  <LabelList
                    dataKey="expenses"
                    position="top"
                    formatter={(value) => `${value.toLocaleString()}`}
                    style={{ fontSize: "10px", fill: "#f87171" }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="stacked" className="w-full h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  formatter={(value) => [
                    `${value.toLocaleString()}`,
                    undefined,
                  ]}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={{
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    border: "1px solid #f0f0f0",
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span className="text-sm font-medium">{value}</span>
                  )}
                />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#4ade80"
                  stackId="a"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                  animationBegin={0}
                  barSize={40}
                >
                  <LabelList
                    dataKey="income"
                    position="insideTop"
                    formatter={(value) => `${value.toLocaleString()}`}
                    style={{
                      fontSize: "10px",
                      fill: "#fff",
                      fontWeight: "bold",
                    }}
                  />
                </Bar>
                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill="#f87171"
                  stackId="a"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                  animationBegin={300}
                  barSize={40}
                >
                  <LabelList
                    dataKey="expenses"
                    position="insideBottom"
                    formatter={(value) => `${value.toLocaleString()}`}
                    style={{
                      fontSize: "10px",
                      fill: "#fff",
                      fontWeight: "bold",
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>

        {/* Summary section */}
        <motion.div
          className="mt-4 grid grid-cols-2 gap-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-2 rounded-lg bg-green-50">
            <p className="text-sm text-gray-500">Total Income</p>
            <p className="text-xl font-semibold text-green-600">
              $
              {filteredData
                .reduce((sum, item) => sum + item.income, 0)
                .toLocaleString()}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-red-50">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <p className="text-xl font-semibold text-red-600">
              $
              {filteredData
                .reduce((sum, item) => sum + item.expenses, 0)
                .toLocaleString()}
            </p>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default IncomeVsExpenses;

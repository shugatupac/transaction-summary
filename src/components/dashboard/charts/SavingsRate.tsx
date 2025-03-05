import React, { useState } from "react";
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SavingsRateProps {
  data?: SavingsData[];
  previousMonthsData?: SavingsData[];
  currentMonth?: string;
  showComparison?: boolean;
}

interface SavingsData {
  date: string;
  savingsRate: number;
  target?: number;
}

const defaultCurrentMonthData: SavingsData[] = [
  { date: "1", savingsRate: 15, target: 20 },
  { date: "5", savingsRate: 18, target: 20 },
  { date: "10", savingsRate: 22, target: 20 },
  { date: "15", savingsRate: 19, target: 20 },
  { date: "20", savingsRate: 21, target: 20 },
  { date: "25", savingsRate: 24, target: 20 },
  { date: "30", savingsRate: 26, target: 20 },
];

const defaultPreviousMonthData: SavingsData[] = [
  { date: "1", savingsRate: 12 },
  { date: "5", savingsRate: 14 },
  { date: "10", savingsRate: 16 },
  { date: "15", savingsRate: 15 },
  { date: "20", savingsRate: 18 },
  { date: "25", savingsRate: 19 },
  { date: "30", savingsRate: 21 },
];

const SavingsRate = ({
  data = defaultCurrentMonthData,
  previousMonthsData = defaultPreviousMonthData,
  currentMonth = "May 2023",
  showComparison = true,
}: SavingsRateProps) => {
  const [view, setView] = useState("monthly");
  const [comparisonVisible, setComparisonVisible] = useState(showComparison);

  return (
    <Card className="w-full h-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Savings Rate</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setComparisonVisible(!comparisonVisible)}
            >
              <Info className="h-4 w-4" />
            </Button>
            <Select defaultValue={currentMonth}>
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="May 2023">May 2023</SelectItem>
                <SelectItem value="April 2023">April 2023</SelectItem>
                <SelectItem value="March 2023">March 2023</SelectItem>
                <SelectItem value="February 2023">February 2023</SelectItem>
                <SelectItem value="January 2023">January 2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly" className="w-full" onValueChange={setView}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="space-y-4">
            <ChartView
              data={data.slice(0, 7)}
              comparisonData={
                comparisonVisible ? previousMonthsData.slice(0, 7) : undefined
              }
              view={view}
            />
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4">
            <ChartView
              data={data}
              comparisonData={
                comparisonVisible ? previousMonthsData : undefined
              }
              view={view}
            />
          </TabsContent>

          <TabsContent value="yearly" className="space-y-4">
            <ChartView
              data={generateYearlyData()}
              comparisonData={
                comparisonVisible ? generatePreviousYearData() : undefined
              }
              view={view}
            />
          </TabsContent>
        </Tabs>

        {comparisonVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Current Period</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span>Previous Period</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Target</span>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

interface ChartViewProps {
  data: SavingsData[];
  comparisonData?: SavingsData[];
  view: string;
}

const ChartView = ({ data, comparisonData, view }: ChartViewProps) => {
  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              if (view === "yearly") return value;
              return value;
            }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, "Savings Rate"]}
            labelFormatter={(label) => {
              if (view === "yearly") return `${label}`;
              return `Day ${label}`;
            }}
          />
          <Legend />

          {/* Target line */}
          {data[0]?.target && (
            <Line
              type="monotone"
              dataKey="target"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              activeDot={false}
              name="Target"
            />
          )}

          {/* Current period line */}
          <Line
            type="monotone"
            dataKey="savingsRate"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
            name="Current Period"
            animationDuration={1500}
          />

          {/* Previous period line (if comparison is enabled) */}
          {comparisonData && (
            <Line
              type="monotone"
              dataKey="savingsRate"
              data={comparisonData}
              stroke="#9ca3af"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name="Previous Period"
              animationDuration={1500}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Helper function to generate yearly data
function generateYearlyData(): SavingsData[] {
  return [
    { date: "Jan", savingsRate: 18, target: 20 },
    { date: "Feb", savingsRate: 16, target: 20 },
    { date: "Mar", savingsRate: 19, target: 20 },
    { date: "Apr", savingsRate: 22, target: 20 },
    { date: "May", savingsRate: 26, target: 20 },
    { date: "Jun", savingsRate: 24, target: 20 },
    { date: "Jul", savingsRate: 21, target: 20 },
    { date: "Aug", savingsRate: 23, target: 20 },
    { date: "Sep", savingsRate: 25, target: 20 },
    { date: "Oct", savingsRate: 27, target: 20 },
    { date: "Nov", savingsRate: 26, target: 20 },
    { date: "Dec", savingsRate: 28, target: 20 },
  ];
}

// Helper function to generate previous year data
function generatePreviousYearData(): SavingsData[] {
  return [
    { date: "Jan", savingsRate: 15 },
    { date: "Feb", savingsRate: 14 },
    { date: "Mar", savingsRate: 16 },
    { date: "Apr", savingsRate: 18 },
    { date: "May", savingsRate: 20 },
    { date: "Jun", savingsRate: 19 },
    { date: "Jul", savingsRate: 17 },
    { date: "Aug", savingsRate: 18 },
    { date: "Sep", savingsRate: 21 },
    { date: "Oct", savingsRate: 22 },
    { date: "Nov", savingsRate: 21 },
    { date: "Dec", savingsRate: 23 },
  ];
}

export default SavingsRate;

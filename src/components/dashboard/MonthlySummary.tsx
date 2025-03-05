import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import SpendingByCategory from "./charts/SpendingByCategory";
import IncomeVsExpenses from "./charts/IncomeVsExpenses";
import SavingsRate from "./charts/SavingsRate";

interface MonthlySummaryProps {
  currentMonth?: string;
  availableMonths?: string[];
  onMonthChange?: (month: string) => void;
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({
  currentMonth = "May 2023",
  availableMonths = [
    "January 2023",
    "February 2023",
    "March 2023",
    "April 2023",
    "May 2023",
    "June 2023",
  ],
  onMonthChange = () => {},
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [comparisonVisible, setComparisonVisible] = useState(true);

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    onMonthChange(month);
  };

  const handlePreviousMonth = () => {
    const currentIndex = availableMonths.indexOf(selectedMonth);
    if (currentIndex > 0) {
      const prevMonth = availableMonths[currentIndex - 1];
      handleMonthChange(prevMonth);
    }
  };

  const handleNextMonth = () => {
    const currentIndex = availableMonths.indexOf(selectedMonth);
    if (currentIndex < availableMonths.length - 1) {
      const nextMonth = availableMonths[currentIndex + 1];
      handleMonthChange(nextMonth);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white p-4 rounded-lg shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Monthly Summary</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousMonth}
            disabled={availableMonths.indexOf(selectedMonth) === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Select value={selectedMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            disabled={
              availableMonths.indexOf(selectedMonth) ===
              availableMonths.length - 1
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setComparisonVisible(!comparisonVisible)}
                >
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle comparison with previous period</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="all">All Charts</TabsTrigger>
          <TabsTrigger value="spending">Spending</TabsTrigger>
          <TabsTrigger value="income">Income vs Expenses</TabsTrigger>
          <TabsTrigger value="savings">Savings Rate</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <SpendingByCategory period={selectedMonth} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <IncomeVsExpenses />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <SavingsRate currentMonth={selectedMonth} />
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="spending">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="pt-6">
                <SpendingByCategory
                  period={selectedMonth}
                  title={`Spending by Category - ${selectedMonth}`}
                />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="income">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="pt-6">
                <IncomeVsExpenses
                  title={`Income vs Expenses - ${selectedMonth}`}
                />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="savings">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="pt-6">
                <SavingsRate currentMonth={selectedMonth} />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 text-sm text-muted-foreground">
        <p>
          This summary shows your financial activity for {selectedMonth}. Switch
          between tabs to focus on specific aspects of your finances.
        </p>
      </div>
    </motion.div>
  );
};

export default MonthlySummary;

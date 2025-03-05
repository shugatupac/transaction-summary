import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "../layout/Header";
import BudgetTracker from "../dashboard/BudgetTracker";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import AddBudgetForm from "./AddBudgetForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const BudgetsPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState("May 2023");
  const [showAddBudgetForm, setShowAddBudgetForm] = useState(false);
  const availableMonths = [
    "January 2023",
    "February 2023",
    "March 2023",
    "April 2023",
    "May 2023",
    "June 2023",
  ];

  const handlePreviousMonth = () => {
    const currentIndex = availableMonths.indexOf(selectedMonth);
    if (currentIndex > 0) {
      setSelectedMonth(availableMonths[currentIndex - 1]);
    }
  };

  const handleNextMonth = () => {
    const currentIndex = availableMonths.indexOf(selectedMonth);
    if (currentIndex < availableMonths.length - 1) {
      setSelectedMonth(availableMonths[currentIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        userName="Jane Doe"
        userAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
        notificationCount={3}
      />

      <main className="container mx-auto px-4 py-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold">Budget Management</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousMonth}
              disabled={availableMonths.indexOf(selectedMonth) === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
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

            <Button
              className="gap-1"
              onClick={() => setShowAddBudgetForm(true)}
            >
              <Plus className="h-4 w-4" />
              Add Budget
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BudgetTracker month={selectedMonth} />
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  Budget Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Budget</span>
                    <span className="text-sm">$3,200.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Spent</span>
                    <span className="text-sm">$3,050.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-green-600">
                      Remaining
                    </span>
                    <span className="text-sm text-green-600">$150.00</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Budget Health</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>95% of budget used</span>
                      <span>5% remaining</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Budget Tips</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500 text-lg">•</span>
                      <span>
                        Your Transportation budget is over by $50. Consider
                        adjusting it for next month.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 text-lg">•</span>
                      <span>
                        You're on track with your Entertainment budget with $80
                        remaining.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500 text-lg">•</span>
                      <span>
                        Your Food & Dining budget is at 97% usage. Be careful
                        with additional expenses.
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <AddBudgetForm
          open={showAddBudgetForm}
          onOpenChange={setShowAddBudgetForm}
          month={selectedMonth}
          onAddBudget={(budget) => {
            console.log("New budget:", budget);
            setShowAddBudgetForm(false);
          }}
        />
      </main>
    </div>
  );
};

export default BudgetsPage;

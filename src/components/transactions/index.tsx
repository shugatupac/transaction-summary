import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "../layout/Header";
import TransactionList from "../dashboard/TransactionList";
import { Button } from "@/components/ui/button";
import { Plus, Filter, ArrowUpDown } from "lucide-react";
import AddTransactionForm from "./AddTransactionForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TransactionsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [sortBy, setSortBy] = useState("date");
  const [showAddTransactionForm, setShowAddTransactionForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        userName="Jane Doe"
        userAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
        notificationCount={3}
      />

      <main className="container mx-auto px-4 py-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold">Transactions</h1>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              Filters
            </Button>

            <Button variant="outline" size="sm" className="gap-1">
              <ArrowUpDown className="h-4 w-4" />
              Sort
            </Button>

            <Button
              className="gap-1"
              onClick={() => setShowAddTransactionForm(true)}
            >
              <Plus className="h-4 w-4" />
              Add Transaction
            </Button>
          </div>
        </div>

        <TransactionList title="All Transactions" />

        <AddTransactionForm
          open={showAddTransactionForm}
          onOpenChange={setShowAddTransactionForm}
          onAddTransaction={(transaction) => {
            console.log("New transaction:", transaction);
            setShowAddTransactionForm(false);
          }}
        />
      </main>
    </div>
  );
};

export default TransactionsPage;

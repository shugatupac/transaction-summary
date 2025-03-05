import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  PiggyBank,
  Wallet,
  TrendingUp,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddAccountForm from "./AddAccountForm";

interface Account {
  id: string;
  name: string;
  type: "checking" | "savings" | "credit" | "investment";
  balance: number;
  currency: string;
  accountNumber: string;
  institution: string;
  lastTransaction?: {
    amount: number;
    date: string;
    type: "credit" | "debit";
  };
  color?: string;
}

interface AccountsListProps {
  accounts?: Account[];
  onSelectAccount?: (accountId: string) => void;
}

const defaultAccounts: Account[] = [
  {
    id: "1",
    name: "Main Checking",
    type: "checking",
    balance: 5280.42,
    currency: "USD",
    accountNumber: "****4567",
    institution: "Chase Bank",
    lastTransaction: {
      amount: 120.5,
      date: "2023-05-28T15:30:00Z",
      type: "debit",
    },
    color: "#3b82f6",
  },
  {
    id: "2",
    name: "Savings Account",
    type: "savings",
    balance: 12750.8,
    currency: "USD",
    accountNumber: "****7890",
    institution: "Bank of America",
    lastTransaction: {
      amount: 1000.0,
      date: "2023-05-20T10:00:00Z",
      type: "credit",
    },
    color: "#10b981",
  },
  {
    id: "3",
    name: "Credit Card",
    type: "credit",
    balance: 1240.3,
    currency: "USD",
    accountNumber: "****1234",
    institution: "American Express",
    lastTransaction: {
      amount: 85.2,
      date: "2023-05-25T18:45:00Z",
      type: "debit",
    },
    color: "#f43f5e",
  },
  {
    id: "4",
    name: "Investment Portfolio",
    type: "investment",
    balance: 28450.75,
    currency: "USD",
    accountNumber: "****5678",
    institution: "Fidelity",
    lastTransaction: {
      amount: 1500.0,
      date: "2023-05-15T11:20:00Z",
      type: "credit",
    },
    color: "#8b5cf6",
  },
];

const AccountsList: React.FC<AccountsListProps> = ({
  accounts = defaultAccounts,
  onSelectAccount = () => {},
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showAddAccountForm, setShowAddAccountForm] = useState(false);
  const [userAccounts, setUserAccounts] = useState(accounts);

  const getAccountIcon = (type: Account["type"]) => {
    switch (type) {
      case "checking":
        return <CreditCard className="h-5 w-5" />;
      case "savings":
        return <PiggyBank className="h-5 w-5" />;
      case "credit":
        return <Wallet className="h-5 w-5" />;
      case "investment":
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date);
    }
  };

  const handleAddAccount = (newAccount: any) => {
    setUserAccounts((prev) => [...prev, newAccount]);
  };

  // Filter accounts based on search term and type
  const filteredAccounts = userAccounts.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.institution.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType
      ? account.type === selectedType.toLowerCase()
      : true;

    return matchesSearch && matchesType;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedType(null);
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle className="text-xl font-semibold">Your Accounts</CardTitle>
          <Button className="gap-1" onClick={() => setShowAddAccountForm(true)}>
            <Plus className="h-4 w-4" />
            Add Account
          </Button>
        </div>

        <div className="mt-4 flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search accounts..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Select
              value={selectedType || "all"}
              onValueChange={(value) =>
                setSelectedType(value === "all" ? null : value)
              }
            >
              <SelectTrigger className="h-9 w-[130px]">
                <SelectValue placeholder="Account Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Checking">Checking</SelectItem>
                <SelectItem value="Savings">Savings</SelectItem>
                <SelectItem value="Credit">Credit</SelectItem>
                <SelectItem value="Investment">Investment</SelectItem>
              </SelectContent>
            </Select>

            {(searchTerm || selectedType) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-9"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredAccounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Filter className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">No accounts found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
            <Button variant="outline" className="mt-4" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAccounts.map((account) => (
              <motion.div
                key={account.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-lg border p-4 cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all"
                onClick={() => onSelectAccount(account.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-2 rounded-full"
                      style={{
                        backgroundColor: account.color
                          ? `${account.color}15`
                          : "#f3f4f6",
                      }}
                    >
                      {getAccountIcon(account.type)}
                    </div>
                    <div>
                      <h3 className="font-medium">{account.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {account.institution} • {account.accountNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(account.balance, account.currency)}
                      </p>
                      <Badge
                        variant={
                          account.type === "credit"
                            ? "destructive"
                            : "secondary"
                        }
                        className="capitalize text-xs"
                      >
                        {account.type}
                      </Badge>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                {account.lastTransaction && (
                  <div className="mt-3 pt-3 border-t flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      {account.lastTransaction.type === "credit" ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        Last transaction
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-sm font-medium ${account.lastTransaction.type === "credit" ? "text-green-600" : "text-red-600"}`}
                      >
                        {account.lastTransaction.type === "credit" ? "+" : "-"}
                        {formatCurrency(
                          account.lastTransaction.amount,
                          account.currency,
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(account.lastTransaction.date)}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>

      <AddAccountForm
        open={showAddAccountForm}
        onOpenChange={setShowAddAccountForm}
        onAddAccount={handleAddAccount}
      />
    </Card>
  );
};

export default AccountsList;

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  Download,
  Filter,
  PiggyBank,
  Wallet,
  TrendingUp,
  MoreHorizontal,
  FileText,
  Share2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Edit,
} from "lucide-react";
import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EditAccountForm from "./EditAccountForm";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "credit" | "debit";
  category: string;
  status?: "pending" | "completed" | "failed";
}

interface Account {
  id: string;
  name: string;
  type: "checking" | "savings" | "credit" | "investment";
  balance: number;
  currency: string;
  accountNumber: string;
  availableCredit?: number;
  interestRate?: number;
  dueDate?: string;
  minimumPayment?: number;
  transactions: Transaction[];
  color?: string;
}

interface AccountDetailsProps {
  account?: Account;
  onBack?: () => void;
}

const defaultAccount: Account = {
  id: "1",
  name: "Main Checking",
  type: "checking",
  balance: 5280.42,
  currency: "USD",
  accountNumber: "****4567",
  transactions: [
    {
      id: "t1",
      date: "2023-05-28T15:30:00Z",
      description: "Grocery Store",
      amount: 120.5,
      type: "debit",
      category: "Food & Dining",
      status: "completed",
    },
    {
      id: "t2",
      date: "2023-05-25T09:15:00Z",
      description: "Salary Deposit",
      amount: 2500.0,
      type: "credit",
      category: "Income",
      status: "completed",
    },
    {
      id: "t3",
      date: "2023-05-22T14:45:00Z",
      description: "Electric Bill",
      amount: 95.2,
      type: "debit",
      category: "Bills & Utilities",
      status: "completed",
    },
    {
      id: "t4",
      date: "2023-05-20T11:30:00Z",
      description: "Restaurant",
      amount: 65.8,
      type: "debit",
      category: "Food & Dining",
      status: "completed",
    },
    {
      id: "t5",
      date: "2023-05-18T16:20:00Z",
      description: "Gas Station",
      amount: 45.3,
      type: "debit",
      category: "Transportation",
      status: "completed",
    },
    {
      id: "t6",
      date: "2023-05-15T10:00:00Z",
      description: "Online Shopping",
      amount: 120.0,
      type: "debit",
      category: "Shopping",
      status: "completed",
    },
    {
      id: "t7",
      date: "2023-05-10T09:15:00Z",
      description: "Freelance Payment",
      amount: 850.0,
      type: "credit",
      category: "Income",
      status: "completed",
    },
  ],
  color: "#3b82f6",
};

const AccountDetails: React.FC<AccountDetailsProps> = ({
  account = defaultAccount,
  onBack = () => {},
}) => {
  const [activeTab, setActiveTab] = useState("transactions");
  const [timeRange, setTimeRange] = useState("30d");
  const [hideBalance, setHideBalance] = useState(false);
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(
    null,
  );
  const [currentAccount, setCurrentAccount] = useState(account);
  const [showEditForm, setShowEditForm] = useState(false);

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

  const toggleTransactionExpand = (id: string) => {
    setExpandedTransaction(expandedTransaction === id ? null : id);
  };

  const handleSaveAccount = (updatedAccount: any) => {
    setCurrentAccount(updatedAccount);
  };

  // Filter transactions based on time range
  const filteredTransactions = currentAccount.transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    const now = new Date();
    const daysDiff = Math.floor(
      (now.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (timeRange === "7d") return daysDiff <= 7;
    if (timeRange === "30d") return daysDiff <= 30;
    if (timeRange === "90d") return daysDiff <= 90;
    return true; // 'all'
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="gap-1" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back to Accounts
        </Button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => setShowEditForm(true)}
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export account transactions</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <MoreHorizontal className="h-4 w-4" />
                More
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Account Statements
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                Share Account Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <AlertCircle className="mr-2 h-4 w-4" />
                Report an Issue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="p-3 rounded-full"
                style={{
                  backgroundColor: currentAccount.color
                    ? `${currentAccount.color}15`
                    : "#f3f4f6",
                }}
              >
                {getAccountIcon(currentAccount.type)}
              </div>
              <div>
                <CardTitle className="text-xl">{currentAccount.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Account Number: {currentAccount.accountNumber}
                </p>
              </div>
              <Badge
                variant={
                  currentAccount.type === "credit" ? "destructive" : "secondary"
                }
                className="capitalize ml-2"
              >
                {currentAccount.type}
              </Badge>
            </div>

            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold">
                  {hideBalance
                    ? "••••••"
                    : formatCurrency(
                        currentAccount.balance,
                        currentAccount.currency,
                      )}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setHideBalance(!hideBalance)}
                >
                  {hideBalance ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
            </div>
          </div>
        </CardHeader>

        {currentAccount.type === "credit" && currentAccount.availableCredit && (
          <CardContent className="pb-4 pt-0">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Credit Limit</span>
                <span>
                  {formatCurrency(
                    currentAccount.balance + currentAccount.availableCredit,
                    currentAccount.currency,
                  )}
                </span>
              </div>
              <Progress
                value={
                  (currentAccount.balance /
                    (currentAccount.balance + currentAccount.availableCredit)) *
                  100
                }
                className="h-2"
              />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {(
                    (currentAccount.balance /
                      (currentAccount.balance +
                        currentAccount.availableCredit)) *
                    100
                  ).toFixed(0)}
                  % Used
                </span>
                <span className="text-green-600">
                  {formatCurrency(
                    currentAccount.availableCredit,
                    currentAccount.currency,
                  )}{" "}
                  Available
                </span>
              </div>

              {currentAccount.dueDate && currentAccount.minimumPayment && (
                <div className="mt-4 grid grid-cols-2 gap-4 bg-red-50 p-3 rounded-md">
                  <div>
                    <p className="text-sm text-gray-600">Next Payment Due</p>
                    <p className="font-medium">
                      {format(new Date(currentAccount.dueDate), "MMMM d, yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Minimum Payment</p>
                    <p className="font-medium">
                      {formatCurrency(
                        currentAccount.minimumPayment,
                        currentAccount.currency,
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        )}

        {currentAccount.type === "savings" && currentAccount.interestRate && (
          <CardContent className="pb-4 pt-0">
            <div className="bg-blue-50 p-3 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Interest Rate</p>
                  <p className="font-medium">
                    {currentAccount.interestRate}% APY
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Interest Earned YTD</p>
                  <p className="font-medium">
                    {formatCurrency(
                      currentAccount.balance *
                        (currentAccount.interestRate / 100) *
                        0.5,
                      currentAccount.currency,
                    )}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Recent Transactions</h3>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Filter className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">
                No transactions found
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your time range to see more transactions.
              </p>
            </div>
          ) : (
            <div className="rounded-md border divide-y">
              {filteredTransactions.map((transaction) => (
                <React.Fragment key={transaction.id}>
                  <div
                    className="p-4 hover:bg-muted/50 cursor-pointer"
                    onClick={() => toggleTransactionExpand(transaction.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="font-medium">
                          {transaction.description}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>
                            {format(new Date(transaction.date), "MMM d, yyyy")}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-xs font-normal"
                          >
                            {transaction.category}
                          </Badge>
                          {transaction.status === "pending" && (
                            <Badge
                              variant="outline"
                              className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs"
                            >
                              Pending
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-medium ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}
                        >
                          {transaction.type === "credit" ? "+" : "-"}
                          {formatCurrency(
                            transaction.amount,
                            currentAccount.currency,
                          )}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${expandedTransaction === transaction.id ? "rotate-180" : ""}`}
                        />
                      </div>
                    </div>
                  </div>

                  {expandedTransaction === transaction.id && (
                    <div className="p-4 bg-muted/30">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-sm font-medium">Date & Time</h4>
                          <p className="text-sm mt-1">
                            {format(
                              new Date(transaction.date),
                              "MMMM d, yyyy 'at' h:mm a",
                            )}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Category</h4>
                          <p className="text-sm mt-1">{transaction.category}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Status</h4>
                          <p className="text-sm mt-1 capitalize">
                            {transaction.status || "completed"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="insights" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Monthly Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  <p className="text-muted-foreground">Chart coming soon</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Spending by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  <p className="text-muted-foreground">Chart coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <EditAccountForm
        open={showEditForm}
        onOpenChange={setShowEditForm}
        account={currentAccount}
        onSaveAccount={handleSaveAccount}
      />
    </div>
  );
};

export default AccountDetails;

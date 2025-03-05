import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  CreditCard,
  DollarSign,
  Tag,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Flag,
  Edit,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  account: string;
  merchant?: {
    name: string;
    logo?: string;
  };
  status?: "pending" | "completed" | "failed";
  notes?: string;
  flagged?: boolean;
}

interface TransactionListProps {
  transactions?: Transaction[];
  title?: string;
  onTransactionSelect?: (transaction: Transaction) => void;
}

const defaultTransactions: Transaction[] = [
  {
    id: "tx1",
    date: "2023-05-28T10:30:00",
    description: "Grocery Shopping",
    amount: 78.52,
    type: "expense",
    category: "Food & Dining",
    account: "Chase Checking",
    merchant: {
      name: "Whole Foods Market",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=WholeFood",
    },
    status: "completed",
  },
  {
    id: "tx2",
    date: "2023-05-27T14:15:00",
    description: "Monthly Salary",
    amount: 3500.0,
    type: "income",
    category: "Income",
    account: "Bank of America Checking",
    merchant: {
      name: "Acme Corp",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=AcmeCorp",
    },
    status: "completed",
  },
  {
    id: "tx3",
    date: "2023-05-26T20:45:00",
    description: "Dinner with Friends",
    amount: 62.35,
    type: "expense",
    category: "Food & Dining",
    account: "Amex Gold Card",
    merchant: {
      name: "Olive Garden",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=OliveGarden",
    },
    status: "completed",
  },
  {
    id: "tx4",
    date: "2023-05-25T09:20:00",
    description: "Uber Ride",
    amount: 24.99,
    type: "expense",
    category: "Transportation",
    account: "Chase Sapphire",
    merchant: {
      name: "Uber",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Uber",
    },
    status: "completed",
  },
  {
    id: "tx5",
    date: "2023-05-24T16:30:00",
    description: "Amazon Purchase",
    amount: 49.99,
    type: "expense",
    category: "Shopping",
    account: "Discover Card",
    merchant: {
      name: "Amazon",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amazon",
    },
    status: "completed",
  },
  {
    id: "tx6",
    date: "2023-05-23T11:45:00",
    description: "Monthly Rent",
    amount: 1500.0,
    type: "expense",
    category: "Housing",
    account: "Chase Checking",
    merchant: {
      name: "Sunshine Apartments",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=SunshineApt",
    },
    status: "completed",
  },
  {
    id: "tx7",
    date: "2023-05-22T13:15:00",
    description: "Freelance Payment",
    amount: 750.0,
    type: "income",
    category: "Income",
    account: "Bank of America Checking",
    merchant: {
      name: "Design Client",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=DesignClient",
    },
    status: "completed",
  },
  {
    id: "tx8",
    date: "2023-05-21T08:30:00",
    description: "Coffee Shop",
    amount: 5.75,
    type: "expense",
    category: "Food & Dining",
    account: "Amex Gold Card",
    merchant: {
      name: "Starbucks",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Starbucks",
    },
    status: "completed",
  },
  {
    id: "tx9",
    date: "2023-05-20T19:20:00",
    description: "Gas Station",
    amount: 45.82,
    type: "expense",
    category: "Transportation",
    account: "Chase Sapphire",
    merchant: {
      name: "Shell",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shell",
    },
    status: "completed",
  },
  {
    id: "tx10",
    date: "2023-05-19T15:10:00",
    description: "Phone Bill",
    amount: 85.0,
    type: "expense",
    category: "Bills & Utilities",
    account: "Discover Card",
    merchant: {
      name: "Verizon",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Verizon",
    },
    status: "pending",
    flagged: true,
  },
];

const TransactionList: React.FC<TransactionListProps> = ({
  transactions = defaultTransactions,
  title = "Recent Transactions",
  onTransactionSelect = () => {},
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("all");

  // Extract unique categories and accounts for filters
  const categories = [...new Set(transactions.map((tx) => tx.category))].sort();
  const accounts = [...new Set(transactions.map((tx) => tx.account))].sort();

  // Filter transactions based on search term and filters
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.merchant?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory
      ? tx.category === selectedCategory
      : true;

    const matchesAccount = selectedAccount
      ? tx.account === selectedAccount
      : true;

    const matchesType = selectedType
      ? tx.type === selectedType.toLowerCase()
      : true;

    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "flagged"
          ? tx.flagged
          : activeTab === "pending"
            ? tx.status === "pending"
            : true;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesAccount &&
      matchesType &&
      matchesTab
    );
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortField === "date") {
      return sortDirection === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortField === "amount") {
      return sortDirection === "asc"
        ? a.amount - b.amount
        : b.amount - a.amount;
    } else if (sortField === "description") {
      return sortDirection === "asc"
        ? a.description.localeCompare(b.description)
        : b.description.localeCompare(a.description);
    }
    return 0;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleTransactionExpand = (id: string) => {
    setExpandedTransaction(expandedTransaction === id ? null : id);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedAccount(null);
    setSelectedType(null);
    setSortField("date");
    setSortDirection("desc");
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <div className="flex items-center space-x-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="hidden sm:block"
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="flagged">
                  Flagged
                  <Badge className="ml-1 bg-red-100 text-red-600">
                    {transactions.filter((tx) => tx.flagged).length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending
                  <Badge className="ml-1 bg-yellow-100 text-yellow-600">
                    {
                      transactions.filter((tx) => tx.status === "pending")
                        .length
                    }
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-4 flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Select
              value={selectedCategory || "all"}
              onValueChange={(value) =>
                setSelectedCategory(value === "all" ? null : value)
              }
            >
              <SelectTrigger className="h-9 w-[130px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedAccount || "all"}
              onValueChange={(value) =>
                setSelectedAccount(value === "all" ? null : value)
              }
            >
              <SelectTrigger className="h-9 w-[130px]">
                <SelectValue placeholder="Account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                {accounts.map((account) => (
                  <SelectItem key={account} value={account}>
                    {account}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedType || "all"}
              onValueChange={(value) =>
                setSelectedType(value === "all" ? null : value)
              }
            >
              <SelectTrigger className="h-9 w-[130px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Income">Income</SelectItem>
                <SelectItem value="Expense">Expense</SelectItem>
              </SelectContent>
            </Select>

            {(searchTerm ||
              selectedCategory ||
              selectedAccount ||
              selectedType) && (
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
        <div className="rounded-md border">
          <div className="grid grid-cols-12 items-center gap-4 bg-muted/50 p-4 text-sm font-medium text-muted-foreground">
            <div className="col-span-5 sm:col-span-4 flex items-center">
              <button
                onClick={() => handleSort("date")}
                className="flex items-center hover:text-foreground"
              >
                Date & Description
                {sortField === "date" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </span>
                )}
              </button>
            </div>
            <div className="col-span-3 hidden sm:block">
              <span>Category</span>
            </div>
            <div className="col-span-4 sm:col-span-3 flex items-center justify-end">
              <button
                onClick={() => handleSort("amount")}
                className="flex items-center hover:text-foreground"
              >
                Amount
                {sortField === "amount" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </span>
                )}
              </button>
            </div>
            <div className="col-span-3 sm:col-span-2 flex justify-end">
              <span>Actions</span>
            </div>
          </div>

          {sortedTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Filter className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">
                No transactions found
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your search or filters to find what you're looking
                for.
              </p>
              <Button variant="outline" className="mt-4" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              <AnimatePresence initial={false}>
                {sortedTransactions.map((transaction) => (
                  <React.Fragment key={transaction.id}>
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`grid grid-cols-12 items-center gap-4 p-4 ${transaction.flagged ? "bg-red-50" : ""} ${transaction.status === "pending" ? "bg-yellow-50" : ""}`}
                      onClick={() => toggleTransactionExpand(transaction.id)}
                    >
                      <div className="col-span-5 sm:col-span-4 flex items-center space-x-3">
                        <Avatar className="h-9 w-9 rounded-md">
                          {transaction.merchant?.logo ? (
                            <AvatarImage
                              src={transaction.merchant.logo}
                              alt={transaction.merchant.name}
                            />
                          ) : (
                            <AvatarFallback className="rounded-md bg-primary/10 text-primary">
                              {transaction.merchant?.name.charAt(0) || "T"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {transaction.description}
                            {transaction.flagged && (
                              <Flag className="ml-1 inline-block h-3 w-3 text-red-500" />
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(transaction.date), "MMM d, yyyy")}
                            {transaction.status === "pending" && (
                              <Badge
                                variant="outline"
                                className="ml-2 border-yellow-200 bg-yellow-100 text-yellow-700"
                              >
                                Pending
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-3 hidden sm:block">
                        <Badge
                          variant="secondary"
                          className="font-normal text-xs"
                        >
                          {transaction.category}
                        </Badge>
                      </div>
                      <div
                        className={`col-span-4 sm:col-span-3 text-right font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.type === "income" ? "+" : "-"}$
                        {transaction.amount.toFixed(2)}
                      </div>
                      <div className="col-span-3 sm:col-span-2 flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onTransactionSelect(transaction);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Category
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                // Toggle flag status
                                console.log("Flag transaction");
                              }}
                            >
                              <Flag className="mr-2 h-4 w-4" />
                              {transaction.flagged ? "Remove Flag" : "Flag"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                // Add note functionality
                                console.log("Add note");
                              }}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Add Note
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>

                    {/* Expanded transaction details */}
                    <AnimatePresence>
                      {expandedTransaction === transaction.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="bg-muted/30 px-4 py-3"
                        >
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                              <h4 className="text-sm font-medium">
                                Transaction Details
                              </h4>
                              <div className="mt-2 space-y-2 text-sm">
                                <div className="flex items-center">
                                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <span>
                                    {format(
                                      new Date(transaction.date),
                                      "MMMM d, yyyy 'at' h:mm a",
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <span>{transaction.account}</span>
                                </div>
                                <div className="flex items-center">
                                  <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <span>{transaction.category}</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium">Merchant</h4>
                              <div className="mt-2 flex items-center space-x-3">
                                <Avatar className="h-8 w-8 rounded-md">
                                  {transaction.merchant?.logo ? (
                                    <AvatarImage
                                      src={transaction.merchant.logo}
                                      alt={transaction.merchant.name}
                                    />
                                  ) : (
                                    <AvatarFallback className="rounded-md bg-primary/10 text-primary">
                                      {transaction.merchant?.name.charAt(0) ||
                                        "T"}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {transaction.merchant?.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {transaction.description}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium">Amount</h4>
                              <div className="mt-2 space-y-2">
                                <div
                                  className={`text-2xl font-bold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                                >
                                  {transaction.type === "income" ? "+" : "-"}$
                                  {transaction.amount.toFixed(2)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {transaction.status === "pending"
                                    ? "Transaction is pending"
                                    : "Transaction completed"}
                                </div>
                              </div>
                            </div>
                          </div>

                          {transaction.notes && (
                            <div className="mt-4 rounded-md bg-muted p-3">
                              <h4 className="text-sm font-medium">Notes</h4>
                              <p className="mt-1 text-sm">
                                {transaction.notes}
                              </p>
                            </div>
                          )}

                          <div className="mt-4 flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Add note functionality
                                console.log("Add note");
                              }}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Add Note
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Toggle flag status
                                console.log("Flag transaction");
                              }}
                            >
                              <Flag className="mr-2 h-4 w-4" />
                              {transaction.flagged ? "Remove Flag" : "Flag"}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionList;

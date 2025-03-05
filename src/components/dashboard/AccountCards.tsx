import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Wallet,
  PiggyBank,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: "credit" | "debit";
}

interface Account {
  id: string;
  name: string;
  type: "checking" | "savings" | "credit" | "investment";
  balance: number;
  currency: string;
  lastUpdated: string;
  accountNumber: string;
  transactions: Transaction[];
  color?: string;
}

interface AccountCardsProps {
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
    lastUpdated: "2023-05-15T10:30:00Z",
    accountNumber: "****4567",
    color: "#3b82f6",
    transactions: [
      {
        id: "t1",
        amount: 120.5,
        date: "2023-05-14T15:30:00Z",
        description: "Grocery Store",
        type: "debit",
      },
      {
        id: "t2",
        amount: 2500.0,
        date: "2023-05-10T09:15:00Z",
        description: "Salary Deposit",
        type: "credit",
      },
    ],
  },
  {
    id: "2",
    name: "Savings Account",
    type: "savings",
    balance: 12750.8,
    currency: "USD",
    lastUpdated: "2023-05-15T10:30:00Z",
    accountNumber: "****7890",
    color: "#10b981",
    transactions: [
      {
        id: "t3",
        amount: 1000.0,
        date: "2023-05-01T10:00:00Z",
        description: "Transfer from Checking",
        type: "credit",
      },
    ],
  },
  {
    id: "3",
    name: "Credit Card",
    type: "credit",
    balance: 1240.3,
    currency: "USD",
    lastUpdated: "2023-05-15T10:30:00Z",
    accountNumber: "****1234",
    color: "#f43f5e",
    transactions: [
      {
        id: "t4",
        amount: 85.2,
        date: "2023-05-13T18:45:00Z",
        description: "Restaurant",
        type: "debit",
      },
      {
        id: "t5",
        amount: 250.0,
        date: "2023-05-08T14:30:00Z",
        description: "Online Shopping",
        type: "debit",
      },
    ],
  },
  {
    id: "4",
    name: "Investment Portfolio",
    type: "investment",
    balance: 28450.75,
    currency: "USD",
    lastUpdated: "2023-05-15T10:30:00Z",
    accountNumber: "****5678",
    color: "#8b5cf6",
    transactions: [
      {
        id: "t6",
        amount: 1500.0,
        date: "2023-04-28T11:20:00Z",
        description: "Stock Purchase",
        type: "debit",
      },
      {
        id: "t7",
        amount: 320.45,
        date: "2023-05-05T09:30:00Z",
        description: "Dividend Payment",
        type: "credit",
      },
    ],
  },
];

const AccountCards: React.FC<AccountCardsProps> = ({
  accounts = defaultAccounts,
  onSelectAccount = () => {},
}) => {
  const [activeAccount, setActiveAccount] = useState<string>(
    accounts[0]?.id || "",
  );

  const handleAccountSelect = (accountId: string) => {
    setActiveAccount(accountId);
    onSelectAccount(accountId);
  };

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
        return <DollarSign className="h-5 w-5" />;
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
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="w-full bg-background py-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Accounts</h2>
          <Button variant="outline" size="sm">
            <PiggyBank className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent>
            {accounts.map((account) => (
              <CarouselItem
                key={account.id}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAccountSelect(account.id)}
                  className="cursor-pointer"
                >
                  <Card
                    className={`h-full overflow-hidden ${activeAccount === account.id ? "ring-2 ring-primary" : ""}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
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
                            <CardTitle className="text-base">
                              {account.name}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                              {account.accountNumber}
                            </p>
                          </div>
                        </div>
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
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Balance
                          </p>
                          <p className="text-2xl font-bold">
                            {formatCurrency(account.balance, account.currency)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Last updated: {formatDate(account.lastUpdated)}
                          </p>
                        </div>

                        <div className="border-t pt-3">
                          <p className="text-sm font-medium mb-2">
                            Recent Activity
                          </p>
                          <div className="space-y-2">
                            {account.transactions
                              .slice(0, 2)
                              .map((transaction) => (
                                <div
                                  key={transaction.id}
                                  className="flex justify-between items-center"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div
                                      className={`p-1 rounded-full ${transaction.type === "credit" ? "bg-green-100" : "bg-red-100"}`}
                                    >
                                      {transaction.type === "credit" ? (
                                        <TrendingUp className="h-3 w-3 text-green-600" />
                                      ) : (
                                        <TrendingUp className="h-3 w-3 text-red-600 transform rotate-180" />
                                      )}
                                    </div>
                                    <div>
                                      <p className="text-xs font-medium truncate w-32">
                                        {transaction.description}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {formatDate(transaction.date)}
                                      </p>
                                    </div>
                                  </div>
                                  <p
                                    className={`text-sm font-medium ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}
                                  >
                                    {transaction.type === "credit" ? "+" : "-"}
                                    {formatCurrency(
                                      transaction.amount,
                                      account.currency,
                                    )}
                                  </p>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-end mt-4 space-x-2">
            <CarouselPrevious className="static translate-y-0 translate-x-0" />
            <CarouselNext className="static translate-y-0 translate-x-0" />
          </div>
        </Carousel>

        <TooltipProvider>
          <div className="flex items-center justify-center mt-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground"
                >
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Swipe or use arrows to navigate
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Swipe left or right to see all your accounts</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default AccountCards;

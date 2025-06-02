import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  CreditCard,
  AlertTriangle,
  BarChart3,
  Download,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generatePDFInvoice } from "@/utils/pdfInvoice";

const BillingDashboard = () => {
  const { toast } = useToast();
  
  const currentMonthCost = 25277.00;
  const lastMonthCost = 18942.00;
  const forecastedCost = 31245.00;
  const budgetLimit = 30000.00;
  const budgetUsed = (currentMonthCost / budgetLimit) * 100;

  const costByService = [
    { service: "Machine Learning", cost: 10000.00, percentage: 39.6, change: "+12.3%", units: "4 instances" },
    { service: "Premium Support", cost: 7000.00, percentage: 27.7, change: "+5.7%", units: "2 plans" },
    { service: "Web Application Firewall", cost: 3280.00, percentage: 13.0, change: "+8.1%", units: "41 instances" },
    { service: "Virtual Machines (29 nodes)", cost: 2032.90, percentage: 8.0, change: "+15.4%", units: "29 instances @ £70.10/mo" },
    { service: "Monitoring & Logging", cost: 1567.74, percentage: 6.2, change: "+23.4%", units: "39 instances @ £40.20" },
    { service: "Additional Virtual Machines", cost: 560.00, percentage: 2.2, change: "+10.1%", units: "8 instances @ £70.00/mo" },
    { service: "Backup Storage", cost: 360.00, percentage: 1.4, change: "+1.2%", units: "45 TB @ £8.00/TB" },
    { service: "Content Delivery Network", cost: 255.00, percentage: 1.0, change: "+3.5%", units: "17 TB @ £15.00/TB" },
    { service: "Object Storage", cost: 130.00, percentage: 0.5, change: "-2.1%", units: "13 TB @ £10.00/TB" },
    { service: "Archive Storage", cost: 90.40, percentage: 0.4, change: "+1.8%", units: "30 TB @ £3.01/TB" },
    { service: "Data Transfer", cost: 0.96, percentage: 0.0, change: "+0.5%", units: "16 TB @ £0.06/TB" }
  ];

  const costByRegion = [
    { region: "eu-west-1", cost: 15667.80, percentage: 62.0 },
    { region: "eu-west-2", cost: 5055.40, percentage: 20.0 },
    { region: "us-east-1", cost: 2527.70, percentage: 10.0 },
    { region: "us-west-2", cost: 2025.10, percentage: 8.0 }
  ];

  const dailyCosts = [
    { date: "2024-01-01", cost: 812.50 },
    { date: "2024-01-02", cost: 789.30 },
    { date: "2024-01-03", cost: 945.20 },
    { date: "2024-01-04", cost: 876.40 },
    { date: "2024-01-05", cost: 1023.10 },
    { date: "2024-01-06", cost: 987.60 },
    { date: "2024-01-07", cost: 854.20 },
    { date: "2024-01-08", cost: 1132.80 },
    { date: "2024-01-09", cost: 998.70 },
    { date: "2024-01-10", cost: 843.90 }
  ];

  const bills = [
    { month: "January 2024", amount: 25277.00, status: "current", dueDate: "2024-02-01" },
    { month: "December 2023", amount: 18942.00, status: "paid", dueDate: "2024-01-01" },
    { month: "November 2023", amount: 20317.50, status: "paid", dueDate: "2023-12-01" },
    { month: "October 2023", amount: 17695.20, status: "paid", dueDate: "2023-11-01" },
    { month: "September 2023", amount: 16423.80, status: "paid", dueDate: "2023-10-01" }
  ];

  const costAlerts = [
    { 
      type: "Budget Alert", 
      message: "You have exceeded 84% of your monthly budget (£30,000)",
      severity: "warning",
      date: "2024-01-28"
    },
    {
      type: "Cost Spike",
      message: "Machine Learning costs increased by 25% compared to last week",
      severity: "info", 
      date: "2024-01-27"
    },
    {
      type: "Forecast Alert",
      message: "Projected to exceed budget by £1,245 this month",
      severity: "warning",
      date: "2024-01-26"
    }
  ];

  const handleDownloadBill = (billMonth: string, amount: number) => {
    try {
      generatePDFInvoice(billMonth, amount);
      toast({
        title: "Invoice Generated",
        description: `PDF invoice for ${billMonth} has been generated successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewBill = (billMonth: string) => {
    toast({
      title: "Bill Viewer",
      description: `Opening detailed view for ${billMonth}`,
    });
  };

  const handlePayNow = (billMonth: string, amount: number) => {
    toast({
      title: "Payment Processing",
      description: `Processing payment of £${amount.toLocaleString()} for ${billMonth}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "current": return "bg-yellow-100 text-yellow-800";
      case "paid": return "bg-green-100 text-green-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "warning": return "bg-yellow-100 text-yellow-800";
      case "error": return "bg-red-100 text-red-800";
      case "info": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Billing & Cost Management</h1>
        <p className="text-gray-600">Monitor and manage your Zeltra Connect costs</p>
      </div>

      {/* Cost Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-[#2563eb]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{currentMonthCost.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +33.4% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Month</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{lastMonthCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">December 2023</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forecasted</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{forecastedCost.toLocaleString()}</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              Above budget by £{(forecastedCost - budgetLimit).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Usage</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgetUsed.toFixed(1)}%</div>
            <Progress value={budgetUsed} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">£{budgetLimit.toLocaleString()} monthly budget</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Cost Overview</TabsTrigger>
          <TabsTrigger value="bills">Bills</TabsTrigger>
          <TabsTrigger value="budgets">Budgets & Alerts</TabsTrigger>
          <TabsTrigger value="reports">Cost Explorer</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cost by Service */}
            <Card>
              <CardHeader>
                <CardTitle>Cost by Service</CardTitle>
                <CardDescription>Current month breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {costByService.map((item) => (
                    <div key={item.service} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{item.service}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold">£{item.cost.toLocaleString()}</span>
                            <Badge variant={item.change.startsWith('+') ? "destructive" : "default"} className="text-xs">
                              {item.change}
                            </Badge>
                          </div>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-muted-foreground">{item.percentage}% of total</span>
                          <span className="text-xs text-muted-foreground">{item.units}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cost by Region */}
            <Card>
              <CardHeader>
                <CardTitle>Cost by Region</CardTitle>
                <CardDescription>Geographic distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {costByRegion.map((item) => (
                    <div key={item.region} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{item.region}</span>
                          <span className="text-sm font-bold">£{item.cost.toLocaleString()}</span>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                        <span className="text-xs text-muted-foreground">{item.percentage}% of total</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Cost Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Cost Trend</CardTitle>
              <CardDescription>Last 10 days</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Daily Cost</TableHead>
                    <TableHead>Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyCosts.map((day, index) => {
                    const previousDay = dailyCosts[index - 1];
                    const changeValue = previousDay ? ((day.cost - previousDay.cost) / previousDay.cost * 100) : 0;
                    const changeString = changeValue.toFixed(1);
                    return (
                      <TableRow key={day.date}>
                        <TableCell>{day.date}</TableCell>
                        <TableCell>£{day.cost.toLocaleString()}</TableCell>
                        <TableCell>
                          {previousDay && (
                            <Badge variant={changeValue > 0 ? "destructive" : "default"}>
                              {changeValue > 0 ? '+' : ''}{changeString}%
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View and download your Zeltra Connect bills</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Billing Period</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bills.map((bill) => (
                    <TableRow key={bill.month}>
                      <TableCell className="font-medium">{bill.month}</TableCell>
                      <TableCell>£{bill.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(bill.status)}>
                          {bill.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{bill.dueDate}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewBill(bill.month)}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownloadBill(bill.month, bill.amount)}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            PDF
                          </Button>
                          {bill.status === "current" && (
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handlePayNow(bill.month, bill.amount)}
                            >
                              <CreditCard className="h-3 w-3 mr-1" />
                              Pay Now
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Status</CardTitle>
                <CardDescription>Monthly budget monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Monthly Budget</span>
                  <span className="text-lg font-bold">£{budgetLimit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Spent</span>
                  <span className="text-lg font-bold">£{currentMonthCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Remaining</span>
                  <span className={`text-lg font-bold ${budgetLimit - currentMonthCost < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    £{(budgetLimit - currentMonthCost).toLocaleString()}
                  </span>
                </div>
                <Progress value={budgetUsed} className="h-4" />
                <p className="text-xs text-muted-foreground">
                  {budgetUsed.toFixed(1)}% of budget used
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Alerts</CardTitle>
                <CardDescription>Recent notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {costAlerts.map((alert, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                      <AlertTriangle className="h-4 w-4 mt-0.5 text-yellow-500" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{alert.type}</span>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost Explorer</CardTitle>
              <CardDescription>Analyze your Zeltra Connect costs and usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Cost Explorer</h3>
                <p className="text-gray-600 mb-4">
                  Dive deep into your cost and usage data with interactive charts and reports
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">• View costs by service, account, or tag</p>
                  <p className="text-sm text-gray-500">• Analyze trends over time</p>
                  <p className="text-sm text-gray-500">• Create custom reports</p>
                  <p className="text-sm text-gray-500">• Set up automated reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingDashboard;

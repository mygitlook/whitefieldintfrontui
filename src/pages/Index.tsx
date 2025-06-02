import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Server, 
  Database, 
  HardDrive, 
  Zap, 
  Users, 
  DollarSign, 
  Activity, 
  Globe,
  Shield,
  FileText,
  BarChart3,
  Settings,
  Cloud,
  Network,
  Archive,
  Cpu,
  Eye,
  Save,
  LifeBuoy
} from "lucide-react";
import ZeltraHeader from "@/components/AWSHeader";
import EC2Dashboard from "@/components/EC2Dashboard";
import S3Dashboard from "@/components/S3Dashboard";
import RDSDashboard from "@/components/RDSDashboard";
import BillingDashboard from "@/components/BillingDashboard";
import LambdaDashboard from "@/components/LambdaDashboard";
import IAMDashboard from "@/components/IAMDashboard";
import CloudFormationDashboard from "@/components/CloudFormationDashboard";
import DeploymentGuide from "@/components/DeploymentGuide";
import VPCDashboard from "@/components/VPCDashboard";
import ElasticLoadBalancerDashboard from "@/components/ElasticLoadBalancerDashboard";
import ArchiveStorageDashboard from "@/components/ArchiveStorageDashboard";
import CDNDashboard from "@/components/CDNDashboard";
import WAFDashboard from "@/components/WAFDashboard";
import MachineLearningDashboard from "@/components/MachineLearningDashboard";
import PremiumSupportDashboard from "@/components/PremiumSupportDashboard";
import DataTransferDashboard from "@/components/DataTransferDashboard";
import BackupStorageDashboard from "@/components/BackupStorageDashboard";
import MonitoringDashboard from "@/components/MonitoringDashboard";
import LoginPage from "@/components/LoginPage";
import { mockBackend } from "@/utils/mockBackend";

const Index = () => {
  const [activeService, setActiveService] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ec2Stats, setEc2Stats] = useState({ total: 0, running: 0, stopped: 0, cost: 0 });

  // Check for existing login session
  useEffect(() => {
    const savedSession = localStorage.getItem('zeltra-session');
    if (savedSession === 'logged-in') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('zeltra-session', 'logged-in');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('zeltra-session');
    setActiveService("dashboard");
  };

  // Load EC2 instances and calculate stats
  useEffect(() => {
    if (!isLoggedIn) return;

    const updateEC2Stats = async () => {
      try {
        const instances = await mockBackend.getInstances();
        const running = instances.filter((i: any) => i.state === "running").length;
        const stopped = instances.filter((i: any) => i.state === "stopped").length;
        
        // Calculate cost based on instance types and running status
        const cost = instances.reduce((total: number, instance: any) => {
          if (instance.state === "running") {
            const hourlyRates: { [key: string]: number } = {
              "t3.micro": 0.0085,
              "t3.small": 0.017,
              "t3.medium": 0.034,
              "t3.large": 0.068,
              "m5.large": 0.079,
              "c5.large": 0.070,
              "virtual-pc": 2.92
            };
            const hourlyRate = hourlyRates[instance.type] || 0.041;
            return total + (hourlyRate * 24 * 30); // Monthly cost in GBP
          }
          return total;
        }, 0);

        setEc2Stats({
          total: instances.length,
          running,
          stopped,
          cost: parseFloat(cost.toFixed(2))
        });
      } catch (error) {
        console.error('Failed to update EC2 stats:', error);
        // Fallback to localStorage
        const savedInstances = localStorage.getItem('ec2-instances');
        if (savedInstances) {
          const instances = JSON.parse(savedInstances);
          const running = instances.filter((i: any) => i.state === "running").length;
          const stopped = instances.filter((i: any) => i.state === "stopped").length;
          
          const cost = instances.reduce((total: number, instance: any) => {
            if (instance.state === "running") {
              const hourlyRates: { [key: string]: number } = {
                "t3.micro": 0.0085,
                "t3.small": 0.017,
                "t3.medium": 0.034,
                "t3.large": 0.068,
                "m5.large": 0.079,
                "c5.large": 0.070,
                "virtual-pc": 2.92
              };
              const hourlyRate = hourlyRates[instance.type] || 0.041;
              return total + (hourlyRate * 24 * 30);
            }
            return total;
          }, 0);

          setEc2Stats({
            total: instances.length,
            running,
            stopped,
            cost: parseFloat(cost.toFixed(2))
          });
        }
      }
    };

    updateEC2Stats();
    
    // Listen for storage changes to update stats in real-time
    const handleStorageChange = () => updateEC2Stats();
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when instances are modified within the same tab
    const handleInstanceUpdate = () => updateEC2Stats();
    window.addEventListener('ec2-instances-updated', handleInstanceUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('ec2-instances-updated', handleInstanceUpdate);
    };
  }, [activeService, isLoggedIn]);

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const services = [
    { id: "ec2", name: "Virtual Machines", icon: Server, description: "Scalable Virtual Servers", status: "running", instances: ec2Stats.total, cost: ec2Stats.cost, color: "bg-blue-500" },
    { id: "s3", name: "Object Storage", icon: HardDrive, description: "Scalable Object Storage", status: "active", buckets: 13, cost: 130.00, color: "bg-green-500" },
    { id: "rds", name: "Database", icon: Database, description: "Managed Relational Database", status: "running", databases: 2, cost: 450.00, color: "bg-purple-500" },
    { id: "lambda", name: "Serverless", icon: Zap, description: "Serverless Computing", status: "active", functions: 12, cost: 85.50, color: "bg-yellow-500" },
    { id: "iam", name: "Identity Management", icon: Users, description: "Identity and Access Management", status: "configured", users: 5, cost: 0, color: "bg-indigo-500" },
    { id: "cloudformation", name: "Infrastructure", icon: FileText, description: "Infrastructure as Code", status: "active", stacks: 3, cost: 25.00, color: "bg-orange-500" },
    { id: "archive", name: "Archive Storage", icon: Archive, description: "Long-term Archive Storage", status: "active", archives: 30, cost: 90.40, color: "bg-gray-500" },
    { id: "cdn", name: "CDN", icon: Globe, description: "Content Delivery Network", status: "active", transfers: 17, cost: 255.00, color: "bg-teal-500" },
    { id: "waf", name: "Web Firewall", icon: Shield, description: "Web Application Firewall", status: "active", instances: 41, cost: 3280.00, color: "bg-red-500" },
    { id: "ml", name: "Machine Learning", icon: Cpu, description: "ML Model Training", status: "active", models: 4, cost: 10000.00, color: "bg-pink-500" },
    { id: "monitoring", name: "Monitoring", icon: Eye, description: "Monitoring & Logging", status: "active", instances: 39, cost: 1567.74, color: "bg-cyan-500" },
    { id: "backup", name: "Backup", icon: Save, description: "Backup Storage", status: "active", backups: 45, cost: 360.00, color: "bg-emerald-500" },
    { id: "support", name: "Premium Support", icon: LifeBuoy, description: "24/7 Expert Support", status: "active", plans: 2, cost: 7000.00, color: "bg-violet-500" },
    { id: "data-transfer", name: "Data Transfer", icon: Network, description: "Outbound Data Transfer", status: "active", transfers: 16, cost: 0.96, color: "bg-slate-500" }
  ];

  const recentActivity = [
    { action: "Launched VM instance", resource: "vm-0123456789abcdef0", time: "2 minutes ago", status: "success" },
    { action: "Created storage bucket", resource: "my-app-bucket-2024", time: "15 minutes ago", status: "success" },
    { action: "Updated database instance", resource: "prod-database", time: "1 hour ago", status: "success" },
    { action: "Deployed serverless function", resource: "data-processor", time: "3 hours ago", status: "success" },
  ];

  const handleServiceSelect = (serviceId: string) => {
    setActiveService(serviceId);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Service Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500 hover:scale-105" onClick={() => setActiveService(service.id)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-800">{service.name}</CardTitle>
              <div className={`p-2 rounded-lg ${service.color}`}>
                <service.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-gray-900">
                {service.instances && service.instances}
                {service.buckets && service.buckets}
                {service.databases && service.databases}
                {service.functions && service.functions}
                {service.users && service.users}
                {service.stacks && service.stacks}
                {service.archives && service.archives}
                {service.transfers && service.transfers}
                {service.models && service.models}
                {service.backups && service.backups}
                {service.plans && service.plans}
              </div>
              <p className="text-xs text-gray-600 mt-1">{service.description}</p>
              <div className="flex items-center justify-between mt-2">
                <Badge variant={service.status === "running" ? "default" : "secondary"} className="text-xs">
                  {service.status}
                </Badge>
                {service.cost !== undefined && service.cost > 0 && (
                  <span className="text-xs text-green-600 font-medium">£{service.cost.toLocaleString()}/mo</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">VM Instances</CardTitle>
            <Server className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{ec2Stats.total}</div>
            <p className="text-xs text-blue-700">
              {ec2Stats.running} running, {ec2Stats.stopped} stopped
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">VM Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">£{ec2Stats.cost}</div>
            <p className="text-xs text-green-700">Monthly estimate</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Storage</CardTitle>
            <HardDrive className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">847 GB</div>
            <p className="text-xs text-purple-700">Across all services</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Total Cost</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">£{(25277.00).toLocaleString()}</div>
            <p className="text-xs text-orange-700">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Cost Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.resource}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{activity.time}</p>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-2 rounded bg-pink-50">
                <span className="text-sm font-medium">Machine Learning</span>
                <span className="font-bold text-pink-700">£10,000</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-violet-50">
                <span className="text-sm">Premium Support</span>
                <span className="text-sm text-violet-700 font-medium">£7,000</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-red-50">
                <span className="text-sm">Web Firewall</span>
                <span className="text-sm text-red-700 font-medium">£3,280</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-blue-50">
                <span className="text-sm">Virtual Machines (29+8)</span>
                <span className="text-sm text-blue-700 font-medium">£{(2032.90 + 560.00).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-gray-50">
                <span className="text-sm">Other Services</span>
                <span className="text-sm text-gray-700 font-medium">£2,404</span>
              </div>
              <div className="border-t pt-4 bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total This Month</span>
                  <span className="font-bold text-xl text-gray-900">£{(25277.00).toLocaleString()}</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 hover:from-blue-600 hover:to-blue-700"
                onClick={() => setActiveService("billing")}
              >
                View Detailed Billing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 overflow-x-hidden">
      <ZeltraHeader onServiceSelect={handleServiceSelect} onLogout={handleLogout} />
      
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-64 bg-white shadow-xl border-r border-gray-200">
          <div className="p-3 lg:p-4">
            <h2 className="font-bold text-gray-900 mb-4 text-sm lg:text-base bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Zeltra Services</h2>
            <nav className="space-y-1 lg:space-y-2">
              <Button
                variant={activeService === "dashboard" ? "default" : "ghost"}
                className={`w-full justify-start text-xs lg:text-sm ${
                  activeService === "dashboard" 
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" 
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
                onClick={() => setActiveService("dashboard")}
              >
                <BarChart3 className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                Dashboard
              </Button>
              
              {/* Compute Section */}
              <div className="pt-2 lg:pt-4">
                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1 lg:mb-2">
                  Compute
                </h3>
                <Button
                  variant={activeService === "ec2" ? "default" : "ghost"}
                  className={`w-full justify-start text-xs lg:text-sm ${
                    activeService === "ec2" 
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" 
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                  onClick={() => setActiveService("ec2")}
                >
                  <Server className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  Virtual Machines
                </Button>
                <Button
                  variant={activeService === "lambda" ? "default" : "ghost"}
                  className={`w-full justify-start text-xs lg:text-sm ${
                    activeService === "lambda" 
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" 
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                  onClick={() => setActiveService("lambda")}
                >
                  <Zap className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  Serverless
                </Button>
                <Button
                  variant={activeService === "ml" ? "default" : "ghost"}
                  className={`w-full justify-start text-xs lg:text-sm ${
                    activeService === "ml" 
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" 
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                  onClick={() => setActiveService("ml")}
                >
                  <Cpu className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  Machine Learning
                </Button>
              </div>

              {/* Storage Section */}
              <div className="pt-2 lg:pt-4">
                <h3 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1 lg:mb-2">
                  Storage
                </h3>
                <Button
                  variant={activeService === "s3" ? "default" : "ghost"}
                  className={`w-full justify-start text-xs lg:text-sm ${
                    activeService === "s3" 
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white" 
                      : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                  }`}
                  onClick={() => setActiveService("s3")}
                >
                  <HardDrive className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  Object Storage
                </Button>
                <Button
                  variant={activeService === "archive" ? "default" : "ghost"}
                  className={`w-full justify-start text-xs lg:text-sm ${
                    activeService === "archive" 
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white" 
                      : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                  }`}
                  onClick={() => setActiveService("archive")}
                >
                  <Archive className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  Archive Storage
                </Button>
                <Button
                  variant={activeService === "backup" ? "default" : "ghost"}
                  className={`w-full justify-start text-xs lg:text-sm ${
                    activeService === "backup" 
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white" 
                      : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                  }`}
                  onClick={() => setActiveService("backup")}
                >
                  <Save className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  Backup Storage
                </Button>
              </div>

              {/* Database Section */}
              <div className="pt-2 lg:pt-4">
                <h3 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1 lg:mb-2">
                  Database
                </h3>
                <Button
                  variant={activeService === "rds" ? "default" : "ghost"}
                  className={`w-full justify-start text-xs lg:text-sm ${
                    activeService === "rds" 
                      ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white" 
                      : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                  }`}
                  onClick={() => setActiveService("rds")}
                >
                  <Database className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  Database
                </Button>
              </div>

              {/* Networking Section */}
              <div className="pt-2 lg:pt-4">
                <h3 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1 lg:mb-2">
                  Networking
                </h3>
                <Button
                  variant={activeService === "vpc" ? "default" : "ghost"}
                  className={`w-full justify-start text-xs lg:text-sm ${
                    activeService === "vpc" 
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white" 
                      : "text-gray-700 hover:bg-orange-50 hover:text-orange-700"
                  }`}
                  onClick={() => setActiveService("vpc")}
                >
                  <Globe className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  VPC
                </Button>
                <Button
                  variant={activeService === "elb" ? "default" : "ghost"}
                  className={`w-full justify-start text-xs lg:text-sm ${
                    activeService === "elb" 
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white" 
                      : "text-gray-700 hover:bg-orange-50 hover:text-orange-700"
                  }`}
                  onClick={() => setActiveService("elb")}
                >
                  <Network className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  Load Balancer
                </Button>
                <Button
                  variant={activeService === "cdn" ? "default" : "ghost"}
                  className={`w-full justify-start text-xs lg:text-sm ${
                    activeService === "cdn" 
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white" 
                      : "text-gray-700 hover:bg-orange-50 hover:text-orange-700"
                  }`}
                  onClick={() => setActiveService("cdn")}
                >
                  <Globe className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  CDN
                </Button>
                <Button
                  variant={activeService === "data-transfer" ? "default" : "ghost"}
                  className={`w-full justify-start text-xs lg:text-sm ${
                    activeService === "data-transfer" 
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white" 
                      : "text-gray-700 hover:bg-orange-50 hover:text-orange-700"
                  }`}
                  onClick={() => setActiveService("data-transfer")}
                >
                  <Network className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  Data Transfer
                </Button>
              </div>

              {/* Security Section */}
              <div className="pt-2 lg:pt-4">
                <h3 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1 lg:mb-2">
                  Security
                </h3>
                <Button
                  variant={activeService === "iam" ? "default" : "ghost"}
                  className={`w-full justify-start text-xs lg:text-sm ${
                    activeService === "iam" 
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white" 
                      : "text-gray-700 hover:bg-red-50 hover:text-red-700"
                  }`}
                  onClick={() => setActiveService("iam")}
                >
                  <Users className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  Identity Management
                </Button>
                <Button
                  variant={activeService === "waf" ? "default" : "ghost"}
                  className={`w-full justify-start text-xs lg:text-sm ${
                    activeService === "waf" 
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white" 
                      : "text-gray-700 hover:bg-red-50 hover:text-red-700"
                  }`}
                  onClick={() => setActiveService("waf")}
                >
                  <Shield className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  Web Firewall
                </Button>
              </div>

              {/* Management Section */}
              <div className="pt-2 lg:pt-4">
                <h3 className="text-xs font-bold text-pink-600 uppercase tracking-wider mb-1 lg:mb-2">
                  Management
                </h3>
                <Button
                  variant={activeService === "billing" ? "default" : "ghost"}
                  className={`w-full justify-start text-xs lg:text-sm ${
                    activeService === "billing" 
                      ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white" 
                      : "text-gray-700 hover:bg-pink-50 hover:text-pink-700"
                  }`}
                  onClick={() => setActiveService("billing")}
                >
                  <DollarSign className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  Billing
                </Button>
                <Button
                  variant={activeService === "cloudformation" ? "default" : "ghost"}
                  className={`w-full justify-start text-xs lg:text-sm ${
                    activeService === "cloudformation" 
                      ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white" 
                      : "text-gray-700 hover:bg-pink-50 hover:text-pink-700"
                  }`}
                  onClick={() => setActiveService("cloudformation")}
                >
                  <FileText className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  Infrastructure
                </Button>
                <Button
                  variant={activeService === "monitoring" ? "default" : "ghost"}
                  className={`w-full justify-start text-xs lg:text-sm ${
                    activeService === "monitoring" 
                      ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white" 
                      : "text-gray-700 hover:bg-pink-50 hover:text-pink-700"
                  }`}
                  onClick={() => setActiveService("monitoring")}
                >
                  <Eye className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  Monitoring
                </Button>
                <Button
                  variant={activeService === "support" ? "default" : "ghost"}
                  className={`w-full justify-start text-xs lg:text-sm ${
                    activeService === "support" 
                      ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white" 
                      : "text-gray-700 hover:bg-pink-50 hover:text-pink-700"
                  }`}
                  onClick={() => setActiveService("support")}
                >
                  <LifeBuoy className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  Premium Support
                </Button>
              </div>

              {/* Tools Section */}
              <div className="pt-2 lg:pt-4">
                <h3 className="text-xs font-bold text-cyan-600 uppercase tracking-wider mb-1 lg:mb-2">
                  Tools
                </h3>
                <Button
                  variant={activeService === "deployment" ? "default" : "ghost"}
                  className={`w-full justify-start text-xs lg:text-sm ${
                    activeService === "deployment" 
                      ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white" 
                      : "text-gray-700 hover:bg-cyan-50 hover:text-cyan-700"
                  }`}
                  onClick={() => setActiveService("deployment")}
                >
                  <Cloud className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                  Deployment Guide
                </Button>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-3 lg:p-6 min-w-0">
          {activeService === "dashboard" && renderDashboard()}
          {activeService === "ec2" && <EC2Dashboard />}
          {activeService === "s3" && <S3Dashboard />}
          {activeService === "rds" && <RDSDashboard />}
          {activeService === "billing" && <BillingDashboard />}
          {activeService === "lambda" && <LambdaDashboard />}
          {activeService === "iam" && <IAMDashboard />}
          {activeService === "cloudformation" && <CloudFormationDashboard />}
          {activeService === "vpc" && <VPCDashboard />}
          {activeService === "elb" && <ElasticLoadBalancerDashboard />}
          {activeService === "deployment" && <DeploymentGuide />}
          {activeService === "archive" && <ArchiveStorageDashboard />}
          {activeService === "cdn" && <CDNDashboard />}
          {activeService === "waf" && <WAFDashboard />}
          {activeService === "ml" && <MachineLearningDashboard />}
          {activeService === "support" && <PremiumSupportDashboard />}
          {activeService === "data-transfer" && <DataTransferDashboard />}
          {activeService === "backup" && <BackupStorageDashboard />}
          {activeService === "monitoring" && <MonitoringDashboard />}
        </div>
      </div>
    </div>
  );
};

export default Index;

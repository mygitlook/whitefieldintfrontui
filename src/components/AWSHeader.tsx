import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  Bell, 
  Search, 
  User, 
  Globe, 
  ChevronDown,
  HelpCircle,
  CreditCard,
  LifeBuoy,
  Settings,
  LogOut
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const ZeltraHeader = ({ onServiceSearch, onServiceSelect, onLogout }: { 
  onServiceSearch?: (query: string) => void;
  onServiceSelect?: (service: string) => void;
  onLogout?: () => void;
}) => {
  const [region, setRegion] = useState("eu-west-1");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const regions = [
    { id: "eu-west-1", name: "Europe (Ireland)", flag: "🇮🇪" },
    { id: "eu-west-2", name: "Europe (London)", flag: "🇬🇧" },
    { id: "us-east-1", name: "US East (N. Virginia)", flag: "🇺🇸" },
    { id: "us-west-2", name: "US West (Oregon)", flag: "🇺🇸" },
    { id: "ap-southeast-1", name: "Asia Pacific (Singapore)", flag: "🇸🇬" },
  ];

  const services = [
    { id: "ec2", name: "Virtual Machines", description: "Virtual Machines", keywords: ["virtual", "machine", "vm", "compute", "ec2"] },
    { id: "s3", name: "Object Storage", description: "Object Storage", keywords: ["storage", "object", "s3", "bucket"] },
    { id: "rds", name: "Database", description: "Managed Database", keywords: ["database", "rds", "sql", "mysql"] },
    { id: "lambda", name: "Serverless", description: "Serverless Computing", keywords: ["lambda", "serverless", "function"] },
    { id: "vpc", name: "VPC", description: "Virtual Private Cloud", keywords: ["vpc", "network", "virtual", "private", "cloud"] },
    { id: "elb", name: "Load Balancer", description: "Load Balancing", keywords: ["load", "balancer", "elb", "traffic"] },
    { id: "iam", name: "Identity Management", description: "Identity Management", keywords: ["iam", "identity", "access", "user"] },
    { id: "cloudformation", name: "Infrastructure", description: "Infrastructure as Code", keywords: ["cloudformation", "infrastructure", "template"] },
    { id: "archive", name: "Archive Storage", description: "Long-term Storage", keywords: ["archive", "storage", "backup"] },
    { id: "cdn", name: "CDN", description: "Content Delivery Network", keywords: ["cdn", "content", "delivery", "network"] },
    { id: "waf", name: "Web Firewall", description: "Web Application Firewall", keywords: ["waf", "firewall", "security", "web"] },
    { id: "ml", name: "Machine Learning", description: "ML Model Training", keywords: ["machine", "learning", "ml", "ai", "model"] },
    { id: "monitoring", name: "Monitoring", description: "Monitoring & Logging", keywords: ["monitoring", "logs", "cloudwatch"] },
    { id: "backup", name: "Backup", description: "Backup Storage", keywords: ["backup", "storage", "recovery"] }
  ];

  const handleProfileAction = (action: string) => {
    switch (action) {
      case 'account':
        toast({
          title: "My Account",
          description: "Redirecting to account settings...",
        });
        break;
      case 'billing':
        toast({
          title: "Billing Dashboard",
          description: "Opening billing dashboard...",
        });
        if (onServiceSelect) onServiceSelect('billing');
        break;
      case 'support':
        toast({
          title: "Support Cases",
          description: "Opening support center...",
        });
        break;
      case 'switch-role':
        toast({
          title: "Switch Role",
          description: "Role switching interface would open here...",
        });
        break;
      case 'signout':
        toast({
          title: "Signed Out",
          description: "You have been successfully signed out.",
        });
        if (onLogout) onLogout();
        break;
      default:
        break;
    }
  };

  const handleNotifications = () => {
    toast({
      title: "Notifications",
      description: "You have 3 unread notifications",
    });
  };

  const handleHelp = () => {
    toast({
      title: "Zeltra Support",
      description: "Opening Zeltra documentation and support resources...",
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const matchedService = services.find(service => 
        service.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (matchedService && onServiceSelect) {
        onServiceSelect(matchedService.id);
        toast({
          title: "Search Result",
          description: `Opening ${matchedService.name} dashboard...`,
        });
      } else {
        toast({
          title: "No Results",
          description: `No services found for "${searchQuery}"`,
        });
      }
      setSearchQuery("");
    }
  };

  const handleServiceClick = (serviceId: string) => {
    if (onServiceSelect) {
      onServiceSelect(serviceId);
    }
  };

  const filteredServices = services.filter(service =>
    service.keywords.some(keyword => 
      keyword.toLowerCase().includes(searchQuery.toLowerCase())
    ) ||
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 border-b border-blue-500 px-6 py-3 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Services */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center shadow-md">
              <span className="text-blue-600 font-bold text-xs">ZC</span>
            </div>
            <span className="font-semibold text-white text-lg">Zeltra Connect</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm text-white hover:bg-blue-500/20">
                Services
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-white shadow-xl border-0">
              <div className="p-2">
                <Input 
                  placeholder="Search services..." 
                  className="mb-2 border-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="space-y-1">
                  <DropdownMenuItem className="font-medium text-gray-500">
                    {searchQuery ? 'Search Results' : 'Recently used'}
                  </DropdownMenuItem>
                  {(searchQuery ? filteredServices : services.slice(0, 8)).map((service) => (
                    <DropdownMenuItem 
                      key={service.id}
                      onClick={() => handleServiceClick(service.id)}
                      className="cursor-pointer hover:bg-blue-50 rounded-md"
                    >
                      <div>
                        <div className="font-medium text-gray-900">{service.name}</div>
                        <div className="text-xs text-gray-500">{service.description}</div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  {searchQuery && filteredServices.length === 0 && (
                    <DropdownMenuItem disabled>
                      <div className="text-gray-500">No services found</div>
                    </DropdownMenuItem>
                  )}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-xl mx-8">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search for services, features, blogs, docs, and more"
              className="pl-10 bg-white/90 border-white/20 focus:bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Right side - User and settings */}
        <div className="flex items-center space-x-4">
          {/* Region Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm text-white hover:bg-blue-500/20">
                <Globe className="h-4 w-4 mr-1" />
                {regions.find(r => r.id === region)?.flag} {region}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white shadow-xl border-0">
              {regions.map((r) => (
                <DropdownMenuItem key={r.id} onClick={() => setRegion(r.id)} className="hover:bg-blue-50">
                  <span className="mr-2">{r.flag}</span>
                  <div>
                    <div className="font-medium">{r.id}</div>
                    <div className="text-xs text-gray-500">{r.name}</div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Help */}
          <Button variant="ghost" size="sm" onClick={handleHelp} className="text-white hover:bg-blue-500/20">
            <HelpCircle className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative text-white hover:bg-blue-500/20" onClick={handleNotifications}>
            <Bell className="h-4 w-4" />
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm text-white hover:bg-blue-500/20">
                <User className="h-4 w-4 mr-1" />
                John Paul
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white shadow-xl border-0">
              <DropdownMenuItem onClick={() => handleProfileAction('account')} className="cursor-pointer hover:bg-blue-50">
                <User className="mr-2 h-4 w-4" />
                My Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleProfileAction('billing')} className="cursor-pointer hover:bg-blue-50">
                <CreditCard className="mr-2 h-4 w-4" />
                My Billing Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleProfileAction('support')} className="cursor-pointer hover:bg-blue-50">
                <LifeBuoy className="mr-2 h-4 w-4" />
                My Support Cases
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleProfileAction('switch-role')} className="cursor-pointer hover:bg-blue-50">
                <Settings className="mr-2 h-4 w-4" />
                Switch Role
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleProfileAction('signout')} className="cursor-pointer hover:bg-red-50 text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default ZeltraHeader;

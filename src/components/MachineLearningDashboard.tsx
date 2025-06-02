
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Cpu, 
  Plus,
  DollarSign,
  Activity,
  Brain,
  Settings,
  Play,
  Square
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MLInstance {
  id: string;
  name: string;
  modelType: string;
  status: "training" | "deployed" | "stopped" | "failed";
  accuracy: number;
  trainingHours: number;
  createdDate: string;
  lastTrained: string;
}

const MachineLearningDashboard = () => {
  const [instances, setInstances] = useState<MLInstance[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newInstanceName, setNewInstanceName] = useState("");
  const [selectedModelType, setSelectedModelType] = useState("");
  const { toast } = useToast();

  const modelTypes = [
    { id: "classification", name: "Classification Model", description: "Classify data into categories" },
    { id: "regression", name: "Regression Model", description: "Predict continuous values" },
    { id: "clustering", name: "Clustering Model", description: "Group similar data points" },
    { id: "neural-network", name: "Neural Network", description: "Deep learning model" },
    { id: "natural-language", name: "Natural Language Processing", description: "Text and language analysis" },
    { id: "computer-vision", name: "Computer Vision", description: "Image and video analysis" }
  ];

  useEffect(() => {
    loadInstances();
  }, []);

  const loadInstances = () => {
    const savedInstances = localStorage.getItem('ml-instances');
    if (savedInstances) {
      setInstances(JSON.parse(savedInstances));
    } else {
      const defaultInstances: MLInstance[] = [
        {
          id: "ml-1",
          name: "image-classifier-v1",
          modelType: "computer-vision",
          status: "deployed",
          accuracy: 94.5,
          trainingHours: 48,
          createdDate: "2024-01-15",
          lastTrained: "2024-01-20"
        },
        {
          id: "ml-2",
          name: "sentiment-analyzer",
          modelType: "natural-language",
          status: "training",
          accuracy: 89.2,
          trainingHours: 24,
          createdDate: "2024-01-18",
          lastTrained: "2024-01-25"
        },
        {
          id: "ml-3",
          name: "sales-predictor",
          modelType: "regression",
          status: "deployed",
          accuracy: 87.8,
          trainingHours: 36,
          createdDate: "2024-01-10",
          lastTrained: "2024-01-22"
        },
        {
          id: "ml-4",
          name: "customer-segmentation",
          modelType: "clustering",
          status: "stopped",
          accuracy: 92.1,
          trainingHours: 18,
          createdDate: "2024-01-12",
          lastTrained: "2024-01-19"
        }
      ];
      setInstances(defaultInstances);
      saveInstances(defaultInstances);
    }
  };

  const saveInstances = (instanceList: MLInstance[]) => {
    localStorage.setItem('ml-instances', JSON.stringify(instanceList));
  };

  const createInstance = () => {
    if (!newInstanceName || !selectedModelType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newInstance: MLInstance = {
      id: `ml-${Date.now()}`,
      name: newInstanceName,
      modelType: selectedModelType,
      status: "training",
      accuracy: 0,
      trainingHours: 0,
      createdDate: new Date().toISOString().split('T')[0],
      lastTrained: new Date().toISOString().split('T')[0]
    };

    const updatedInstances = [...instances, newInstance];
    setInstances(updatedInstances);
    saveInstances(updatedInstances);

    toast({
      title: "ML Instance Created",
      description: `${newInstanceName} training has started`,
    });

    setIsCreateDialogOpen(false);
    setNewInstanceName("");
    setSelectedModelType("");

    // Simulate training completion
    setTimeout(() => {
      const finalInstances = updatedInstances.map(i => 
        i.id === newInstance.id ? { 
          ...i, 
          status: "deployed" as const, 
          accuracy: Math.random() * 15 + 85,
          trainingHours: Math.floor(Math.random() * 30) + 10
        } : i
      );
      setInstances(finalInstances);
      saveInstances(finalInstances);
    }, 5000);
  };

  const startTraining = (id: string) => {
    const updatedInstances = instances.map(instance =>
      instance.id === id ? { ...instance, status: "training" as const } : instance
    );
    setInstances(updatedInstances);
    saveInstances(updatedInstances);
    
    const instance = instances.find(i => i.id === id);
    toast({
      title: "Training Started",
      description: `${instance?.name} training has started`,
    });
  };

  const stopInstance = (id: string) => {
    const updatedInstances = instances.map(instance =>
      instance.id === id ? { ...instance, status: "stopped" as const } : instance
    );
    setInstances(updatedInstances);
    saveInstances(updatedInstances);
    
    const instance = instances.find(i => i.id === id);
    toast({
      title: "Instance Stopped",
      description: `${instance?.name} has been stopped`,
    });
  };

  const totalInstances = instances.length;
  const deployedInstances = instances.filter(i => i.status === "deployed").length;
  const trainingInstances = instances.filter(i => i.status === "training").length;
  const monthlyCost = totalInstances * 2500.00; // £2,500.00 per instance

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Machine Learning</h1>
          <p className="text-gray-600">Train and deploy machine learning models at scale</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2563eb] hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create ML Instance
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create ML Instance</DialogTitle>
              <DialogDescription>
                Create a new machine learning training instance
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="instance-name">Instance Name</Label>
                <Input
                  id="instance-name"
                  value={newInstanceName}
                  onChange={(e) => setNewInstanceName(e.target.value)}
                  placeholder="Enter instance name"
                />
              </div>
              <div>
                <Label htmlFor="model-type">Model Type</Label>
                <Select value={selectedModelType} onValueChange={setSelectedModelType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model type" />
                  </SelectTrigger>
                  <SelectContent>
                    {modelTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <div className="text-xs text-gray-500">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={createInstance} className="w-full">
                Create and Start Training
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Models</CardTitle>
            <Brain className="h-4 w-4 text-[#2563eb]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInstances}</div>
            <p className="text-xs text-muted-foreground">{deployedInstances} deployed, {trainingInstances} training</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Training</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainingInstances}</div>
            <p className="text-xs text-muted-foreground">Currently training</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deployed Models</CardTitle>
            <Cpu className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deployedInstances}</div>
            <p className="text-xs text-muted-foreground">Ready for inference</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{monthlyCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">£2,500 per instance</p>
          </CardContent>
        </Card>
      </div>

      {/* Instances Table */}
      <Card>
        <CardHeader>
          <CardTitle>ML Instances</CardTitle>
          <CardDescription>Manage your machine learning training instances</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Model Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Accuracy</TableHead>
                <TableHead>Training Hours</TableHead>
                <TableHead>Last Trained</TableHead>
                <TableHead>Monthly Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instances.map((instance) => (
                <TableRow key={instance.id}>
                  <TableCell className="font-medium">{instance.name}</TableCell>
                  <TableCell className="capitalize">{instance.modelType.replace('-', ' ')}</TableCell>
                  <TableCell>
                    <Badge variant={
                      instance.status === "deployed" ? "default" : 
                      instance.status === "training" ? "secondary" : 
                      instance.status === "failed" ? "destructive" : "outline"
                    }>
                      {instance.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{instance.accuracy > 0 ? `${instance.accuracy.toFixed(1)}%` : "N/A"}</TableCell>
                  <TableCell>{instance.trainingHours}h</TableCell>
                  <TableCell>{instance.lastTrained}</TableCell>
                  <TableCell>£2,500.00</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {instance.status === "stopped" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startTraining(instance.id)}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                      ) : instance.status === "deployed" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => stopInstance(instance.id)}
                        >
                          <Square className="h-3 w-3" />
                        </Button>
                      ) : null}
                      <Button size="sm" variant="outline">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MachineLearningDashboard;

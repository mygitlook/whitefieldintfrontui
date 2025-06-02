
// Mock backend simulation to persist data across browsers
const BACKEND_URL = 'https://api.zeltraconnect.com'; // Mock URL

interface Instance {
  id: string;
  name: string;
  type: string;
  state: "running" | "stopped";
  publicIP: string;
  privateIP: string;
  launchTime: string;
  ami: string;
}

// Simulate server-side storage
const mockServerData = {
  instances: [
    {
      id: "i-1234567890abcdef0",
      name: "web-server-01",
      type: "virtual-pc",
      state: "running" as const,
      publicIP: "54.123.45.67",
      privateIP: "10.0.1.10",
      launchTime: "2024-01-15T10:30:00Z",
      ami: "ami-12345"
    },
    {
      id: "i-0987654321fedcba0",
      name: "database-server",
      type: "virtual-pc",
      state: "stopped" as const,
      publicIP: "-",
      privateIP: "10.0.1.20",
      launchTime: "2024-01-10T14:20:00Z",
      ami: "ami-67890"
    },
    {
      id: "i-abcdef1234567890",
      name: "load-balancer",
      type: "virtual-pc",
      state: "running" as const,
      publicIP: "52.87.123.45",
      privateIP: "10.0.1.30",
      launchTime: "2024-01-12T09:15:00Z",
      ami: "ami-11111"
    }
  ]
};

// Add 29 more instances to match billing (total 32, but we show 29 virtual-pc + 3 others)
for (let i = 4; i <= 32; i++) {
  mockServerData.instances.push({
    id: `i-${Math.random().toString(36).substr(2, 9)}${Math.random().toString(36).substr(2, 8)}`,
    name: `virtual-pc-${i.toString().padStart(2, '0')}`,
    type: "virtual-pc",
    state: "running" as const,
    publicIP: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    privateIP: `10.0.1.${Math.floor(Math.random() * 255)}`,
    launchTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    ami: "ami-12345"
  });
}

export const mockBackend = {
  // Simulate fetching instances from server
  getInstances: async (): Promise<Instance[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockServerData.instances];
  },

  // Simulate saving instances to server
  saveInstances: async (instances: Instance[]): Promise<void> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    mockServerData.instances = [...instances];
    console.log('Instances saved to mock backend:', instances.length);
  },

  // Add new instance
  addInstance: async (instance: Instance): Promise<void> => {
    mockServerData.instances.push(instance);
    await mockBackend.saveInstances(mockServerData.instances);
  },

  // Update instance
  updateInstance: async (instanceId: string, updates: Partial<Instance>): Promise<void> => {
    const index = mockServerData.instances.findIndex(i => i.id === instanceId);
    if (index !== -1) {
      mockServerData.instances[index] = { ...mockServerData.instances[index], ...updates };
      await mockBackend.saveInstances(mockServerData.instances);
    }
  },

  // Delete instance
  deleteInstance: async (instanceId: string): Promise<void> => {
    mockServerData.instances = mockServerData.instances.filter(i => i.id !== instanceId);
    await mockBackend.saveInstances(mockServerData.instances);
  }
};


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Cloud, 
  Server, 
  Globe, 
  Download,
  Copy,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const DeploymentGuide = () => {
  const deploymentOptions = [
    {
      platform: "AWS S3 + CloudFront",
      difficulty: "Easy",
      cost: "$0.50-5/month",
      description: "Perfect for static React apps with global CDN",
      pros: ["Global CDN", "HTTPS included", "Automatic scaling", "Low cost"],
      cons: ["Static hosting only", "No server-side rendering"]
    },
    {
      platform: "Vercel",
      difficulty: "Very Easy", 
      cost: "Free-$20/month",
      description: "Zero-config deployment with Git integration",
      pros: ["Automatic deployments", "Built-in analytics", "Edge functions", "Free tier"],
      cons: ["Vendor lock-in", "Limited customization"]
    },
    {
      platform: "Netlify",
      difficulty: "Easy",
      cost: "Free-$19/month", 
      description: "JAMstack platform with continuous deployment",
      pros: ["Form handling", "Split testing", "Branch previews", "Free tier"],
      cons: ["Build time limits", "Bandwidth limits on free tier"]
    },
    {
      platform: "DigitalOcean Droplet",
      difficulty: "Medium",
      cost: "$4-20/month",
      description: "Full control with VPS hosting using Docker",
      pros: ["Full control", "Predictable pricing", "SSH access", "Scalable"],
      cons: ["Requires server management", "No automatic scaling"]
    }
  ];

  const awsSteps = [
    "npm run build",
    "aws s3 mb s3://your-app-bucket-name",
    "aws s3 sync dist/ s3://your-app-bucket-name --delete",
    "aws s3 website s3://your-app-bucket-name --index-document index.html",
    "aws cloudfront create-distribution --origin-domain-name your-app-bucket-name.s3.amazonaws.com"
  ];

  const dockerSteps = [
    "# Create Dockerfile",
    "FROM nginx:alpine",
    "COPY dist/ /usr/share/nginx/html/", 
    "EXPOSE 80",
    "CMD [\"nginx\", \"-g\", \"daemon off;\"]",
    "",
    "# Build and run",
    "docker build -t aws-console .",
    "docker run -p 80:80 aws-console"
  ];

  const nginxConfig = `server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json;
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Deployment Guide</h1>
        <p className="text-gray-600">Deploy your AWS Console to production</p>
      </div>

      {/* Deployment Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {deploymentOptions.map((option, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{option.platform}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </div>
                <div className="text-right">
                  <Badge variant={option.difficulty === "Very Easy" ? "default" : option.difficulty === "Easy" ? "secondary" : "outline"}>
                    {option.difficulty}
                  </Badge>
                  <p className="text-sm font-semibold mt-1">{option.cost}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-green-700 mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Pros
                  </h4>
                  <ul className="text-sm space-y-1">
                    {option.pros.map((pro, i) => (
                      <li key={i} className="flex items-center">
                        <span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-orange-700 mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Cons
                  </h4>
                  <ul className="text-sm space-y-1">
                    {option.cons.map((con, i) => (
                      <li key={i} className="flex items-center">
                        <span className="w-1 h-1 bg-orange-500 rounded-full mr-2"></span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Step-by-Step Deployment Instructions</CardTitle>
          <CardDescription>Choose your preferred deployment method</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="aws" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="aws">AWS S3</TabsTrigger>
              <TabsTrigger value="docker">Docker</TabsTrigger>
              <TabsTrigger value="nginx">Nginx</TabsTrigger>
              <TabsTrigger value="cicd">CI/CD</TabsTrigger>
            </TabsList>
            
            <TabsContent value="aws" className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <Cloud className="h-5 w-5 mr-2 text-[#FF9900]" />
                  Deploy to AWS S3 + CloudFront
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Deploy your React app to S3 with CloudFront for global distribution.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Prerequisites</h4>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• AWS CLI installed and configured</li>
                  <li>• AWS account with S3 and CloudFront permissions</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Commands</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                  {awsSteps.map((step, index) => (
                    <div key={index} className="mb-1">
                      <span className="text-gray-500"># Step {index + 1}</span>
                      <br />
                      <span>{step}</span>
                      <br />
                    </div>
                  ))}
                </div>
                <Button size="sm" variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Commands
                </Button>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Estimated Monthly Cost</h4>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm">
                    <strong>S3 Storage:</strong> $0.023/GB + $0.0004/1K requests<br />
                    <strong>CloudFront:</strong> $0.085/GB data transfer<br />
                    <strong>Total for typical app:</strong> $0.50-5.00/month
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="docker" className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <Server className="h-5 w-5 mr-2 text-blue-500" />
                  Deploy with Docker
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Containerize your app for easy deployment on any cloud platform.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Dockerfile</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm whitespace-pre-line">
                  {dockerSteps.join('\n')}
                </div>
                <Button size="sm" variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Dockerfile
                </Button>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Cloud Deployment Options</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Card>
                    <CardContent className="p-3">
                      <h5 className="font-medium">DigitalOcean</h5>
                      <p className="text-xs text-gray-600">$4/month Droplet</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Deploy
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <h5 className="font-medium">AWS ECS</h5>
                      <p className="text-xs text-gray-600">Container service</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Deploy
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <h5 className="font-medium">Google Cloud Run</h5>
                      <p className="text-xs text-gray-600">Serverless containers</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Deploy
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="nginx" className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-green-500" />
                  Deploy with Nginx
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Traditional web server deployment with Nginx.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Build and Upload</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                  npm run build<br />
                  scp -r dist/* user@your-server:/var/www/html/
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Nginx Configuration</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm whitespace-pre-line">
                  {nginxConfig}
                </div>
                <Button size="sm" variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Config
                </Button>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">SSL Setup</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                  # Install Certbot<br />
                  sudo apt install certbot python3-certbot-nginx<br />
                  <br />
                  # Get SSL certificate<br />
                  sudo certbot --nginx -d your-domain.com
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cicd" className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <Download className="h-5 w-5 mr-2 text-purple-500" />
                  CI/CD Pipeline
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Automate your deployment with GitHub Actions.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">GitHub Actions Workflow</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                  {`name: Deploy to AWS S3
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to S3
      env:
        AWS_ACCESS_KEY_ID: \${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
      run: |
        aws s3 sync dist/ s3://your-bucket --delete
        aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"`}
                </div>
                <Button size="sm" variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Workflow
                </Button>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Required Secrets</h4>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm">
                    Add these secrets to your GitHub repository settings:
                  </p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• <code>AWS_ACCESS_KEY_ID</code></li>
                    <li>• <code>AWS_SECRET_ACCESS_KEY</code></li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Performance Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Optimization</CardTitle>
          <CardDescription>Tips to improve your app's performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Build Optimizations</h4>
              <ul className="text-sm space-y-1">
                <li>• Enable gzip compression</li>
                <li>• Use CDN for static assets</li>
                <li>• Implement code splitting</li>
                <li>• Optimize images and fonts</li>
                <li>• Enable browser caching</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Monitoring</h4>
              <ul className="text-sm space-y-1">
                <li>• Set up CloudWatch alerts</li>
                <li>• Monitor Core Web Vitals</li>
                <li>• Track error rates</li>
                <li>• Monitor bandwidth usage</li>
                <li>• Set up uptime monitoring</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeploymentGuide;

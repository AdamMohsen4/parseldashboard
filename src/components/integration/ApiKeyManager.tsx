
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiKey } from "@/types/booking";
import { createApiKey, getUserApiKeys, deleteApiKey, toggleApiKeyStatus } from "@/services/apiKeyService";
import { useUser } from "@clerk/clerk-react";
import { toast } from "@/components/ui/use-toast";
import { Copy, Trash, PowerOff, Power } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const ApiKeyManager = () => {
  const { user, isSignedIn } = useUser();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [showNewKey, setShowNewKey] = useState<string | null>(null);

  // Load API keys when component mounts
  useEffect(() => {
    if (isSignedIn && user) {
      loadApiKeys();
    }
  }, [isSignedIn, user]);

  // Load API keys for the current user
  const loadApiKeys = async () => {
    if (!isSignedIn || !user) return;
    
    setIsLoading(true);
    const keys = await getUserApiKeys(user.id);
    setApiKeys(keys);
    setIsLoading(false);
  };

  // Handle creating a new API key
  const handleCreateApiKey = async () => {
    if (!isSignedIn || !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create API keys",
        variant: "destructive",
      });
      return;
    }

    if (!businessName.trim()) {
      toast({
        title: "Business Name Required",
        description: "Please provide a business name for this API key",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingKey(true);
    
    try {
      const newKey = await createApiKey(user.id, businessName);
      
      if (newKey) {
        setApiKeys([newKey, ...apiKeys]);
        setBusinessName("");
        setShowNewKey(newKey.apiKey);
        toast({
          title: "API Key Created",
          description: "Your new API key has been created successfully",
        });
      }
    } catch (error) {
      console.error("Error creating API key:", error);
      toast({
        title: "API Key Creation Failed",
        description: "There was an error creating your API key",
        variant: "destructive",
      });
    } finally {
      setIsCreatingKey(false);
    }
  };

  // Handle copying API key to clipboard
  const handleCopyApiKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "API Key Copied",
      description: "API key has been copied to clipboard",
    });
  };

  // Handle deleting an API key
  const handleDeleteApiKey = async (keyId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this API key? This action cannot be undone and will immediately revoke access for any integrations using this key.");
    
    if (confirmed) {
      const success = await deleteApiKey(keyId);
      
      if (success) {
        setApiKeys(apiKeys.filter(key => key.id !== keyId));
        toast({
          title: "API Key Deleted",
          description: "Your API key has been deleted successfully",
        });
      }
    }
  };

  // Handle toggling API key status
  const handleToggleStatus = async (keyId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const success = await toggleApiKeyStatus(keyId, newStatus);
    
    if (success) {
      setApiKeys(apiKeys.map(key => 
        key.id === keyId ? { ...key, isActive: newStatus } : key
      ));
      
      toast({
        title: newStatus ? "API Key Activated" : "API Key Deactivated",
        description: `API key has been ${newStatus ? "activated" : "deactivated"} successfully`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create API Key</CardTitle>
          <CardDescription>
            Generate a new API key for e-commerce integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input 
                id="businessName" 
                placeholder="Enter your business name" 
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                This name will be associated with the API key and will appear in your dashboard.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleCreateApiKey} 
            disabled={isCreatingKey || !businessName.trim()}
          >
            {isCreatingKey ? "Creating..." : "Generate API Key"}
          </Button>
        </CardFooter>
      </Card>

      {showNewKey && (
        <Card className="border-green-500">
          <CardHeader>
            <CardTitle className="text-green-600">New API Key Created</CardTitle>
            <CardDescription>
              Make sure to copy your API key now. For security reasons, you won't be able to see it again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-3 rounded-md flex items-center justify-between">
              <code className="text-sm font-mono break-all">{showNewKey}</code>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleCopyApiKey(showNewKey)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => setShowNewKey(null)}>Close</Button>
          </CardFooter>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>
            Manage API keys that allow e-commerce platforms to integrate with E-Parsel
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading API keys...</div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              You haven't created any API keys yet.
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div key={key.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{key.businessName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Created on {new Date(key.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={key.isActive ? "default" : "outline"}>
                      {key.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center mt-3 text-sm">
                    <span className="font-mono text-muted-foreground">
                      {key.apiKey.substring(0, 8)}••••••••••••••••
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleCopyApiKey(key.apiKey)}
                      className="ml-2 h-6 w-6"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  {key.lastUsedAt && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Last used: {new Date(key.lastUsedAt).toLocaleString()}
                    </p>
                  )}
                  <Separator className="my-3" />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={key.isActive}
                        onCheckedChange={() => handleToggleStatus(key.id, key.isActive)}
                        id={`status-${key.id}`}
                      />
                      <Label htmlFor={`status-${key.id}`} className="text-sm">
                        {key.isActive ? "Enabled" : "Disabled"}
                      </Label>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteApiKey(key.id)}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeyManager;


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@clerk/clerk-react";
import NavBar from "@/components/layout/NavBar";
import ApiKeyManager from "@/components/integration/ApiKeyManager";
import IntegrationGuide from "@/components/integration/IntegrationGuide";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";

const IntegrationPage = () => {
  const { isSignedIn, user } = useUser();
  const [activeTab, setActiveTab] = useState("api-keys");
  
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">E-Commerce Integration</h1>
            <p className="text-muted-foreground mt-2">
              Connect your e-commerce platform with E-Parsel shipping services
            </p>
          </div>
          
          {isSignedIn ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="api-keys">API Keys</TabsTrigger>
                  <TabsTrigger value="integration-guide">Integration Guide</TabsTrigger>
                </TabsList>
                <Button size="sm" asChild>
                  <a href="https://docs.e-parsel.com" target="_blank" rel="noopener noreferrer">
                    Full Documentation
                  </a>
                </Button>
              </div>
              
              <TabsContent value="api-keys" className="space-y-6">
                <div className="bg-muted p-4 rounded-lg text-sm">
                  <h3 className="font-medium">What are API Keys?</h3>
                  <p className="mt-1">
                    API keys are secure tokens that allow your e-commerce platform to authenticate 
                    with the E-Parsel API. Create an API key for each integration you need.
                  </p>
                </div>
                
                <ApiKeyManager />
              </TabsContent>
              
              <TabsContent value="integration-guide">
                <IntegrationGuide />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="bg-muted p-8 rounded-lg text-center">
              <h2 className="text-xl font-semibold">Sign In Required</h2>
              <p className="mt-2 mb-6 text-muted-foreground">
                Please sign in to access the E-Parsel API integration tools
              </p>
              <Button onClick={() => document.querySelector<HTMLButtonElement>("button.cl-userButtonTrigger")?.click()}>
                Sign In to Continue
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationPage;


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Code, Copy, Package } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { EcommerceIntegrationButton as ButtonConfig } from "@/types/threePL";

interface EcommerceIntegrationButtonProps {
  onCopy?: () => void;
}

const EcommerceIntegrationButton: React.FC<EcommerceIntegrationButtonProps> = ({ onCopy }) => {
  const [configuration, setConfiguration] = useState<ButtonConfig>({
    type: "button",
    variant: "dark",
    size: "medium",
    label: "Ship with E-Parsel",
    includeIcon: true
  });
  
  const [storeId, setStoreId] = useState<string>("");
  const [customization, setCustomization] = useState<string>("");
  
  const getButtonCode = (): string => {
    const baseUrl = "https://api.e-parsel.com/integrate";
    const iconCode = configuration.includeIcon 
      ? `<svg class="e-parsel-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 16V7.97a2 2 0 0 0-1.026-1.749L14.5 3.5 7.974 6.221A2 2 0 0 0 7 7.97V16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 9v7.5a2.5 2.5 0 0 0 2.5 2.5H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.5 3.5V11a1 1 0 0 0 1 1h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>` 
      : '';
    
    const sizeCss = {
      small: 'height: 32px; padding: 0 12px; font-size: 14px;',
      medium: 'height: 40px; padding: 0 16px; font-size: 16px;',
      large: 'height: 48px; padding: 0 20px; font-size: 18px;'
    };
    
    const variantCss = {
      dark: 'background-color: #111827; color: white; border: 1px solid #374151;',
      light: 'background-color: white; color: #111827; border: 1px solid #d1d5db;'
    };
    
    let code = '';
    
    if (configuration.type === 'button') {
      code = `<button 
  class="e-parsel-ship-button" 
  data-store-id="${storeId}"
  style="
    ${sizeCss[configuration.size || 'medium']}
    ${variantCss[configuration.variant || 'dark']}
    font-family: system-ui, -apple-system, sans-serif;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
  "
  onclick="window.EParsel.createShipment(this);"
>
  ${iconCode}
  ${configuration.label || 'Ship with E-Parsel'}
</button>`;
    } else if (configuration.type === 'link') {
      code = `<a 
  href="${baseUrl}?storeId=${storeId}"
  class="e-parsel-ship-link" 
  data-store-id="${storeId}"
  style="
    ${sizeCss[configuration.size || 'medium']}
    ${variantCss[configuration.variant || 'dark']}
    font-family: system-ui, -apple-system, sans-serif;
    border-radius: 6px;
    font-weight: 500;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
  "
>
  ${iconCode}
  ${configuration.label || 'Ship with E-Parsel'}
</a>`;
    } else if (configuration.type === 'script') {
      code = `<script>
  (function() {
    var script = document.createElement('script');
    script.src = "https://cdn.e-parsel.com/integration.js";
    script.async = true;
    script.dataset.storeId = "${storeId}";
    document.head.appendChild(script);
  })();
</script>`;
    }
    
    // Add custom CSS if provided
    if (customization && (configuration.type === 'button' || configuration.type === 'link')) {
      code = code.replace('</button>', `  style="${customization}"\n</button>`);
      code = code.replace('</a>', `  style="${customization}"\n</a>`);
    }
    
    return code;
  };
  
  const getIntegrationScript = (): string => {
    return `<!-- Copy this script tag at the end of your webpage before the closing </body> tag -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = "https://cdn.e-parsel.com/integration.js";
    script.async = true;
    script.dataset.storeId = "${storeId || 'YOUR_STORE_ID'}";
    document.head.appendChild(script);
    
    // Initialize E-Parsel when script loads
    script.onload = function() {
      window.EParsel.init({
        buttonType: "${configuration.type}",
        buttonVariant: "${configuration.variant}",
        buttonSize: "${configuration.size}",
        buttonLabel: "${configuration.label}",
        includeIcon: ${configuration.includeIcon}
      });
    };
  })();
</script>`;
  };
  
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      description: "Integration code has been copied to your clipboard",
    });
    
    if (onCopy) {
      onCopy();
    }
  };
  
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="visual">Visual Editor</TabsTrigger>
            <TabsTrigger value="code">Get Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visual" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="storeId">Your Store ID</Label>
                <Input
                  id="storeId"
                  placeholder="Enter your store identifier"
                  value={storeId}
                  onChange={(e) => setStoreId(e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  This will be provided in your E-Parsel dashboard
                </p>
              </div>
              
              <div>
                <Label>Button Type</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <Button
                    variant={configuration.type === "button" ? "default" : "outline"}
                    onClick={() => setConfiguration({ ...configuration, type: "button" })}
                    size="sm"
                  >
                    Button
                  </Button>
                  <Button
                    variant={configuration.type === "link" ? "default" : "outline"}
                    onClick={() => setConfiguration({ ...configuration, type: "link" })}
                    size="sm"
                  >
                    Link
                  </Button>
                  <Button
                    variant={configuration.type === "script" ? "default" : "outline"}
                    onClick={() => setConfiguration({ ...configuration, type: "script" })}
                    size="sm"
                  >
                    Script
                  </Button>
                </div>
              </div>
              
              {(configuration.type === "button" || configuration.type === "link") && (
                <>
                  <div>
                    <Label>Button Variant</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <Button
                        variant={configuration.variant === "dark" ? "default" : "outline"}
                        onClick={() => setConfiguration({ ...configuration, variant: "dark" })}
                        size="sm"
                      >
                        Dark
                      </Button>
                      <Button
                        variant={configuration.variant === "light" ? "default" : "outline"}
                        onClick={() => setConfiguration({ ...configuration, variant: "light" })}
                        size="sm"
                        className="bg-white text-black border border-gray-200 hover:bg-gray-100 hover:text-black"
                      >
                        Light
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Button Size</Label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <Button
                        variant={configuration.size === "small" ? "default" : "outline"}
                        onClick={() => setConfiguration({ ...configuration, size: "small" })}
                        size="sm"
                      >
                        Small
                      </Button>
                      <Button
                        variant={configuration.size === "medium" ? "default" : "outline"}
                        onClick={() => setConfiguration({ ...configuration, size: "medium" })}
                        size="sm"
                      >
                        Medium
                      </Button>
                      <Button
                        variant={configuration.size === "large" ? "default" : "outline"}
                        onClick={() => setConfiguration({ ...configuration, size: "large" })}
                        size="sm"
                      >
                        Large
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="label">Button Label</Label>
                    <Input
                      id="label"
                      value={configuration.label || ""}
                      onChange={(e) => setConfiguration({ ...configuration, label: e.target.value })}
                      placeholder="Ship with E-Parsel"
                    />
                  </div>
                </>
              )}
              
              <div className="pt-4 flex justify-center">
                <div className="border p-8 rounded-lg flex items-center justify-center bg-gray-50">
                  {configuration.type === "button" && (
                    <button 
                      className={`
                        inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors
                        ${configuration.variant === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900 border border-gray-200"}
                        ${configuration.size === "small" ? "h-8 px-3 text-xs" : configuration.size === "large" ? "h-12 px-6 text-base" : "h-10 px-4 text-sm"}
                      `}
                    >
                      {configuration.includeIcon && <Package className="h-4 w-4" />}
                      {configuration.label || "Ship with E-Parsel"}
                    </button>
                  )}
                  
                  {configuration.type === "link" && (
                    <a 
                      href="#"
                      className={`
                        inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors
                        ${configuration.variant === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900 border border-gray-200"}
                        ${configuration.size === "small" ? "h-8 px-3 text-xs" : configuration.size === "large" ? "h-12 px-6 text-base" : "h-10 px-4 text-sm"}
                      `}
                    >
                      {configuration.includeIcon && <Package className="h-4 w-4" />}
                      {configuration.label || "Ship with E-Parsel"}
                    </a>
                  )}
                  
                  {configuration.type === "script" && (
                    <div className="text-center">
                      <Code className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Script will be added to your site</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="code" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="buttonCode">Integration Button Code</Label>
                <div className="relative mt-1">
                  <Textarea
                    id="buttonCode"
                    value={getButtonCode()}
                    className="min-h-[150px] font-mono text-sm"
                    readOnly
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopyCode(getButtonCode())}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Place this code where you want the button to appear on your checkout page.
                </p>
              </div>
              
              <div>
                <Label htmlFor="scriptCode">Full Integration Script</Label>
                <div className="relative mt-1">
                  <Textarea
                    id="scriptCode"
                    value={getIntegrationScript()}
                    className="min-h-[200px] font-mono text-sm"
                    readOnly
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopyCode(getIntegrationScript())}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Add this script to your website to enable the integration. Place it before the closing &lt;/body&gt; tag.
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-md text-sm">
                <h4 className="font-medium text-blue-700 mb-2">Next Steps</h4>
                <ol className="list-decimal list-inside space-y-1 text-blue-700">
                  <li>Copy the integration script to your website</li>
                  <li>Add the button code to your checkout page</li>
                  <li>Test the integration by clicking the button</li>
                  <li>Monitor shipments in your E-Parsel dashboard</li>
                </ol>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EcommerceIntegrationButton;

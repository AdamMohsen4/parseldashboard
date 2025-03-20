
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/ui/code-block";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const IntegrationGuide = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>E-Commerce Integration Guide</CardTitle>
        <CardDescription>
          Learn how to integrate E-Parsel shipping in your e-commerce platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="javascript">
          <TabsList className="mb-4">
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="php">PHP</TabsTrigger>
            <TabsTrigger value="html">HTML Button</TabsTrigger>
          </TabsList>
          
          <TabsContent value="javascript">
            <div className="space-y-4">
              <p className="text-sm">
                Include this JavaScript code in your checkout or order fulfillment page to create shipments with E-Parsel:
              </p>
              
              <CodeBlock
                language="javascript"
                code={`// Initialize E-Parsel API
const eparsel = {
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'https://api.e-parsel.com',
  
  // Create a new shipment
  createShipment: async function(orderData) {
    try {
      const response = await fetch(\`\${this.baseUrl}/shipments\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${this.apiKey}\`
        },
        body: JSON.stringify({
          apiKey: this.apiKey,
          orderNumber: orderData.orderNumber,
          weight: orderData.weight,
          dimensions: orderData.dimensions,
          pickup: orderData.pickup,
          delivery: orderData.delivery,
          customerEmail: orderData.customerEmail,
          customerName: orderData.customerName,
          includeCompliance: orderData.includeCompliance || false
        })
      });
      
      return await response.json();
    } catch (error) {
      console.error('E-Parsel API Error:', error);
      return { success: false, message: 'API connection failed' };
    }
  }
};

// Example usage
document.getElementById('ship-with-eparsel').addEventListener('click', async () => {
  const result = await eparsel.createShipment({
    orderNumber: '12345',
    weight: '2.5',
    dimensions: { length: '30', width: '20', height: '10' },
    pickup: 'Your Warehouse Address, City, Country',
    delivery: 'Customer Address, City, Country',
    customerEmail: 'customer@example.com',
    customerName: 'John Doe'
  });
  
  if (result.success) {
    console.log('Shipment created with tracking code:', result.trackingCode);
    // Update your order with shipping information
  } else {
    console.error('Failed to create shipment:', result.message);
  }
});`}
              />
              
              <div className="bg-muted p-4 rounded-md mt-4">
                <h4 className="text-sm font-medium mb-2">Implementation Notes:</h4>
                <ul className="text-sm space-y-1 list-disc pl-4">
                  <li>Replace 'YOUR_API_KEY' with the API key generated in your E-Parsel dashboard</li>
                  <li>Customize the pickup address to match your warehouse location</li>
                  <li>All weight values should be in kg and dimensions in cm</li>
                  <li>The API response includes tracking information you can store with the order</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="php">
            <div className="space-y-4">
              <p className="text-sm">
                PHP implementation for WooCommerce, Magento, or custom PHP e-commerce platforms:
              </p>
              
              <CodeBlock
                language="php"
                code={`<?php
/**
 * E-Parsel Shipping Integration for PHP
 */
class EParselShipping {
    private $apiKey;
    private $baseUrl = 'https://api.e-parsel.com';
    
    public function __construct($apiKey) {
        $this->apiKey = $apiKey;
    }
    
    /**
     * Create a new shipment with E-Parsel
     * 
     * @param array $orderData Order details
     * @return array API response
     */
    public function createShipment($orderData) {
        $endpoint = $this->baseUrl . '/shipments';
        
        $payload = [
            'apiKey' => $this->apiKey,
            'orderNumber' => $orderData['orderNumber'],
            'weight' => $orderData['weight'],
            'dimensions' => $orderData['dimensions'],
            'pickup' => $orderData['pickup'],
            'delivery' => $orderData['delivery'],
            'customerEmail' => $orderData['customerEmail'] ?? null,
            'customerName' => $orderData['customerName'] ?? null,
            'includeCompliance' => $orderData['includeCompliance'] ?? false
        ];
        
        $ch = curl_init($endpoint);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $this->apiKey
        ]);
        
        $response = curl_exec($ch);
        $error = curl_error($ch);
        curl_close($ch);
        
        if ($error) {
            return [
                'success' => false,
                'message' => 'API connection failed: ' . $error
            ];
        }
        
        return json_decode($response, true);
    }
}

// Example usage
$eparsel = new EParselShipping('YOUR_API_KEY');

$result = $eparsel->createShipment([
    'orderNumber' => '12345',
    'weight' => '2.5',
    'dimensions' => [
        'length' => '30',
        'width' => '20',
        'height' => '10'
    ],
    'pickup' => 'Your Warehouse Address, City, Country',
    'delivery' => 'Customer Address, City, Country',
    'customerEmail' => 'customer@example.com',
    'customerName' => 'John Doe'
]);

if ($result['success']) {
    echo "Shipment created with tracking code: " . $result['trackingCode'];
    // Update your order with shipping information
} else {
    echo "Failed to create shipment: " . $result['message'];
}
?>`}
              />
              
              <div className="bg-muted p-4 rounded-md mt-4">
                <h4 className="text-sm font-medium mb-2">WooCommerce Integration:</h4>
                <p className="text-sm mb-2">
                  For WooCommerce, add this code to your theme's functions.php or create a custom plugin:
                </p>
                <CodeBlock
                  language="php"
                  code={`// Hook into WooCommerce order processing
add_action('woocommerce_order_status_processing', 'create_eparsel_shipment');

function create_eparsel_shipment($order_id) {
    $order = wc_get_order($order_id);
    $shipping_address = $order->get_address('shipping');
    
    // Initialize E-Parsel API
    $eparsel = new EParselShipping('YOUR_API_KEY');
    
    // Create delivery address string
    $delivery = $shipping_address['first_name'] . ' ' . $shipping_address['last_name'] . ', ' .
               $shipping_address['address_1'] . ', ' .
               (isset($shipping_address['address_2']) && !empty($shipping_address['address_2']) ? $shipping_address['address_2'] . ', ' : '') .
               $shipping_address['city'] . ', ' .
               $shipping_address['state'] . ', ' .
               $shipping_address['postcode'] . ', ' .
               $shipping_address['country'];
    
    // Get order weight (assumes you've set product weights)
    $weight = $order->get_meta('_cart_weight', true);
    if (!$weight) $weight = '1.0'; // Default weight if not set
    
    $result = $eparsel->createShipment([
        'orderNumber' => $order->get_order_number(),
        'weight' => $weight,
        'dimensions' => [
            'length' => '30',
            'width' => '20',
            'height' => '10'
        ],
        'pickup' => 'YOUR_WAREHOUSE_ADDRESS', // Set your warehouse address
        'delivery' => $delivery,
        'customerEmail' => $order->get_billing_email(),
        'customerName' => $shipping_address['first_name'] . ' ' . $shipping_address['last_name']
    ]);
    
    if ($result['success']) {
        // Save tracking details to order
        $order->update_meta_data('_eparsel_tracking_code', $result['trackingCode']);
        $order->update_meta_data('_eparsel_label_url', $result['labelUrl']);
        $order->update_meta_data('_eparsel_estimated_delivery', $result['estimatedDelivery']);
        $order->save();
        
        // Add private note
        $order->add_order_note('E-Parsel shipment created. Tracking code: ' . $result['trackingCode']);
    } else {
        $order->add_order_note('E-Parsel shipment creation failed: ' . $result['message']);
    }
}`}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="html">
            <div className="space-y-4">
              <p className="text-sm">
                Add a "Ship with E-Parsel" button to your e-commerce platform using HTML and CSS:
              </p>
              
              <CodeBlock
                language="html"
                code={`<!-- E-Parsel Shipping Button - Include in your checkout or order page -->
<button id="ship-with-eparsel" class="eparsel-button">
  <svg class="eparsel-icon" viewBox="0 0 24 24" width="16" height="16">
    <path fill="currentColor" d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L5,8.09V15.91L12,19.85L19,15.91V8.09L12,4.15Z" />
  </svg>
  Ship with E-Parsel
</button>

<style>
  .eparsel-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background-color: #0055FF;
    color: white;
    font-weight: 500;
    padding: 10px 16px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .eparsel-button:hover {
    background-color: #0044CC;
  }
  
  .eparsel-icon {
    flex-shrink: 0;
  }
  
  /* Optional: Animation for the button */
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .eparsel-button:active {
    animation: pulse 0.3s;
  }
</style>

<!-- Include the E-Parsel JavaScript code from the JavaScript tab -->
<script>
  // JavaScript code for the button functionality (see JavaScript tab)
</script>`}
              />
              
              <div className="bg-muted p-4 rounded-md mt-4">
                <h4 className="text-sm font-medium mb-2">Integration Options:</h4>
                <ul className="text-sm space-y-1 list-disc pl-4">
                  <li>Add this button to your order fulfillment page for manual shipping creation</li>
                  <li>Customize the button colors to match your website's theme</li>
                  <li>For automatic shipping, combine with the JavaScript or PHP implementation</li>
                  <li>Consider adding the button to your orders list for batch processing</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex flex-col space-y-4">
          <h3 className="text-lg font-medium">Useful Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                API Documentation <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                Integration Examples <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                WooCommerce Plugin <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                Shopify App <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationGuide;

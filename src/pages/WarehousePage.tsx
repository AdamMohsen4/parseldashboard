
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Warehouse, Filter, Search, Euro, CalendarRange, Building2, MapPin } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useTranslation } from "react-i18next";

// Mock warehouse data
const mockWarehouses = [
  {
    id: 1,
    name: "Central Stockholm Storage",
    location: "Stockholm, Sweden",
    pricePerMonth: 199,
    spaceAvailable: "25m²",
    features: ["Climate controlled", "24/7 Access", "Security"],
    imageUrl: "/uploads/warehouse-1.jpg"
  },
  {
    id: 2,
    name: "Hamburg Port Facility",
    location: "Hamburg, Germany",
    pricePerMonth: 299,
    spaceAvailable: "50m²",
    features: ["Loading dock", "Forklift available", "Maritime access"],
    imageUrl: "/uploads/warehouse-2.jpg"
  },
  {
    id: 3,
    name: "Madrid Distribution Center",
    location: "Madrid, Spain",
    pricePerMonth: 159,
    spaceAvailable: "15m²",
    features: ["Shelving included", "Urban location", "Month-to-month"],
    imageUrl: "/uploads/warehouse-3.jpg"
  },
  {
    id: 4,
    name: "Warsaw Logistics Hub",
    location: "Warsaw, Poland",
    pricePerMonth: 249,
    spaceAvailable: "40m²",
    features: ["Truck access", "Shared office space", "Palletizing area"],
    imageUrl: "/uploads/7326fca2-a314-40a0-8acb-41c65a241827.jpg"
  },
  {
    id: 5,
    name: "Helsinki Cold Storage",
    location: "Helsinki, Finland",
    pricePerMonth: 349,
    spaceAvailable: "30m²",
    features: ["Refrigerated", "Freezer space", "Inventory management"],
    imageUrl: "/uploads/40bf477a-ad0b-486e-9a0d-83c1aff0401a.png"
  }
];

const WarehousePage = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredWarehouses, setFilteredWarehouses] = useState(mockWarehouses);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilteredWarehouses(
      mockWarehouses.filter(
        warehouse => 
          warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          warehouse.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const handleReset = () => {
    setSearchQuery("");
    setFilteredWarehouses(mockWarehouses);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Warehouse className="h-8 w-8 mr-2 text-primary" />
          <h1 className="text-3xl font-bold">{t('warehouse.title', 'Warehouse Marketplace')}</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <p className="text-lg text-muted-foreground mb-4">
              {t('warehouse.description', 'Find and rent warehouse space for your business. Storage solutions for SMEs, 3PL providers, and more.')}
            </p>
          </div>
          <div className="lg:col-span-1">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input 
                placeholder={t('warehouse.searchPlaceholder', 'Search by name or location')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
              {searchQuery && (
                <Button type="button" variant="ghost" onClick={handleReset}>
                  {t('warehouse.reset', 'Reset')}
                </Button>
              )}
            </form>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Panel */}
          <div className="lg:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  {t('warehouse.filters', 'Filters')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('warehouse.priceRange', 'Price Range (€/month)')}
                  </label>
                  <div className="flex items-center gap-2">
                    <Input placeholder="Min" type="number" className="w-full" />
                    <span>-</span>
                    <Input placeholder="Max" type="number" className="w-full" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('warehouse.spaceSize', 'Space Size (m²)')}
                  </label>
                  <div className="flex items-center gap-2">
                    <Input placeholder="Min" type="number" className="w-full" />
                    <span>-</span>
                    <Input placeholder="Max" type="number" className="w-full" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('warehouse.features', 'Features')}
                  </label>
                  <div className="space-y-2">
                    {['Climate controlled', 'Loading dock', '24/7 Access', 'Security'].map(feature => (
                      <div key={feature} className="flex items-center">
                        <input type="checkbox" id={feature} className="mr-2" />
                        <label htmlFor={feature} className="text-sm">{feature}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full">
                  {t('warehouse.applyFilters', 'Apply Filters')}
                </Button>
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {t('warehouse.listSpace', 'List Your Space')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('warehouse.listSpaceDescription', 'Own warehouse space? List it on our marketplace and connect with businesses looking for storage solutions.')}
                </p>
                <Button className="w-full">
                  {t('warehouse.listNow', 'List Your Warehouse')}
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Warehouse Listings */}
          <div className="lg:w-3/4">
            {filteredWarehouses.length === 0 ? (
              <Card className="p-8 text-center">
                <p>{t('warehouse.noResults', 'No warehouses found matching your search.')}</p>
                <Button variant="outline" onClick={handleReset} className="mt-4">
                  {t('warehouse.viewAll', 'View All Warehouses')}
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredWarehouses.map(warehouse => (
                  <Card key={warehouse.id} className="overflow-hidden h-full flex flex-col">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={warehouse.imageUrl} 
                        alt={warehouse.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{warehouse.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" /> {warehouse.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center gap-1">
                          <Euro className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-green-600">{warehouse.pricePerMonth}</span>
                          <span className="text-sm text-muted-foreground">/month</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarRange className="h-4 w-4" />
                          <span className="text-sm">{warehouse.spaceAvailable}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {warehouse.features.map(feature => (
                          <span 
                            key={feature} 
                            className="text-xs bg-secondary/30 text-secondary-foreground px-2 py-1 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button className="w-full">
                        {t('warehouse.rentNow', 'Rent Now')}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WarehousePage;

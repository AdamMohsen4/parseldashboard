
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Building, MapPin, Package, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Collaboration } from "./types";

interface CollaborationListProps {
  collaborations: Collaboration[];
}

const CollaborationList = ({ collaborations }: CollaborationListProps) => {
  const { t } = useTranslation();
  const [contactVisibility, setContactVisibility] = useState<{[key: string]: boolean}>({});

  const toggleContact = (id: string) => {
    setContactVisibility(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (collaborations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          {t('collaborate.noResults', 'No collaboration opportunities found matching your criteria.')}
        </p>
        <p className="mt-2">
          {t('collaborate.tryAgain', 'Try adjusting your search or create your own listing above.')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collaborations.map((collab) => (
        <Card key={collab.id} className="group hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl flex items-center gap-1.5">
                <Building className="h-5 w-5 text-primary" />
                {collab.businessName}
              </CardTitle>
              <Badge variant="outline" className="bg-primary/10">
                {collab.frequency}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{t('collaborate.destination', 'Destination')}: <span className="font-medium text-foreground">{collab.destination}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="h-4 w-4 text-primary" />
                <span>{t('collaborate.volume', 'Volume')}: <span className="font-medium text-foreground">{collab.volume}</span></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{t('collaborate.nextDate', 'Next shipment')}: <span className="font-medium text-foreground">{collab.nextShipmentDate}</span></span>
              </div>
              {collab.notes && (
                <p className="text-sm mt-2 text-muted-foreground">{collab.notes}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 pt-0">
            {contactVisibility[collab.id] ? (
              <div className="w-full space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>{collab.contactEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span>{collab.contactPhone}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => toggleContact(collab.id)}
                >
                  {t('collaborate.hideContact', 'Hide Contact Info')}
                </Button>
              </div>
            ) : (
              <Button 
                className="w-full group-hover:bg-primary"
                onClick={() => toggleContact(collab.id)}
              >
                <Mail className="mr-2 h-4 w-4" />
                {t('collaborate.contactBusiness', 'Contact Business')}
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CollaborationList;

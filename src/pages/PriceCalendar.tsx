import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import NavBar from "@/components/layout/NavBar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { useState } from "react";

// This is the price calendar component that will be used to display days with higher or lower shipping fees based on the amount of orders
const PriceCalendar = () => {
    const { t } = useTranslation();
    
}
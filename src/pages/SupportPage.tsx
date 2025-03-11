
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "@clerk/clerk-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import NavBar from "@/components/layout/NavBar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define schema for support request form
const formSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
  category: z.string(),
  priority: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

// Define support ticket interface to match our Supabase table
interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
}

const SupportPage = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [ticketsLoaded, setTicketsLoaded] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      message: "",
      category: "general",
      priority: "medium",
    },
  });

  // Load user tickets
  const loadTickets = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setTickets(data || []);
      setTicketsLoaded(true);
    } catch (error) {
      console.error("Error loading tickets:", error);
      toast({
        title: "Error",
        description: "Failed to load support tickets",
        variant: "destructive",
      });
    }
  };

  // Load tickets on component mount if not already loaded
  if (user && !ticketsLoaded && !loading) {
    setLoading(true);
    loadTickets().finally(() => setLoading(false));
  }

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    if (!user) return;

    setLoading(true);
    try {
      const newTicket = {
        user_id: user.id,
        subject: data.subject,
        message: data.message,
        category: data.category,
        priority: data.priority,
        status: "open",
      };

      const { error } = await supabase
        .from("support_tickets")
        .insert(newTicket);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your support request has been submitted",
      });
      
      reset();
      loadTickets();
    } catch (error) {
      console.error("Error submitting support request:", error);
      toast({
        title: "Error",
        description: "Failed to submit support request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t('support.title', 'Customer Support')}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submit support request form */}
          <div>
            <h2 className="text-xl font-semibold mb-4">{t('support.newRequest', 'Submit a Support Request')}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="category">{t('support.category', 'Category')}</Label>
                <Select defaultValue="general" {...register("category")}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('support.selectCategory', 'Select category')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">{t('support.categories.general', 'General Inquiry')}</SelectItem>
                    <SelectItem value="shipping">{t('support.categories.shipping', 'Shipping Issue')}</SelectItem>
                    <SelectItem value="billing">{t('support.categories.billing', 'Billing')}</SelectItem>
                    <SelectItem value="technical">{t('support.categories.technical', 'Technical Support')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="priority">{t('support.priority', 'Priority')}</Label>
                <Select defaultValue="medium" {...register("priority")}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('support.selectPriority', 'Select priority')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t('support.priorities.low', 'Low')}</SelectItem>
                    <SelectItem value="medium">{t('support.priorities.medium', 'Medium')}</SelectItem>
                    <SelectItem value="high">{t('support.priorities.high', 'High')}</SelectItem>
                    <SelectItem value="urgent">{t('support.priorities.urgent', 'Urgent')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="subject">{t('support.subject', 'Subject')}</Label>
                <Input
                  id="subject"
                  {...register("subject")}
                  placeholder={t('support.subjectPlaceholder', 'Brief description of your issue')}
                />
                {errors.subject && (
                  <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="message">{t('support.message', 'Message')}</Label>
                <Textarea
                  id="message"
                  {...register("message")}
                  rows={5}
                  placeholder={t('support.messagePlaceholder', 'Please describe your issue in detail')}
                />
                {errors.message && (
                  <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
                )}
              </div>
              
              <Button type="submit" disabled={loading}>
                {loading ? t('common.submitting', 'Submitting...') : t('support.submit', 'Submit Request')}
              </Button>
            </form>
          </div>
          
          {/* Support tickets history */}
          <div>
            <h2 className="text-xl font-semibold mb-4">{t('support.history', 'Your Support Tickets')}</h2>
            
            {loading && !ticketsLoaded ? (
              <p>{t('common.loading', 'Loading...')}</p>
            ) : tickets.length > 0 ? (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <Card key={ticket.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{ticket.subject}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t(`support.categories.${ticket.category}`, ticket.category)} • {t(`support.priorities.${ticket.priority}`, ticket.priority)}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ticket.status === 'open' ? 'bg-blue-100 text-blue-800' :
                        ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {t(`support.status.${ticket.status}`, ticket.status === 'in_progress' ? 'In Progress' : 
                          ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1))}
                      </div>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <p className="text-sm line-clamp-3">{ticket.message}</p>
                    
                    <p className="text-xs text-muted-foreground mt-3">
                      {t('support.created', 'Created')}: {new Date(ticket.created_at).toLocaleString()}
                    </p>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">{t('support.noTickets', 'You have no support tickets yet.')}</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupportPage;

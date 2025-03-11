
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "@clerk/clerk-react";
import { useForm, Controller } from "react-hook-form";
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
import { Send } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

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

// Define support message interface
interface SupportMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  created_at: string;
  is_admin: boolean;
}

const SupportPage = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [ticketsLoaded, setTicketsLoaded] = useState(false);
  
  // New state for ticket dialog
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [ticketMessages, setTicketMessages] = useState<SupportMessage[]>([]);
  const [newReply, setNewReply] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const { control, register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
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
  useEffect(() => {
    if (user && !ticketsLoaded && !loading) {
      setLoading(true);
      loadTickets().finally(() => setLoading(false));
    }
  }, [user, ticketsLoaded]);

  // Load messages for a specific ticket
  const loadTicketMessages = async (ticketId: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("support_messages")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      setTicketMessages(data || []);
    } catch (error) {
      console.error("Error loading ticket messages:", error);
      toast({
        title: "Error",
        description: "Failed to load message history",
        variant: "destructive",
      });
    }
  };

  // Open ticket dialog and load messages
  const openTicketDetails = async (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setTicketDialogOpen(true);
    await loadTicketMessages(ticket.id);
  };

  // Send a reply to a support ticket
  const handleSendReply = async () => {
    if (!newReply.trim() || !selectedTicket || !user) return;
    
    setSendingReply(true);
    try {
      const messageData = {
        ticket_id: selectedTicket.id,
        user_id: user.id,
        message: newReply.trim(),
        is_admin: false
      };

      const { error } = await supabase
        .from("support_messages")
        .insert(messageData);
      
      if (error) throw error;
      
      // Clear the message input
      setNewReply("");
      
      // Reload messages
      await loadTicketMessages(selectedTicket.id);
      
      toast({
        title: "Reply Sent",
        description: "Your message has been sent to support.",
      });
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({
        title: "Error",
        description: "Failed to send your reply",
        variant: "destructive",
      });
    } finally {
      setSendingReply(false);
    }
  };

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

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Get status color class
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder={t('support.selectCategory', 'Select category')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">{t('support.categories.general', 'General Inquiry')}</SelectItem>
                        <SelectItem value="shipping">{t('support.categories.shipping', 'Shipping Issue')}</SelectItem>
                        <SelectItem value="billing">{t('support.categories.billing', 'Billing')}</SelectItem>
                        <SelectItem value="technical">{t('support.categories.technical', 'Technical Support')}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              
              <div>
                <Label htmlFor="priority">{t('support.priority', 'Priority')}</Label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder={t('support.selectPriority', 'Select priority')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">{t('support.priorities.low', 'Low')}</SelectItem>
                        <SelectItem value="medium">{t('support.priorities.medium', 'Medium')}</SelectItem>
                        <SelectItem value="high">{t('support.priorities.high', 'High')}</SelectItem>
                        <SelectItem value="urgent">{t('support.priorities.urgent', 'Urgent')}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
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
                  <Card key={ticket.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => openTicketDetails(ticket)}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{ticket.subject}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t(`support.categories.${ticket.category}`, ticket.category)} • {t(`support.priorities.${ticket.priority}`, ticket.priority)}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {t(`support.status.${ticket.status}`, ticket.status === 'in_progress' ? 'In Progress' : 
                          ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1))}
                      </div>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <p className="text-sm line-clamp-3">{ticket.message}</p>
                    
                    <div className="flex justify-between items-center mt-3">
                      <p className="text-xs text-muted-foreground">
                        {t('support.created', 'Created')}: {new Date(ticket.created_at).toLocaleString()}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          openTicketDetails(ticket);
                        }}
                      >
                        {t('support.viewDetails', 'View Details')}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">{t('support.noTickets', 'You have no support tickets yet.')}</p>
            )}
          </div>
        </div>
      </main>

      {/* Ticket Details Dialog */}
      <Dialog open={ticketDialogOpen} onOpenChange={setTicketDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTicket.subject}</DialogTitle>
                <DialogDescription className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status === 'in_progress' ? 'In Progress' : 
                        selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {t(`support.priorities.${selectedTicket.priority}`, selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1))}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(selectedTicket.created_at)}
                  </span>
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium">{t('support.category', 'Category')}</h4>
                  <p className="text-sm mt-1">
                    {t(`support.categories.${selectedTicket.category}`, selectedTicket.category.charAt(0).toUpperCase() + selectedTicket.category.slice(1))}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">{t('support.originalMessage', 'Original Message')}</h4>
                  <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                    <p className="whitespace-pre-wrap">{selectedTicket.message}</p>
                  </div>
                </div>
                
                {/* Conversation Thread */}
                {ticketMessages.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium">{t('support.messageHistory', 'Message History')}</h4>
                    <div className="space-y-3 mt-2 max-h-[200px] overflow-y-auto">
                      {ticketMessages.map((msg) => (
                        <div 
                          key={msg.id} 
                          className={`p-3 rounded-md text-sm ${
                            msg.is_admin 
                              ? "bg-primary/10 ml-8" 
                              : "bg-muted mr-8"
                          }`}
                        >
                          <div className="flex justify-between mb-1">
                            <span className="font-semibold">
                              {msg.is_admin 
                                ? t('support.agent', 'Support Agent') 
                                : t('support.you', 'You')}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(msg.created_at)}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Reply Form - Only show for open or in-progress tickets */}
                {['open', 'in_progress'].includes(selectedTicket.status) && (
                  <div>
                    <h4 className="text-sm font-medium">{t('support.replyToSupport', 'Reply to Support')}</h4>
                    <div className="mt-1">
                      <Textarea
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        placeholder={t('support.replyPlaceholder', 'Type your reply here...')}
                        rows={3}
                      />
                      <div className="flex justify-end mt-2">
                        <Button
                          onClick={handleSendReply}
                          disabled={!newReply.trim() || sendingReply}
                          className="flex items-center"
                        >
                          {sendingReply 
                            ? t('common.sending', 'Sending...') 
                            : t('support.sendReply', 'Send Reply')}
                          <Send className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Show message for resolved/closed tickets */}
                {['resolved', 'closed'].includes(selectedTicket.status) && (
                  <div className="p-3 bg-gray-100 rounded-md text-sm">
                    <p>
                      {t('support.ticketClosed', 'This ticket is now closed. If you need further assistance, please submit a new request.')}
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end pt-4">
                  <DialogClose asChild>
                    <Button variant="outline">
                      {t('common.close', 'Close')}
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupportPage;

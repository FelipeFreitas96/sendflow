export interface Message {
  id: string;
  clientId: string;
  connectionId: string;
  contactIds: string[];
  content: string;
  status: 'scheduled' | 'sent';
  scheduledAt: any | null;
  sentAt: any | null;
  createdAt: any;
}

export interface TicketBatch {
  id: string;
  event_id: string;
  price: number;
  total_tickets: number;
  available_tickets: number;
  batch_number: number;
  is_active: boolean;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  user_id: string;
  created_at: string;
  location_coordinates: any;
  location_link: string | null;
  is_paid: boolean;
}
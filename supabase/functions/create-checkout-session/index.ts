import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { eventId, batchId } = await req.json();
    
    if (!eventId || !batchId) {
      throw new Error('Missing required parameters');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Get auth user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user?.email) {
      throw new Error('User not authenticated');
    }

    // Get event and batch details
    const { data: batch } = await supabaseClient
      .from('event_ticket_batches')
      .select('*, events(*)')
      .eq('id', batchId)
      .eq('event_id', eventId)
      .single();

    if (!batch) {
      throw new Error('Batch not found');
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Ticket - ${batch.events.title}`,
              description: `Lote ${batch.batch_number}`,
            },
            unit_amount: Math.round(batch.price * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/eventos/${eventId}?success=true`,
      cancel_url: `${req.headers.get('origin')}/eventos/${eventId}?canceled=true`,
      metadata: {
        event_id: eventId,
        batch_id: batchId,
        user_id: user.id,
      },
    });

    // Create pending payment record
    await supabaseClient
      .from('event_payments')
      .insert({
        event_id: eventId,
        batch_id: batchId,
        user_id: user.id,
        payment_type: 'stripe',
        amount: batch.price,
        payment_data: {
          checkout_session_id: session.id,
        },
      });

    console.log('Checkout session created:', session.id);
    
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
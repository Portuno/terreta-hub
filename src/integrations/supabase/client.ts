// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lqrlknyrikpsxqcsxyaz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxcmxrbnlyaWtwc3hxY3N4eWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNzA3ODcsImV4cCI6MjA0OTk0Njc4N30.F0l1i4jKEsX-ftCFg22xwlWE4JiVZXPk0I6SWiDhVLo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
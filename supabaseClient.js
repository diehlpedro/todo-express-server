import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.API_KEY;

const supabaseClient = createClient(supabaseUrl, supabaseKey);

export default supabaseClient;  // export default

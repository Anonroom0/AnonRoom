import { supabase } from './supabase'; // The client you created in Phase 1

export const SupabaseService = {
  // ==========================================
  // AUTHENTICATION
  // ==========================================
  async signUp(email, password, name) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } } // Sends name to the SQL trigger we just made
    });
    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },
    async verifyEmailOtp(email, token) {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup'
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    await supabase.auth.signOut();
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // ==========================================
  // DATABASE QUERIES
  // ==========================================
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  async getActiveRaffles() {
    const { data, error } = await supabase
      .from('raffles')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
};

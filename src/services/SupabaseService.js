import { supabase } from './supabase'; // The client you created in Phase 1

export const SupabaseService = {
  // ==========================================
  // AUTHENTICATION
  // ==========================================
    async signUp(email, password, name) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } } 
    });
    
    if (error) throw error;
    
    // SUPABASE TRICK: If the user already exists, Supabase returns a fake 
    // user object with an empty identities array. We catch it here.
    if (data?.user?.identities?.length === 0) {
      throw new Error("This email is already registered. Please sign in instead.");
    }
    
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
      async resendOtp(email) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });
    if (error) throw error;
    return true;
  },

  async signOut() {
    await supabase.auth.signOut();
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
  // 1. Send the OTP to the user's email
  async sendPasswordResetOtp(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return true;
  },

  // 2. Verify the 6-digit code (Notice the type is 'recovery', not 'signup')
  async verifyPasswordResetOtp(email, token) {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'recovery'
    });
    if (error) throw error;
    return data;
  },

  // 3. Save the new password
  async updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
    return data;
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

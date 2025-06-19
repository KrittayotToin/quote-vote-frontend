import api from './axios';

export interface Quote {
  id: number;
  text: string;
  author: string;
  votes: number;
  created_at: string;
  created_by?: number;
}

export interface CreateQuoteRequest {
  text: string;
  author: string;
}

export interface QuotesResponse {
  quotes: Quote[];
}

export interface VoteRecord {
  id: number;
  quote_id: number;
  user_id: number;
  created_at: string;
}

// Query functions
export const quotesApi = {
  // Get all quotes
  getAll: async (): Promise<Quote[]> => {
    const response = await api.get('/quotes');
    const data = response.data.data || response.data;
    return data.quotes || data; // Handle both nested and direct response
  },

  // Get quote by ID
  getById: async (id: number): Promise<Quote> => {
    const response = await api.get(`/quotes/${id}`);
    return response.data.data || response.data;
  },

  // Get vote records for a quote
  getVoteRecords: async (quoteId: number): Promise<VoteRecord[]> => {
    const response = await api.get(`/quotes/${quoteId}/votes`);
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : [];
  },

  // Check if current user has voted on a quote
  hasUserVoted: async (quoteId: number): Promise<boolean> => {
    try {
      const voteRecords = await quotesApi.getVoteRecords(quoteId);
      
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      return Array.isArray(voteRecords) && voteRecords.some(vote => vote.user_id === currentUser.id);
    } catch (error) {
      console.error('Error checking vote status:', error);
      return false;
    }
  },

  // Create new quote
  create: async (quote: CreateQuoteRequest): Promise<Quote> => {
    const response = await api.post('/quotes', quote);
    return response.data.data || response.data;
  },

  // Update quote
  update: async (id: number, quote: Partial<CreateQuoteRequest>): Promise<Quote> => {
    const response = await api.put(`/quotes/${id}`, quote);
    return response.data.data || response.data;
  },

  // Delete quote
  delete: async (id: number): Promise<void> => {
    await api.delete(`/quotes/${id}`);
  },

  // Vote on quote
  vote: async (id: number): Promise<void> => {
    await api.post(`/quotes/${id}/vote`);
  },
}; 
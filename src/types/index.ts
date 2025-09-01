export interface UserProfile {
  id: string;
  username: string;
  date_of_birth: string; // YYYY-MM-DD
  bio: string;
  photo_urls: string[];
  lifestyle_tags: string[];
}

export interface ChatMessage {
  id: number;
  match_id: number;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface Match {
  id: number;
  user1_id: string;
  user2_id: string;
  created_at: string;
  other_user: UserProfile; // Populated in the app
  last_message_content?: string;
  last_message_created_at?: string;
}
export interface Profile {
  username: string;
  id: string;
}

export interface ForumTopic {
  id: string;
  title: string;
  content: string;
  user_id: string;
  views: number;
  replies: number;
  created_at: string;
  media_urls: string[];
  upvotes: number;
  downvotes: number;
  is_pinned: boolean;
  last_activity_at: string;
  profile: Profile;
}

export interface ForumComment {
  id: string;
  topic_id: string;
  user_id: string;
  content: string;
  media_urls: string[];
  created_at: string;
  updated_at: string;
  profile: Profile;
}
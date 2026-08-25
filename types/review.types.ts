export interface ReviewAuthor {
  id: string;
  username: string;
  avatarUrl: string | null;
  currentLevel: number;
}

export interface ReviewItem {
  id: number;
  gameId: number;
  userId: string;
  rating: number;
  title: string | null;
  content: string;
  isVerifiedPurchase: boolean;
  helpfulVotesCount: number;
  unhelpfulVotesCount: number;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  author: ReviewAuthor;
  userVote?: boolean | null; // true = helpful, false = unhelpful, null = no vote
}

export interface ReviewStats {
  ratingAvg: number;
  ratingCount: number;
  recommendedPercent: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

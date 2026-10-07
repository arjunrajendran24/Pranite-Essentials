/**
 * Judge.me shapes we consume (and a slim UI-facing review type that never
 * carries emails or other PII into the browser).
 */

export interface JudgeMeReviewer {
  id: number;
  name: string;
  email?: string | null;
}

export interface JudgeMePicture {
  urls?: {
    huge?: string;
    small?: string;
    original?: string;
    compact?: string;
    mega?: string;
  };
  hidden?: boolean;
}

export interface JudgeMeReview {
  id: number;
  title: string | null;
  body: string;
  rating: number;
  product_external_id: number;
  product_handle: string | null;
  product_title: string | null;
  published: boolean;
  hidden: boolean;
  verified: string;
  created_at: string;
  reviewer: JudgeMeReviewer;
  pictures: JudgeMePicture[];
  has_published_pictures: boolean;
}

export interface JudgeMeProduct {
  id: number;
  external_id: number;
  title: string;
  handle: string;
}

export interface ReviewSummary {
  average: number;
  count: number;
}

/** Safe review payload for React — no email / phone / IP. */
export interface ProductReview {
  id: number;
  title: string;
  body: string;
  rating: number;
  createdAt: string;
  reviewerName: string;
  verified: boolean;
  pictures: string[];
}

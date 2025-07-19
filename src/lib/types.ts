export type Project = {
  id: string;
  created_at?: string;
  slug: string;
  title: string;
  category: string;
  image?: string;
  description: string;
  longDescription: string;
  tags?: string[];
  livePreview?: string;
};

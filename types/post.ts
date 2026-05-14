export interface Post {
  id: string | number;
  userId: number;
  title: string;
  body: string;
  author: {
    id: string | number;
    name: string;
    avatarUrl: string;
  };
  isNew?: boolean;
}

export type PostsResponse = {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
};

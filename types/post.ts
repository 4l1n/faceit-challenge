export interface Author {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Post {
  id: string;
  author: Author;
  body: string;
  createdAt: string; // ISO 8601
}

import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 1000,
});

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export async function getPosts(): Promise<Post[]> {
  try {
    const response = await apiClient.get<Post[]>('/posts');
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

export async function createPost(post: Omit<Post, 'id'>): Promise<Post> {
  try {
    const response = await apiClient.post<Post>('/posts', post);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

export async function updatePost(id: number, post: Partial<Post>): Promise<Post> {
  try {
    const response = await apiClient.put<Post>(`/posts/${id}`, post);
    return response.data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}

export async function deletePost(id: number): Promise<void> {
  try {
    await apiClient.delete(`/posts/${id}`);
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

import apiClient from './axios';
import type { User } from '../../interfaces/auth';

export async function updateUser(id: string, body: Partial<User>): Promise<User> {
  const res = await apiClient.put(`/users/${id}`, body);
  // assume API responds with updated user in res.data
  return res.data;
}

export default updateUser;

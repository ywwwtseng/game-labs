import { request } from '@/request';

export const postSprite = (formData) => request('/api/sprites/create', {
  method: 'POST',
  body: formData,
  headers: {},
});

import { request } from '@/request';

export const fetchSprites = () => request('/api/sprites');
export const postSprite = (formData) => request('/api/sprites/create', { method: 'POST', body: formData });

export const fetchObject2Ds = () => request('/api/object2ds');
export const postObject2D = (data) => request('/api/object2ds', { method: 'POST', body: JSON.stringify(data) });
export const enableObject2DAnim = (id) => request(`/api/object2ds/${id}/anim/enable`, { method: 'POST' });
export const disableObject2DAnim = (id) => request(`/api/object2ds/${id}/anim/disable`, { method: 'POST' });
export const createObject2DFrame = ({id, tiles}) => request(`/api/object2ds/${id}/anim/frame`, { method: 'POST', body: JSON.stringify({tiles}) });


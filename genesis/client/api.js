import { request } from '@/request';

export const fetchSprites = () => request('/api/sprites');
export const postSprite = (formData) => request('/api/sprites/create', {
  method: 'POST',
  body: formData,
  headers: {},
});

export const fetchObject2Ds = () => request('/api/object2ds');
export const postObject2D = (data) => request('/api/object2ds', { method: 'POST', body: JSON.stringify(data) });
export const enableObject2DAnim = (id) => request(`/api/object2ds/${id}/anim/enable`, { method: 'POST' });
export const updateObject2DAnimRate = ({id, rate}) => request(`/api/object2ds/${id}/anim/rate`, { method: 'POST', body: JSON.stringify({rate}) });
export const disableObject2DAnim = (id) => request(`/api/object2ds/${id}/anim/disable`, { method: 'POST' });
export const createObject2DAnimFrame = ({id, tiles}) => request(`/api/object2ds/${id}/anim/frames`, { method: 'POST', body: JSON.stringify({tiles}) });
export const deleteObject2DAnimFrame = ({id, index}) => request(`/api/object2ds/${id}/anim/frames/${index}`, { method: 'DELETE' });


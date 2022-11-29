import axiosClient from './axiosClient';

export const travelApi = {
  getAll(params) {
    const url = '/destination-list';
    return axiosClient.get(url, { params });
  },

  getById(id) {
    const url = `/destination-list/${id}`;
    return axiosClient.get(url);
  },
};

export const shopApi = {
  getAll(params) {
    const url = '/products';
    return axiosClient.get(url, { params });
  },

  getById(id) {
    const url = `/products/${id}`;
    return axiosClient.get(url);
  },

  update(data, id) {
    const url = `/products/${id}`;
    return axiosClient.patch(url, data);
  },
};

export const blogApi = {
  getAll(params) {
    const url = '/blog';
    return axiosClient.get(url, { params });
  },

  getById(id) {
    const url = `/blog/${id}`;
    return axiosClient.get(url);
  },
};

export const cartApi = {
  getAll(params) {
    const url = '/cart';
    return axiosClient.get(url, { params });
  },

  getById(id) {
    const url = `/cart/${id}`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = '/cart';
    return axiosClient.post(url, data);
  },

  remove(id) {
    const url = `/cart/${id}`;
    return axiosClient.delete(url);
  },
};

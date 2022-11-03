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

// export default travelApi;

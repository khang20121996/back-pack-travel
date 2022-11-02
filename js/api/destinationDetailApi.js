import axiosClient from './axiosClient';

export const thingsToSeeApi = {
  getAll(params) {
    const url = '/things-to-see';
    return axiosClient.get(url, { params });
  },

  getByParentId(idDestination) {
    const url = `/things-to-see?idDestination=${idDestination}`;
    return axiosClient.get(url);
  },
};

export const typicalCostsApi = {
  getAll(params) {
    const url = '/typical-costs';
    return axiosClient.get(url, { params });
  },

  getByParentId(idDestination) {
    const url = `/typical-costs?idDestination=${idDestination}`;
    return axiosClient.get(url);
  },
};

// budget-tips

export const budgetTipsApi = {
  getByParentId(idDestination) {
    const url = `/budget-tips?idDestination=${idDestination}`;
    return axiosClient.get(url);
  },
};

export const relatedArticlesApi = {
  getByParentId(idDestination) {
    const url = `/related-articles?idDestination=${idDestination}`;
    return axiosClient.get(url);
  },

  update(data) {
    const url = `/related-articles/${data.id}`;
    return axiosClient.patch(url, data);
  },
};

export const commentListApi = {
  getByParentId(idDestination) {
    const url = `/comment-list?idDestination=${idDestination}`;
    return axiosClient.get(url);
  },

  getById(id) {
    const url = `/comment-list/${id}`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = '/comment-list';
    return axiosClient.post(url, data);
  },

  update(data) {
    const url = `/comment-list/${data.id}`;
    return axiosClient.patch(url, data);
  },

  remove(id) {
    const url = `/comment-list/${id}`;
    return axiosClient.delete(url);
  },
};

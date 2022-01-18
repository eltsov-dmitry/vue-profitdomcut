import axios from 'axios';
import qs from 'qs';

const env = 'prod';

const getURL = (mode) => {
  switch (mode) {
    case 'dev':
      return 'https://dev.production.com';
    case 'local':
      return 'http://production.local';
    case 'prod':
      return 'https://production.com';

    default:
      return '';
  }
};

const api = axios.create({ baseURL: `${getURL(env)}/api` });
const headersConfig = { Accept: 'application/json' };
const token = 'token';

export const getOffers = (paramsUser) => api
  .get('offers', {
    headers: headersConfig,
    params: {
      token,
      page: paramsUser.page,
      sort: paramsUser.sort,
      filter: paramsUser.filter,
    },
    paramsSerializer: (params) => qs.stringify(params, { encode: false }),
  })
  .then((response) => response)
  .catch((e) => e);

export const postOffers = (offer) => api
  .post(`offers?token=${token}`, offer, { headers: headersConfig })
  .then((response) => response)
  .catch((e) => e);

export const putOffers = (offerId, data) => api.put(`offers/${offerId}?token=${token}`, data).then((response) => response);

export const deleteOffers = (offerId) => api.delete(`offers/${offerId}?token=${token}`).then((response) => response);

export const postOffersItem = (offersItem) => api.post(`items?token=${token}`, offersItem).then((response) => response);

export const putOffersItem = (offerId, data) => api.put(`items/${offerId}?token=${token}`, data).then((response) => response);

export const deleteOffersItem = (itemId) => api
  .delete(`items/${itemId}?token=${token}`)
  .then((response) => response)
  .catch((e) => e);

export const getCompilationURL = () => getURL(env);

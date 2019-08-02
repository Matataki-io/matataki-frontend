/* eslint-disable */
"use strict";

import axios from "axios";
import { Loading } from 'element-ui';
import utils from './utils'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// baseURL: process.env.baseURL || process.env.apiUrl || ""
// timeout: 60 * 1000, // Timeout
// withCredentials: true, // Check cross-site Access-Control

const _axios = axios.create({
  baseURL: process.env.VUE_APP_API,
  headers: {},
});

let loadingInstance = null;

_axios.interceptors.request.use(
  (config) => {
    console.log('user request interceptors', config, config.showLoading)
    loadingInstance = Loading.service();
    if (utils.getCookie('ACCESS_TOKEN')) config.headers['x-access-token'] = utils.getCookie('ACCESS_TOKEN');
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
    (response) => {
      if(loadingInstance) loadingInstance.close();
      return response.data;
    },
    (error) => {
      return Promise.reject(error);
    }
);

export default _axios;

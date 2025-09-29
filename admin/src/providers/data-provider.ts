import { DataProvider } from '@refinedev/core';
import axios from 'axios';

const API_URL = '/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include JWT token
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Map resource names to API endpoints (Admin endpoints)
const resourceMap: Record<string, string> = {
  users: 'admin/users',
  roles: 'admin/roles',
  permissions: 'admin/roles/permissions',
  health: 'admin/health',
};

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters }) => {
    const url = resourceMap[resource] || resource;

    const params: any = {};

    // Handle pagination
    if (pagination) {
      params.page = pagination.current;
      params.limit = pagination.pageSize;
    }

    // Handle filters
    if (filters && filters.length > 0) {
      filters.forEach(filter => {
        if (filter.operator === 'contains') {
          if (
            filter.field === 'email' ||
            filter.field === 'firstName' ||
            filter.field === 'lastName'
          ) {
            params.search = filter.value;
          } else {
            params[`${filter.field}_like`] = filter.value;
          }
        } else if (filter.operator === 'eq') {
          params[filter.field] = filter.value;
        }
      });
    }

    // Handle sorting
    if (sorters && sorters.length > 0) {
      const sorter = sorters[0];
      params.sortBy = sorter.field;
      params.sortOrder = sorter.order;
    }

    try {
      const response = await axiosInstance.get(url, { params });

      // Handle different response formats from your API
      const responseData = response.data;

      // Check if it's the new nested format with data.users
      if (
        responseData.data &&
        responseData.data.users &&
        typeof responseData.data.total === 'number'
      ) {
        return {
          data: responseData.data.users,
          total: responseData.data.total,
        };
      }

      // Check if it's the direct paginated format
      if (responseData.users && typeof responseData.total === 'number') {
        return {
          data: responseData.users,
          total: responseData.total,
        };
      }

      // Fallback to old format
      const data = responseData.data || responseData;
      const total = responseData.total || data.length;

      return {
        data: Array.isArray(data) ? data : [data],
        total,
      };
    } catch (error) {
      console.error('Error fetching list:', error);
      throw error;
    }
  },

  getOne: async ({ resource, id }) => {
    const url = resourceMap[resource] || resource;

    try {
      const response = await axiosInstance.get(`${url}/${id}`);

      return {
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Error fetching one:', error);
      throw error;
    }
  },

  create: async ({ resource, variables }) => {
    const url = resourceMap[resource] || resource;

    try {
      const response = await axiosInstance.post(url, variables);

      return {
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Error creating:', error);
      throw error;
    }
  },

  update: async ({ resource, id, variables }) => {
    const url = resourceMap[resource] || resource;

    try {
      const response = await axiosInstance.put(`${url}/${id}`, variables);

      return {
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Error updating:', error);
      throw error;
    }
  },

  deleteOne: async ({ resource, id }) => {
    const url = resourceMap[resource] || resource;

    try {
      const response = await axiosInstance.delete(`${url}/${id}`);

      return {
        data: response.data.data || response.data,
      };
    } catch (error) {
      console.error('Error deleting:', error);
      throw error;
    }
  },

  getApiUrl: () => API_URL,

  custom: async ({ url, method, payload, query, headers }) => {
    let requestUrl = `${url}`;

    // Add query params
    if (query) {
      const queryString = new URLSearchParams(query).toString();
      requestUrl = `${requestUrl}?${queryString}`;
    }

    try {
      const response = await axiosInstance({
        url: requestUrl,
        method,
        data: payload,
        headers,
      });

      return {
        data: response.data,
      };
    } catch (error) {
      console.error('Error in custom request:', error);
      throw error;
    }
  },

  getMany: async ({ resource, ids }) => {
    const url = resourceMap[resource] || resource;

    try {
      const promises = ids.map(id => axiosInstance.get(`${url}/${id}`));
      const responses = await Promise.all(promises);

      return {
        data: responses.map(response => response.data.data || response.data),
      };
    } catch (error) {
      console.error('Error fetching many:', error);
      throw error;
    }
  },

  createMany: async ({ resource, variables }) => {
    const url = resourceMap[resource] || resource;

    try {
      const promises = variables.map(variable => axiosInstance.post(url, variable));
      const responses = await Promise.all(promises);

      return {
        data: responses.map(response => response.data.data || response.data),
      };
    } catch (error) {
      console.error('Error creating many:', error);
      throw error;
    }
  },

  deleteMany: async ({ resource, ids }) => {
    const url = resourceMap[resource] || resource;

    try {
      const promises = ids.map(id => axiosInstance.delete(`${url}/${id}`));
      const responses = await Promise.all(promises);

      return {
        data: responses.map(response => response.data.data || response.data),
      };
    } catch (error) {
      console.error('Error deleting many:', error);
      throw error;
    }
  },

  updateMany: async ({ resource, ids, variables }) => {
    const url = resourceMap[resource] || resource;

    try {
      const promises = ids.map(id => axiosInstance.put(`${url}/${id}`, variables));
      const responses = await Promise.all(promises);

      return {
        data: responses.map(response => response.data.data || response.data),
      };
    } catch (error) {
      console.error('Error updating many:', error);
      throw error;
    }
  },
};

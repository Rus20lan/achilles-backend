import { method } from 'lodash-es';

class PostgresApi {
  constructor(dispatch) {
    this.controller = null;
  }

  async handleUnauthorized() {
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
  }

  async makeRequest(url, options = {}) {
    if (this.controller) {
      this.controller.abort();
    }
    this.controller = new AbortController();

    try {
      const { method = 'GET', body, headers = {}, params } = options;
      const queryString = params
        ? `?${new URLSearchParams(params).toString()}`
        : '';

      const res = await fetch(`${url}${queryString ?? ''}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: this.controller.signal,
      });

      if (res.status === 401) {
        this.handleUnauthorized();
        throw new Error('Unauthorized');
      }
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Запрос не выполнен');
      }
      return await res.json();
    } catch (error) {
      if (error.name !== 'AbortError') {
        throw error;
      }
    } finally {
      this.controller = null;
    }
  }
  async postUser(url, candidate) {
    return this.makeRequest(url, { method: 'POST', body: candidate });
  }

  async getEntity(url) {
    return this.makeRequest(url);
  }

  async sendCandidateLogin(candidate) {
    const result = await this.postUser('/api/auth/login', candidate);
    if (result?.token) {
      localStorage.setItem('token', result.token);
    }
    return result;
  }

  async sendRegisterUser(candidate) {
    return this.postUser('/api/auth/register', candidate);
  }

  async fetchWithPagination({ url, page = 1, limit = 10, signal }) {
    return this.makeRequest(`${url}/paginated`, {
      params: { page, limit },
      signal,
    });
  }

  // Создаем сущность
  async createEntity(url, data) {
    return await this.makeRequest(url, { method: 'POST', body: data });
  }
  // Редактируем сущность
  async putEntity(url, data) {
    return await this.makeRequest(url, { method: 'PUT', body: data });
  }
  // Удаляем сущность
  async deleteEntity(url, data) {
    console.log(data);
    return await this.makeRequest(url, { method: 'DELETE', body: data });
  }

  async getDesignBrevis(url) {
    const result = await fetch(url);
    // console.log(await result.json());
    return await result.json();
  }

  async getResourcesName(url) {
    const result = await fetch(url);
    return await result.json();
  }
}

export default PostgresApi;

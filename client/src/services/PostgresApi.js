class PostgresApi {
  async postUser(url, candidate) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(candidate),
      });
      if (!res.ok) {
        const obj = await res.json();
        throw new Error(obj.message);
      }
      return await res.json();
    } catch (error) {
      return Promise.reject(error.message);
    }
  }

  async getEntity(url) {
    try {
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
      });
      if (res.status == 401) {
        localStorage.removeItem('token');
      }
      if (!res.ok) {
        const obj = await res.json();
        console.log(res.status);

        throw new Error(obj.message);
      }
      return await res.json();
    } catch (error) {
      return Promise.reject(error.message);
    }
  }

  async sendCandidateLogin(candidate) {
    const result = await this.postUser('/api/auth/login', candidate);
    if (Object.hasOwn(result, 'token')) {
      localStorage.setItem('token', result.token);
    }
    return result;
  }

  async sendRegisterUser(candidate) {
    return await this.postUser('/api/auth/register', candidate);
  }
}

export default PostgresApi;

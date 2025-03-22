import { Endpoint } from './Enpoint';

export class API_Source {
  /* users */
  static async login(username, password) {
    try {
      const response = await fetch(Endpoint.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      const token = data.data.token;
      localStorage.setItem('token', token);
      const userId = data.data.id;
      localStorage.setItem('userId', userId);
      return data.data; // Mengembalikan data dari response
    } catch (error) {
      throw new Error(error.message); // Melemparkan error agar bisa ditangani di tempat lain
    }
  }
}
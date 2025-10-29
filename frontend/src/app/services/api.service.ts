import { Injectable } from '@angular/core';
import axios from 'axios';
import { config } from '../config/env';

axios.defaults.baseURL = config.urls.base;

export interface CreatePersonData {
  firstName: string;
  lastName: string;
  dni: string;
  password?: string;
  email?: string;
  cityId: number;
  birthDate?: string;
}
export interface UpdatePersonData extends Partial<CreatePersonData> {}
export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}

  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    if (token) {
      return {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
    }
    return { headers: { 'Content-Type': 'application/json' } };
  }


  async getAllPersons(page: number, itemsPerPage: number): Promise<any> { 
    const options = {
      ...this.getAuthHeaders(),
      // Añadimos los 'params' para que axios los ponga en la URL
      params: {
        page: page,
        itemsPerPage: itemsPerPage, 
      },
    };
    // La petición ahora será: /persons?page=1&itemsPerPage=5
    const response = await axios.get(config.urls.persons, options);
    return response.data;
  }

  async getPersonById(id: number): Promise<any> {
    const response = await axios.get(`${config.urls.persons}/${id}`, this.getAuthHeaders());
    return response.data;
  }

  async createNewPerson(data: CreatePersonData): Promise<any> {
    const response = await axios.post(config.urls.persons, data, this.getAuthHeaders());
    return response.data;
  }

  async updatePerson(id: number, data: UpdatePersonData): Promise<any> {
    const response = await axios.patch(`${config.urls.persons}/${id}`, data, this.getAuthHeaders());
    return response.data;
  }

  async deletePerson(id: number): Promise<void> {
    await axios.delete(`${config.urls.persons}/${id}`, this.getAuthHeaders());
  }

  async register(data: CreatePersonData): Promise<any> {
    const response = await axios.post(config.urls.register, data);
    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<any> {
    try {
      const response = await axios.post(config.urls.login, credentials);
      // El backend devuelve 'accessToken'.
      const token = response.data.accessToken; 
      if (token) {
        localStorage.setItem('authToken', token);
      }
      return response.data;
    } catch (error) {
      localStorage.removeItem('authToken');
      throw error;
    }
  }

  async getData(): Promise<any> {
    const response = await axios.get(config.urls.getFood);
    return response.data;
  }
}
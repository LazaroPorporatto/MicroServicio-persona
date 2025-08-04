import { Injectable } from '@angular/core';
import axios from 'axios';
import { config } from '../config/env'; 

// Esto asegura que todas las peticiones apunten a nuestro backend por defecto.
axios.defaults.baseURL = config.urls.base;

// INTERFACES 
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
export interface LoginCredentials { email: string; password: string; }

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
          'Authorization': `Bearer ${token}`
        }
      };
    }
    return { headers: { 'Content-Type': 'application/json' } };
  }
  
  // MÉTODOS DE API 

  async getAllPersons(): Promise<any[]> {
    return (await axios.get(config.urls.persons, this.getAuthHeaders())).data;
  }

  async getPersonById(id: number): Promise<any> {
    return (await axios.get(`${config.urls.persons}/${id}`, this.getAuthHeaders())).data;
  }

  async createNewPerson(data: CreatePersonData): Promise<any> {
    return (await axios.post(config.urls.persons, data, this.getAuthHeaders())).data;
  }

  async updatePerson(id: number, data: UpdatePersonData): Promise<any> {
    return (await axios.patch(`${config.urls.persons}/${id}`, data, this.getAuthHeaders())).data;
  }

  async deletePerson(id: number): Promise<void> {
    await axios.delete(`${config.urls.persons}/${id}`, this.getAuthHeaders());
  }

  async register(data: CreatePersonData): Promise<any> {
    return (await axios.post(config.urls.register, data)).data;
  }

  async login(credentials: LoginCredentials): Promise<any> {
    try {
      const response = await axios.post(config.urls.login, credentials);
      // NestJS devuelve 'access_token' (con guion bajo).
      const token = response.data.access_token; 
      if (token) {
        localStorage.setItem('authToken', token);
      }
      return response.data; // Devolvemos toda la respuesta para que el componente la use
    } catch (error) {
      localStorage.removeItem('authToken');
      throw error;
    }
  }
  
  async getData(): Promise<any> {
    return (await axios.get(config.urls.getFood)).data;
  }
}
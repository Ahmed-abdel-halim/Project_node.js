import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private API_BASE = 'http://localhost:3000/admin';
// getUsers() {
//   return this.http.get(`${this.API_BASE}/users`);
// }
  constructor(private http: HttpClient) {}

  // Users
  getUsers() {
    return this.http.get(`${this.API_BASE}/users`);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.API_BASE}/users/${id}`);
  }

  updateUser(id: number, data: any) {
    return this.http.put(`${this.API_BASE}/users/${id}`, data);
  }

  // Products
  getProducts() {
    return this.http.get(`${this.API_BASE}/products`);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.API_BASE}/products/${id}`);
  }

  updateProduct(id: number, data: any) {
    return this.http.put(`${this.API_BASE}/products/${id}`, data);
  }

  addProduct(data: any) {
    return this.http.post(`${this.API_BASE}/products`, data);
  }
}

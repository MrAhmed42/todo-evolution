import type { User, Task, ChatResponse } from '../types'

export class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    this.syncToken()
  }

  private syncToken(): void {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token')
      if (storedToken && storedToken !== 'undefined' && storedToken !== 'null') {
        this.token = storedToken
      } else {
        this.token = null
      }
    }
  }

  setToken(token: string): void {
    if (token && token !== 'undefined') {
      this.token = token
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token)
      }
    }
  }

  private async request(url: string, options: RequestInit = {}) {
    this.syncToken()

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${this.baseUrl}${url}`, {
      ...options,
      headers,
    })

    if (response.status === 401) {
      this.token = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
      }
      throw new Error("Unauthorized")
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `API request failed: ${response.status}`)
    }

    if (response.status === 204) return null
    return response.json()
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await this.request('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    
    const token = response.token || response.access_token
    if (token) {
      this.setToken(token)
    }
    
    return response
  }

  async register(email: string, password: string, name: string): Promise<{ user: User; token: string }> {
    const response = await this.request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
    
    const token = response.token || response.access_token
    if (token) {
      this.setToken(token)
    }
    
    return response
  }

  async logout(): Promise<void> {
    try {
      await this.request('/api/auth/signout', { method: 'POST' })
    } catch (e) {
      console.warn("Logout request failed")
    } finally {
      this.token = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_id')
      }
    }
  }

  async getUserInfo(): Promise<User> {
    return this.request('/api/auth/me')
  }

  async getTasks(userId: string): Promise<Task[]> {
    return this.request(`/api/users/${userId}/tasks`)
  }

  async createTask(userId: string, title: string, description?: string): Promise<Task> {
    return this.request(`/api/users/${userId}/tasks`, {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    })
  }

  async updateTask(userId: string, taskId: number, data: Partial<Task>): Promise<Task> {
    return this.request(`/api/users/${userId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteTask(userId: string, taskId: number): Promise<void> {
    await this.request(`/api/users/${userId}/tasks/${taskId}`, { method: 'DELETE' })
  }

  async toggleTask(userId: string, taskId: number): Promise<Task> {
    return this.request(`/api/users/${userId}/tasks/${taskId}/complete`, { method: 'PATCH' })
  }

  async chatWithAI(userId: string, data: { message: string; thread_id?: string }): Promise<ChatResponse> {
    return this.request(`/api/chat/${userId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}
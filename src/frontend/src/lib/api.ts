import { ApiError, type Employee, type EmployeeInput, type EmployeeOptions } from './types'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5080'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    })
  } catch {
    // fetch only rejects for network-level failures, which almost always means
    // the API isn't running — worth saying plainly rather than "Failed to fetch".
    throw new ApiError('Cannot reach the API. Is the backend running?', 0)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(
      body?.title ?? `Request failed with status ${response.status}`,
      response.status,
      body?.errors ?? {},
    )
  }

  return body as T
}

export const api = {
  listEmployees: () => request<Employee[]>('/employees'),
  getEmployee: (id: number) => request<Employee>(`/employees/${id}`),
  createEmployee: (input: EmployeeInput) =>
    request<Employee>('/employees', { method: 'POST', body: JSON.stringify(input) }),
  updateEmployee: (id: number, input: EmployeeInput) =>
    request<Employee>(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(input) }),
  deleteEmployee: (id: number) => request<void>(`/employees/${id}`, { method: 'DELETE' }),
  getOptions: () => request<EmployeeOptions>('/employee-options'),
}

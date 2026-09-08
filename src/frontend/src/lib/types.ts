export interface Employee {
  id: number
  name: string
  email: string
  nationalId: string
  countryCode: string
  phone: string
  country: string
  gender: string
  dateOfBirth: string // ISO date, e.g. "1990-09-03"
  officialTitle: string
  hireDate: string
}

export type EmployeeInput = Omit<Employee, 'id'>

/**
 * Dropdown values and validation rules served by the API, so the form's schema is
 * built from the server's rules instead of constants duplicated on the client.
 */
export interface EmployeeOptions {
  genders: string[]
  titles: string[]
  minimumAgeYears: number
  countryCodePattern: string
  maxLengths: {
    name: number
    email: number
    nationalId: number
    phone: number
    country: number
  }
}

/**
 * ASP.NET Core returns validation failures as ProblemDetails with an `errors` map
 * keyed by property name. Carrying that map through lets the form show messages
 * on the offending field instead of dumping everything into a toast.
 */
export class ApiError extends Error {
  // Declared as fields rather than constructor parameter properties, which the
  // project's `erasableSyntaxOnly` setting disallows.
  readonly status: number
  readonly fieldErrors: Record<string, string[]>

  constructor(message: string, status: number, fieldErrors: Record<string, string[]> = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

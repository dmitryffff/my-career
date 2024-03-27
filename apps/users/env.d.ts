declare module 'bun' {
  interface Env {
    PORT: number
    POSTGRES_USER: string
    POSTGRES_PASSWORD: string
    POSTGRES_HOST: string
    POSTGRES_PORT: number
    POSTGRES_DB: string
    POSTGRES_SCHEMA: string
    DATABASE_URL: string
  }
}

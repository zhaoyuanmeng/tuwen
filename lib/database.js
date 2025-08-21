import { Pool } from 'pg'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'teqin',
  port: parseInt(process.env.DB_PORT || '5433')
}

let connectionPool

export async function connectToDatabase() {
  if (!connectionPool) {
    connectionPool = new Pool(dbConfig)
  }

  return connectionPool
}
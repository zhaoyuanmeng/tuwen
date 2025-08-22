import { Pool } from 'pg'

const dbConfig = {
  host: process.env.DB_HOST || '10.10.102.103',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'zyd',
  port: parseInt(process.env.DB_PORT || '5422')
}

let connectionPool

export async function connectToDatabase() {
  if (!connectionPool) {
    connectionPool = new Pool(dbConfig)
  }

  return connectionPool
}
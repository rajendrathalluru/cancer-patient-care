import { neon } from "@neondatabase/serverless"

// Get database URL from environment variables
const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || ""

// Only initialize neon if we have a valid database URL
let sql: any = null

if (DATABASE_URL && DATABASE_URL !== "your-neon-database-url" && DATABASE_URL.startsWith("postgres")) {
  try {
    sql = neon(DATABASE_URL)
    console.log("✅ Database connected successfully")
  } catch (error) {
    console.warn("⚠️ Database connection failed:", error)
    sql = null
  }
} else {
  console.warn("⚠️ No valid database URL found. Using mock data for development.")
  sql = null
}

export { sql }

// Database utility functions with fallback
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  if (!sql) {
    console.warn("Database not connected. Returning empty result.")
    return []
  }

  try {
    const result = await sql(query, params)
    return result as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw new Error("Database operation failed")
  }
}

export async function executeQuerySingle<T = any>(query: string, params: any[] = []): Promise<T | null> {
  const result = await executeQuery<T>(query, params)
  return result[0] || null
}

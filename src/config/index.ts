const ENV = process.env.ENV || "development"
const PORT = process.env.PORT || 3000
const DATABASE_URL = process.env.DATABASE_URL || "file:./dev.sqlite"
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "somerandomaccesstoken"
const REFRESH_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "somerandomstringforrefreshtoken"
const isProduction = ENV == "production"

// eslint-disable-next-line @typescript-eslint/naming-convention
console.log({ ENV, PORT, DATABASE_URL, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, isProduction })
export { ENV, PORT, DATABASE_URL, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, isProduction }

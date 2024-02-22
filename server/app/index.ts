import express from 'express'
import cors from 'cors'
require('dotenv').config()
if (process.argv[2]) process.env.ELASTIC_PASSWORD = process.argv[2];

const app = express()
app.use(cors())
export default app;
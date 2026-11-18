import express from 'express'
import cors from 'cors'
import { CONFIG, DEMO_MODE } from './config.js'
import { leadsRouter } from './routes/leads.js'
import { toolsRouter } from './routes/tools.js'
import { webhookRouter } from './routes/webhook.js'
import { snapshot } from './store.js'

const app = express()
app.use(cors({ origin: CONFIG.corsOrigin }))
app.use(express.json())

// Lightweight request log.
app.use((req, _res, next) => {
  if (req.path !== '/health') console.info(`${req.method} ${req.path}`)
  next()
})

app.get('/health', (_req, res) => res.json({ ok: true, demo: DEMO_MODE }))

app.use('/api/leads', leadsRouter)
app.use('/api/tools', toolsRouter)
app.use('/api/webhooks', webhookRouter)

// Dev-only: peek at the in-memory store.
app.get('/api/_debug/snapshot', (_req, res) => res.json(snapshot()))

app.listen(CONFIG.port, () => {
  console.info(
    `HappySmile server on http://localhost:${CONFIG.port}  [${DEMO_MODE ? 'DEMO' : 'LIVE'} mode]`,
  )
  console.info(`CORS origin: ${CONFIG.corsOrigin}`)
})

type LogLevel = 'info' | 'warn' | 'error'

type LogPayload = {
  scope: string
  event: string
  requestId?: string
  userId?: string
  [key: string]: unknown
}

function emit(level: LogLevel, payload: LogPayload) {
  const message = JSON.stringify({
    level,
    timestamp: new Date().toISOString(),
    ...payload,
  })

  if (level === 'error') {
    console.error(message)
    return
  }

  if (level === 'warn') {
    console.warn(message)
    return
  }

  console.log(message)
}

export function logInfo(payload: LogPayload) {
  emit('info', payload)
}

export function logWarn(payload: LogPayload) {
  emit('warn', payload)
}

export function logError(payload: LogPayload) {
  emit('error', payload)
}

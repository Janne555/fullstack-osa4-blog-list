export function info(...params: any) {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

export function error(...params: any) {
  console.error(...params)
}
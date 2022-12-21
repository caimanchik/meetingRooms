export type Environment = {
  production: boolean,
  apiKey: string,
  fbUrl: string
}

export type User = {
  email: string,
  password: string
}

export type Meeting = {
  start: string,
  end: string,
  name: string,
  phone: number
}

export type Day = {
  date: Date,
  meetings: Meeting[]
}

export type Room = {
  name: string,
  calendar: Day[]
}

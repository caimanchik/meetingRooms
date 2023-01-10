export type Environment = {
  production: boolean,
  djangoUrl: string
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

export type LoginFalse = {
  hasToken: false,
  link: string,
  code: string
}

export type LoginTrue = {
  hasToken: true
}

export type Login = LoginTrue | LoginFalse

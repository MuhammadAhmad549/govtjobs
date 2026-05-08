export type JobSource = 'FPSC' | 'PUNJAB' | 'PPSC' | 'FBR' | 'FIA' | 'NJP'

export interface Job {
  id: number
  title: string
  department: string
  location: string
  salary: string
  deadline: string
  type: string
  experience: string
  description: string
  source: JobSource
  sourceWebsite: string
  applyUrl: string
  sourceColor: string
  isAuthentic: boolean
}

export interface Department {
  id: JobSource
  name: string
  color: string
  bgColor: string
  website: string
}

import { Department, JobSource } from '@/app/lib/types'

export const departments: Record<JobSource, Department> = {
  FPSC: {
    id: 'FPSC',
    name: 'FPSC',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    website: 'https://www.fpsc.gov.pk'
  },
  PUNJAB: {
    id: 'PUNJAB',
    name: 'Punjab Jobs',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    website: 'https://jobs.punjab.gov.pk/new_recruit/jobs'
  },
  PPSC: {
    id: 'PPSC',
    name: 'PPSC',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    website: 'https://www.ppsc.gop.pk'
  },
  FBR: {
    id: 'FBR',
    name: 'FBR',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    website: 'https://www.fbr.gov.pk'
  },
  FIA: {
    id: 'FIA',
    name: 'FIA',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    website: 'https://fia.gov.pk/careers'
  },
  NJP: {
    id: 'NJP',
    name: 'NJP',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-100',
    website: 'https://www.njp.gov.pk/jobs/live'
  }
}

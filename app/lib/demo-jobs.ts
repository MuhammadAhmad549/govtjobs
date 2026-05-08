import { Job } from '@/app/lib/types'

export const demoJobs: Job[] = [
  {
    id: 101,
    title: 'Police Constable',
    department: 'Punjab Police',
    location: 'Multiple Cities',
    salary: 'Rs. 40,000 - 60,000',
    deadline: '2026-08-15',
    type: 'Permanent',
    experience: 'Intermediate',
    description: 'Maintain law and order, provide security services.',
    source: 'PUNJAB',
    sourceWebsite: 'Punjab Jobs Portal',
    applyUrl: 'https://jobs.punjab.gov.pk/new_recruit/jobs',
    sourceColor: 'green',
    isAuthentic: false
  },
  {
    id: 102,
    title: 'Inspector (BPS-16)',
    department: 'Punjab Police Selection Commission',
    location: 'Multan',
    salary: 'Rs. 90,000 - 130,000',
    deadline: '2026-06-20',
    type: 'Permanent',
    experience: "Bachelor's Degree",
    description: 'Conduct investigation and enforcement operations.',
    source: 'PPSC',
    sourceWebsite: 'Punjab Public Service Commission',
    applyUrl: 'https://www.ppsc.gop.pk/',
    sourceColor: 'orange',
    isAuthentic: false
  },
  {
    id: 103,
    title: 'Customs Officer (BPS-16)',
    department: 'Federal Board of Revenue',
    location: 'Peshawar',
    salary: 'Rs. 90,000 - 130,000',
    deadline: '2026-06-20',
    type: 'Permanent',
    experience: "Bachelor's Degree",
    description: 'Enforce customs regulations and prevent smuggling activities.',
    source: 'FBR',
    sourceWebsite: 'Federal Board of Revenue',
    applyUrl: 'https://www.fbr.gov.pk/',
    sourceColor: 'red',
    isAuthentic: false
  },
  {
    id: 104,
    title: 'Assistant Director (NJP Portal)',
    department: 'National Jobs Portal',
    location: 'Islamabad',
    salary: 'As per rules',
    deadline: 'Check portal',
    type: 'Contract',
    experience: "Bachelor's Degree",
    description: 'Sample listing representing jobs aggregated from the National Jobs Portal.',
    source: 'NJP',
    sourceWebsite: 'National Jobs Portal',
    applyUrl: 'https://www.njp.gov.pk/jobs/live',
    sourceColor: 'indigo',
    isAuthentic: false
  }
]

import Link from 'next/link'
import { Job } from '@/app/lib/types'
import { departments } from '@/app/lib/departments'
import { getJobUrl } from '@/app/lib/job-slug'

interface JobCardProps {
  job: Job
}

export default function JobCard({ job }: JobCardProps) {
  const dept = departments[job.source]
  const detailUrl = getJobUrl(job)

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              <Link href={detailUrl} className="hover:text-cyan-700">
                {job.title}
              </Link>
            </h3>
            <p className="text-sm text-slate-500 mb-1">{job.department}</p>
            <div className="text-sm text-slate-500">{job.location}</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${dept.bgColor} ${dept.color}`}>
              {dept.name}
            </span>
            {job.isAuthentic ? (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                Verified
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                Official Listing
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 text-sm text-slate-600 mb-5 sm:grid-cols-2">
          <div>
            <p className="font-semibold text-slate-700">Salary</p>
            <p>{job.salary}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-700">Deadline</p>
            <p>{job.deadline}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-700">Experience</p>
            <p>{job.experience}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-700">Type</p>
            <p>{job.type}</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-6">{job.description}</p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href={detailUrl}
            className="inline-flex justify-center items-center rounded-2xl border border-slate-200 text-slate-700 px-4 py-2 text-sm hover:bg-slate-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            View Details
          </Link>
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center rounded-2xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            Apply on Official Site
          </a>
        </div>
      </div>
    </div>
  )
}

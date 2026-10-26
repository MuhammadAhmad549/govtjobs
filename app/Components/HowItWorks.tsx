const STEPS = [
  {
    title: 'Search or filter',
    body: 'Use keywords (city, grade, department) or tap FPSC, PPSC, NJP, and other source filters.',
  },
  {
    title: 'Open job details',
    body: 'See salary, deadline, location, and a short summary — with a link to our detail page for sharing.',
  },
  {
    title: 'Apply officially',
    body: 'Use “Apply on Official Site” to complete your application on the government portal that published the vacancy.',
  },
]

export default function HowItWorks() {
  return (
    <section className="border-t border-slate-200 bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">How GovtJobs Pakistan works</h2>
          <p className="mt-3 text-slate-600">
            Built for students, graduates, and professionals across Pakistan who want a single starting point for sarkari naukri — without fake apply buttons or paid middlemen.
          </p>
        </div>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                {index + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

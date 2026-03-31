export default function PatientShell() {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center">
      <div className="w-[1200px] h-[700px] rounded-3xl bg-white/5 backdrop-blur-xl p-10">
        <h1 className="text-6xl font-semibold">9:23 AM</h1>
        <p className="text-xl opacity-70">Monday, March 24</p>

        <div className="mt-10 grid grid-cols-2 gap-8">
          <div>
            <p className="text-sm opacity-50 mb-2">Health</p>
            <div className="text-lg">Medication + Meals placeholder</div>
          </div>

          <div>
            <p className="text-sm opacity-50 mb-2">Tasks</p>
            <div className="text-lg">Task list placeholder</div>
          </div>

          <div>
            <p className="text-sm opacity-50 mb-2">Weather</p>
            <div className="text-lg">72° ☀️</div>
          </div>

          <div>
            <p className="text-sm opacity-50 mb-2">Message</p>
            <div className="text-lg">Good morning, Wade.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

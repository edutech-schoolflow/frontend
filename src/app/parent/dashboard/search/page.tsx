import { MOCK_SCHOOL } from "@/src/lib/api/mock/data";

export default function SchoolSearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand-green px-4 pt-10 pb-6">
        <h1 className="text-lg font-semibold text-white">Find a School</h1>
        <div className="mt-3 rounded-xl bg-white px-4 py-3 flex items-center gap-2">
          <span>🔍</span>
          <input
            className="flex-1 outline-none text-sm text-dark-blue placeholder:text-grey-text"
            placeholder="Search by school name or location..."
          />
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        <div className="rounded-xl bg-white border border-border-default p-4">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-xl">
              🏫
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-dark-blue">{MOCK_SCHOOL.name}</p>
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                  ✓ Verified
                </span>
              </div>
              <p className="text-xs text-grey-text mt-0.5">
                {MOCK_SCHOOL.city}, {MOCK_SCHOOL.state}
              </p>
              <p className="text-xs text-grey-text">Nursery · Primary · Secondary</p>
              <p className="mt-1 text-xs font-medium text-dark-blue">
                Application Fee: ₦10,000
              </p>
            </div>
          </div>
          <button className="mt-3 w-full rounded-lg bg-brand-green py-2 text-sm font-medium text-white">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}

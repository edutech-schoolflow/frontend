import { MOCK_CHILDREN } from "@/src/lib/api/mock/data";

export default function ParentDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-brand-green px-4 pt-10 pb-6">
        <p className="text-xs text-white/70">Good morning</p>
        <h1 className="text-lg font-semibold text-white">John Okafor</h1>
      </div>

      <div className="px-4 -mt-4">
        <div className="space-y-3">
          {MOCK_CHILDREN.map((child) => (
            <div
              key={child.studentId}
              className="rounded-xl bg-white p-4 shadow-sm border border-border-default"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-dark-blue">{child.studentName}</p>
                  <p className="text-xs text-grey-text">
                    {child.schoolName} · {child.className}
                  </p>
                </div>
                <div className="flex gap-2">
                  {child.hasNewResult && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                      New Result
                    </span>
                  )}
                  {child.outstandingFees > 0 && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700">
                      Fees Due
                    </span>
                  )}
                </div>
              </div>

              {child.outstandingFees > 0 && (
                <div className="mt-3 rounded-lg bg-orange-50 px-3 py-2">
                  <p className="text-xs text-orange-700">
                    Outstanding fees:{" "}
                    <span className="font-semibold">
                      ₦{child.outstandingFees.toLocaleString()}
                    </span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <button className="mt-4 w-full rounded-xl border-2 border-dashed border-gray-300 py-4 text-sm text-grey-text">
          + Enroll a Child in Another School
        </button>
      </div>
    </div>
  );
}

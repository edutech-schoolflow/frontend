"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  ChevronRight,
} from "lucide-react";
import {
  getMyCheckInStatus,
  getStaffAttendanceSettings,
  staffCheckIn,
} from "@/src/lib/api/staffAttendance";
import { useStaffFeatures } from "@/src/context/StaffFeaturesContext";
import type {
  StaffCheckIn,
  StaffAttendanceSettings,
} from "@/src/types/staffAttendance";

type GeoState = "idle" | "requesting" | "success" | "denied" | "unavailable";

const STATUS_STYLE = {
  present: { bg: "bg-[#f0fdf4]", text: "text-[#16a34a]", label: "Present" },
  late: { bg: "bg-[#fffbeb]", text: "text-[#b45309]", label: "Late" },
  absent: { bg: "bg-[#fef2f2]", text: "text-[#dc2626]", label: "Absent" },
};

export default function StaffCheckInWidget() {
  const { profile, loading: profileLoading } = useStaffFeatures();
  const [checkIn, setCheckIn] = useState<StaffCheckIn | null>(null);
  const [settings, setSettings] = useState<StaffAttendanceSettings | null>(
    null
  );
  const [geoState, setGeoState] = useState<GeoState>("idle");
  const [loaded, setLoaded] = useState(false);

  const effectiveUserId = profile?.staff.userId;

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getMyCheckInStatus(effectiveUserId),
      getStaffAttendanceSettings(),
    ]).then(([status, sett]) => {
      if (cancelled) return;
      setCheckIn(status);
      setSettings(sett);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [effectiveUserId]);

  const handleCheckIn = useCallback(() => {
    const staffId = profile?.staff.id;
    if (!staffId) return;
    if (!navigator.geolocation) {
      setGeoState("unavailable");
      return;
    }
    setGeoState("requesting");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const result = await staffCheckIn(
          { lat: pos.coords.latitude, lng: pos.coords.longitude },
          staffId
        );
        setCheckIn(result);
        setGeoState("success");
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) setGeoState("denied");
        else setGeoState("unavailable");
      },
      { timeout: 10000, maximumAge: 30000 }
    );
  }, [profile?.staff.id]);

  // Demo-only: lets desktop testers simulate a check-in when real GPS is unavailable.
  const handleSimulateCheckIn = useCallback(async () => {
    const staffId = profile?.staff.id;
    if (!staffId) return;
    setGeoState("requesting");
    const result = await staffCheckIn(
      {
        lat: 9.0608 + (Math.random() - 0.5) * 0.001,
        lng: 7.4896 + (Math.random() - 0.5) * 0.001,
      },
      staffId
    );
    setCheckIn(result);
    setGeoState("success");
  }, [profile?.staff.id]);

  if (!loaded) return null;

  const alreadyCheckedIn = !!checkIn;
  const cutoff = settings?.checkInCutoff ?? "08:00";

  return (
    <div className="mb-8 overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white">
      {/* Header bar */}
      <div className="flex items-center gap-2.5 border-b border-[#f3f4f6] bg-[#f9fafb] px-5 py-3">
        <MapPin className="h-[14px] w-[14px] text-brand-green" />
        <p className="text-[13px] font-semibold text-text-heading">
          Staff attendance · Today
        </p>
        {settings && (
          <span className="ml-auto text-[11px] text-text-body">
            Cut-off: {cutoff} · {settings.geofenceRadius}m geo-fence
          </span>
        )}
      </div>

      <div className="px-5 py-4">
        {alreadyCheckedIn ? (
          /* Already checked in */
          <div className="flex items-center gap-4">
            <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#f0fdf4]">
              <CheckCircle2 className="h-[22px] w-[22px] text-[#16a34a]" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-text-heading">
                You&apos;re checked in
              </p>
              <div className="mt-0.5 flex items-center gap-3">
                <span className="flex items-center gap-1 text-[12px] text-text-body">
                  <Clock className="h-[11px] w-[11px]" />
                  {checkIn.checkInTime}
                </span>
                {checkIn.distanceMeters > 0 && (
                  <span className="flex items-center gap-1 text-[12px] text-text-body">
                    <MapPin className="h-[11px] w-[11px]" />
                    {checkIn.distanceMeters}m from school
                  </span>
                )}
              </div>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-[12px] font-semibold ${STATUS_STYLE[checkIn.status].bg} ${STATUS_STYLE[checkIn.status].text}`}
            >
              {STATUS_STYLE[checkIn.status].label}
            </span>
          </div>
        ) : (
          /* Not yet checked in */
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-text-heading">
                You haven&apos;t checked in yet
              </p>
              <p className="mt-0.5 text-[12px] text-text-body">
                Check in before {cutoff} to be marked present. Your location
                will be verified against the school geo-fence.
              </p>

              {geoState === "denied" && (
                <div className="mt-2 flex items-center gap-1.5 text-[12px] text-[#dc2626]">
                  <AlertCircle className="h-[12px] w-[12px]" />
                  Location access denied. Enable it in your browser settings and
                  try again.
                </div>
              )}
              {geoState === "unavailable" && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#dc2626]">
                    <AlertCircle className="h-[12px] w-[12px]" />
                    Location unavailable. Contact admin to mark manually.
                  </div>
                  <button
                    onClick={handleSimulateCheckIn}
                    className="text-[11px] font-medium text-[#9ca3af] underline hover:text-text-body"
                  >
                    Simulate check-in (demo only)
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleCheckIn}
              disabled={geoState === "requesting" || profileLoading}
              className="flex shrink-0 items-center gap-2 rounded-[10px] bg-brand-green px-4 py-2.5 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-60"
            >
              {geoState === "requesting" || profileLoading ? (
                <>
                  <Loader2 className="h-[14px] w-[14px] animate-spin" />
                  {profileLoading ? "Loading…" : "Locating…"}
                </>
              ) : (
                <>
                  <MapPin className="h-[14px] w-[14px]" />
                  Check In
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-[#f3f4f6] px-5 py-2.5">
        <Link
          href="/staff/dashboard/profile"
          className="flex items-center gap-1 text-[12px] text-[#9ca3af] transition-colors hover:text-brand-green"
        >
          View attendance history in My Profile
          <ChevronRight className="h-[12px] w-[12px]" />
        </Link>
      </div>
    </div>
  );
}

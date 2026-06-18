"use client";

export default function StudentAvatar({
  name,
  photoUrl,
  size = 28,
}: {
  name: string;
  photoUrl?: string;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");

  return (
    <div
      className="shrink-0 overflow-hidden rounded-full bg-[#e8f5ee]"
      style={{ width: size, height: size }}
    >
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center text-[#1ca95c]"
          style={{ fontSize: size * 0.38 }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}

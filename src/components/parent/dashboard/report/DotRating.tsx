export default function DotRating({
  score,
  max = 5,
}: {
  score: number;
  max?: number;
}) {
  return (
    <div className="flex gap-[4px]">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className="h-[8px] w-[8px] rounded-full"
          style={{ backgroundColor: i < score ? "#1ca95c" : "#e0e0e0" }}
        />
      ))}
    </div>
  );
}

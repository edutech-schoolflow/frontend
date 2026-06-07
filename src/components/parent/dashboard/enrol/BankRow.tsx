import CopyButton from "./CopyButton";

export default function BankRow({
  label,
  value,
  copyable,
}: {
  label: string;
  value: string;
  copyable?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-[14px]">
      <div className="flex flex-col gap-[2px]">
        <p className="text-[12px] text-[#888]">{label}</p>
        <p className="text-[15px] font-medium text-[#1b1b1b]">{value}</p>
      </div>
      {copyable && <CopyButton text={value} />}
    </div>
  );
}

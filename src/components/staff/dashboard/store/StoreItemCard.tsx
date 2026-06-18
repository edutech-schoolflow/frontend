"use client";

import { Users, Pencil } from "lucide-react";
import { CATEGORY_META, formatNaira } from "@/src/lib/api/store";
import type { StoreItem } from "@/src/types/store";

export default function StoreItemCard({
  item,
  canManage,
  onAssign,
  onEdit,
}: {
  item: StoreItem;
  canManage: boolean;
  onAssign: (item: StoreItem) => void;
  onEdit: (item: StoreItem) => void;
}) {
  const meta = CATEGORY_META[item.category];
  const stockLabel =
    item.stock === null
      ? "Unlimited"
      : item.stock === 0
        ? "Out of stock"
        : `${item.stock} in stock`;
  const stockColor =
    item.stock === 0
      ? "text-[#dc2626]"
      : item.stock !== null && item.stock < 10
        ? "text-[#b45309]"
        : "text-[#6b7280]";

  return (
    <div className="flex flex-col overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white transition-shadow hover:shadow-sm">
      <div className="flex items-center justify-center bg-[#f9fafb] py-7 text-[44px]">
        {item.emoji}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-[14px] font-semibold leading-snug text-text-heading">
            {item.name}
          </p>
          <span
            className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${meta.bg} ${meta.text}`}
          >
            {meta.label}
          </span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[18px] font-bold text-text-heading">
              {formatNaira(item.price)}
            </p>
            <p className="text-[11px] text-[#9ca3af]">per {item.unit}</p>
          </div>
          <p className={`text-[12px] font-medium ${stockColor}`}>
            {stockLabel}
          </p>
        </div>

        {item.description && (
          <p className="text-[12px] leading-relaxed text-text-body line-clamp-2">
            {item.description}
          </p>
        )}

        {canManage && (
          <div className="mt-auto flex gap-2 pt-1">
            <button
              onClick={() => onAssign(item)}
              disabled={item.stock === 0}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-[8px] bg-brand-green px-3 py-2 text-[12px] font-medium text-white hover:bg-[#17904f] disabled:opacity-50 transition-colors"
            >
              <Users className="h-[13px] w-[13px]" />
              Assign to students
            </button>
            <button
              onClick={() => onEdit(item)}
              className="flex items-center justify-center rounded-[8px] border border-[#e5e7eb] px-3 py-2 text-[12px] text-text-body hover:border-[#d1d5db] transition-colors"
            >
              <Pencil className="h-[13px] w-[13px]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

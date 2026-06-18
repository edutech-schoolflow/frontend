"use client";

import { useState } from "react";
import { ShoppingCart, CheckCircle2 } from "lucide-react";
import { CATEGORY_META, formatNaira } from "@/src/lib/api/store";
import type { StoreItem, CartLine } from "@/src/types/store";
import type { ParentChild } from "@/src/types/parent";
import type { CartSelection } from "@/src/hooks/useParentStore";
import ChildPicker from "./ChildPicker";

export default function ParentItemCard({
  item,
  schoolChildren,
  cart,
  onAdd,
}: {
  item: StoreItem;
  schoolChildren: ParentChild[];
  cart: CartLine[];
  onAdd: (selections: CartSelection[]) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const meta = CATEGORY_META[item.category];
  const cartLines = cart.filter((l) => l.storeItem.id === item.id);
  const totalInCart = cartLines.reduce((s, l) => s + l.quantity, 0);
  const outOfStock = item.stock === 0;
  const stockLabel = outOfStock ? "Out of stock" : `${item.stock} in stock`;

  return (
    <div className="relative flex flex-col rounded-[14px] border border-[#e5e7eb] bg-white transition-shadow hover:shadow-sm">
      {totalInCart > 0 && (
        <div className="absolute right-3 top-3 z-10 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-brand-green text-[11px] font-bold text-white shadow">
          {totalInCart}
        </div>
      )}

      <div className="flex items-center justify-center rounded-t-[14px] bg-[#f9fafb] py-7 text-[44px]">
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
          <p
            className={`text-[12px] font-medium ${outOfStock ? "text-[#dc2626]" : "text-[#6b7280]"}`}
          >
            {stockLabel}
          </p>
        </div>

        {item.description && (
          <p className="text-[12px] leading-relaxed text-text-body line-clamp-2">
            {item.description}
          </p>
        )}

        <div className="relative mt-auto pt-1">
          <button
            onClick={() => setPickerOpen((v) => !v)}
            disabled={outOfStock}
            className={`flex w-full items-center justify-center gap-2 rounded-[8px] py-2.5 text-[13px] font-semibold transition-colors disabled:opacity-50 ${
              totalInCart > 0
                ? "border-2 border-brand-green bg-[#e8f5ee] text-brand-green hover:bg-[#d1f0e0]"
                : "bg-brand-green text-white hover:bg-[#17904f]"
            }`}
          >
            {totalInCart > 0 ? (
              <>
                <CheckCircle2 className="h-[14px] w-[14px]" />
                In cart · Edit
              </>
            ) : (
              <>
                <ShoppingCart className="h-[14px] w-[14px]" />
                Add to cart
              </>
            )}
          </button>

          {pickerOpen && (
            <ChildPicker
              item={item}
              schoolChildren={schoolChildren}
              existingLines={cartLines}
              onAdd={(selections) => {
                onAdd(selections);
                setPickerOpen(false);
              }}
              onClose={() => setPickerOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";
import type { StoreItem, CartLine } from "@/src/types/store";
import type { ParentChild } from "@/src/types/parent";
import type { CartSelection } from "@/src/hooks/useParentStore";

const SIZE_GUIDE = [
  { size: "XS", age: "3–4 yrs", height: "98–104 cm", chest: "55 cm" },
  { size: "S", age: "5–6 yrs", height: "110–116 cm", chest: "59 cm" },
  { size: "M", age: "7–8 yrs", height: "122–128 cm", chest: "63 cm" },
  { size: "L", age: "9–10 yrs", height: "134–140 cm", chest: "67 cm" },
  { size: "XL", age: "11–12 yrs", height: "146–152 cm", chest: "71 cm" },
  { size: "XXL", age: "13+ yrs", height: "158+ cm", chest: "75 cm" },
];

export default function ChildPicker({
  item,
  schoolChildren,
  existingLines,
  onAdd,
  onClose,
}: {
  item: StoreItem;
  schoolChildren: ParentChild[];
  existingLines: CartLine[];
  onAdd: (selections: CartSelection[]) => void;
  onClose: () => void;
}) {
  const hasSize = item.category === "uniform" && (item.sizes?.length ?? 0) > 0;

  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      schoolChildren.map((c) => {
        const existing = existingLines.find(
          (l) => l.studentId === c.studentId && l.storeItem.id === item.id
        );
        return [c.studentId, existing?.quantity ?? 1];
      })
    )
  );
  const [selected, setSelected] = useState<Set<string>>(() => {
    const s = new Set<string>();
    for (const line of existingLines) {
      if (line.storeItem.id === item.id) s.add(line.studentId);
    }
    if (s.size === 0 && schoolChildren.length === 1)
      s.add(schoolChildren[0].studentId);
    return s;
  });
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(
        schoolChildren.map((c) => {
          const existing = existingLines.find(
            (l) => l.studentId === c.studentId && l.storeItem.id === item.id
          );
          return [c.studentId, existing?.selectedSize ?? ""];
        })
      )
  );
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  function toggle(studentId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) next.delete(studentId);
      else next.add(studentId);
      return next;
    });
  }

  const sizeIncomplete =
    hasSize && [...selected].some((id) => !selectedSizes[id]);

  function handleAdd() {
    const selections = schoolChildren
      .filter((c) => selected.has(c.studentId))
      .map((c) => ({
        child: c,
        qty: quantities[c.studentId] ?? 1,
        selectedSize: hasSize ? selectedSizes[c.studentId] : undefined,
      }));
    if (selections.length > 0) onAdd(selections);
  }

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute left-0 right-0 top-full z-20 mt-2 rounded-[12px] border border-[#e5e7eb] bg-white p-4 shadow-lg"
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[12px] font-semibold text-text-heading">
          Buy for which child?
        </p>
        {hasSize && (
          <button
            type="button"
            onClick={() => setSizeGuideOpen((v) => !v)}
            className="text-[11px] font-medium text-brand-green hover:underline"
          >
            📏 Size guide {sizeGuideOpen ? "▲" : "▼"}
          </button>
        )}
      </div>

      {/* Size guide table */}
      {hasSize && sizeGuideOpen && (
        <div className="mb-3 overflow-hidden rounded-[8px] border border-[#e5e7eb]">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="bg-[#f9fafb]">
                {["Size", "Age", "Height", "Chest"].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-1.5 text-left font-semibold text-[#6b7280]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZE_GUIDE.map((row, i) => (
                <tr
                  key={row.size}
                  className={i % 2 === 0 ? "bg-white" : "bg-[#f9fafb]"}
                >
                  <td className="px-3 py-1.5 font-semibold text-text-heading">
                    {row.size}
                  </td>
                  <td className="px-3 py-1.5 text-[#6b7280]">{row.age}</td>
                  <td className="px-3 py-1.5 text-[#6b7280]">{row.height}</td>
                  <td className="px-3 py-1.5 text-[#6b7280]">{row.chest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="space-y-2">
        {schoolChildren.map((child) => (
          <div
            key={child.studentId}
            className={`rounded-[8px] border transition-colors ${
              selected.has(child.studentId)
                ? "border-brand-green bg-[#e8f5ee]"
                : "border-[#e5e7eb]"
            }`}
          >
            <label className="flex cursor-pointer items-center gap-3 p-3">
              <input
                type="checkbox"
                checked={selected.has(child.studentId)}
                onChange={() => toggle(child.studentId)}
                className="accent-brand-green"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-text-heading">
                  {child.studentName}
                </p>
                <p className="text-[11px] text-text-body">{child.className}</p>
              </div>
              {selected.has(child.studentId) && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setQuantities((q) => ({
                        ...q,
                        [child.studentId]: Math.max(
                          1,
                          (q[child.studentId] ?? 1) - 1
                        ),
                      }));
                    }}
                    className="flex h-[22px] w-[22px] items-center justify-center rounded-full border border-[#e5e7eb] text-text-body hover:border-[#d1d5db]"
                  >
                    <Minus className="h-[10px] w-[10px]" />
                  </button>
                  <span className="w-[18px] text-center text-[13px] font-semibold text-text-heading">
                    {quantities[child.studentId] ?? 1}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setQuantities((q) => ({
                        ...q,
                        [child.studentId]: (q[child.studentId] ?? 1) + 1,
                      }));
                    }}
                    className="flex h-[22px] w-[22px] items-center justify-center rounded-full border border-[#e5e7eb] text-text-body hover:border-[#d1d5db]"
                  >
                    <Plus className="h-[10px] w-[10px]" />
                  </button>
                </div>
              )}
            </label>

            {/* Size chips */}
            {selected.has(child.studentId) && hasSize && (
              <div className="flex flex-wrap gap-1.5 px-3 pb-3">
                {item.sizes!.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedSizes((prev) => ({
                        ...prev,
                        [child.studentId]: sz,
                      }));
                    }}
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors ${
                      selectedSizes[child.studentId] === sz
                        ? "bg-brand-green text-white"
                        : "border border-[#e5e7eb] text-[#6b7280] hover:border-brand-green hover:text-brand-green"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
                {!selectedSizes[child.studentId] && (
                  <span className="self-center text-[10px] text-[#dc2626]">
                    Select a size
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={handleAdd}
          disabled={selected.size === 0 || sizeIncomplete}
          className="flex-1 rounded-[8px] bg-brand-green py-2 text-[12px] font-semibold text-white hover:bg-[#17904f] disabled:opacity-50 transition-colors"
        >
          Add to cart
        </button>
        <button
          onClick={onClose}
          className="rounded-[8px] border border-[#e5e7eb] px-4 py-2 text-[12px] text-text-body hover:border-[#d1d5db] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

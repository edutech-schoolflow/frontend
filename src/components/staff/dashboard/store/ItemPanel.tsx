"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { CATEGORY_META, STORE_CATEGORIES } from "@/src/lib/api/store";
import type { StoreItem, StoreCategory } from "@/src/types/store";

const EMOJI_SUGGESTIONS = [
  "👕",
  "🎽",
  "👔",
  "📚",
  "📖",
  "📐",
  "🔬",
  "📓",
  "📏",
  "🎒",
  "🧮",
  "🖊️",
  "📦",
  "🧪",
  "🗂️",
  "💼",
];

const UNIT_OPTIONS = [
  "piece",
  "pair",
  "set",
  "copy",
  "pack",
  "bundle",
  "dozen",
  "roll",
  "ream",
  "box",
];

export default function ItemPanel({
  initial,
  onSave,
  onClose,
}: {
  initial?: StoreItem;
  onSave: (
    data: Omit<StoreItem, "id" | "createdAt" | "schoolId">
  ) => Promise<void>;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState<StoreCategory>(
    initial?.category ?? "other"
  );
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [unit, setUnit] = useState(initial?.unit ?? "piece");
  const [emoji, setEmoji] = useState(initial?.emoji ?? "📦");
  const [stockStr, setStockStr] = useState(
    initial?.stock != null ? String(initial.stock) : ""
  );
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [sizesStr, setSizesStr] = useState(initial?.sizes?.join(", ") ?? "");
  const [saving, setSaving] = useState(false);

  const parsedSizes = sizesStr
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  async function handleSave() {
    if (!name.trim() || !price) return;
    setSaving(true);
    await onSave({
      name: name.trim(),
      description: description.trim(),
      category,
      price: Math.round(parseFloat(price)),
      unit: unit.trim() || "piece",
      emoji,
      stock: parseInt(stockStr) || 0,
      isActive,
      ...(category === "uniform" && parsedSizes.length > 0
        ? { sizes: parsedSizes }
        : {}),
    });
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <div className="flex h-full w-full max-w-[480px] flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#f3f4f6] px-6 py-4">
          <p className="text-[15px] font-semibold text-text-heading">
            {initial ? "Edit item" : "Add new item"}
          </p>
          <button
            onClick={onClose}
            className="text-[#9ca3af] hover:text-text-heading"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Emoji picker */}
          <div>
            <p className="mb-2 text-[12px] font-semibold text-text-heading">
              Icon
            </p>
            <div className="flex flex-wrap gap-2">
              {EMOJI_SUGGESTIONS.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`flex h-[38px] w-[38px] items-center justify-center rounded-[8px] border text-[20px] transition-colors ${
                    emoji === e
                      ? "border-brand-green bg-[#e8f5ee]"
                      : "border-[#e5e7eb] hover:border-[#d1d5db]"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-text-heading">
              Item name <span className="text-[#dc2626]">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Winter Uniform"
              className="w-full rounded-[8px] border border-[#e5e7eb] px-3 py-2 text-[13px] text-text-heading focus:border-brand-green focus:outline-none"
            />
          </div>

          {/* Category + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-text-heading">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as StoreCategory)}
                className="w-full rounded-[8px] border border-[#e5e7eb] bg-white px-3 py-2 text-[13px] text-text-heading focus:border-brand-green focus:outline-none"
              >
                {STORE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_META[c].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-text-heading">
                Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full rounded-[8px] border border-[#e5e7eb] bg-white px-3 py-2 text-[13px] text-text-heading focus:border-brand-green focus:outline-none"
              >
                {UNIT_OPTIONS.map((u) => (
                  <option key={u} value={u}>
                    {u.charAt(0).toUpperCase() + u.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-text-heading">
              Price (₦) <span className="text-[#dc2626]">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[#9ca3af]">
                ₦
              </span>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                className="w-full rounded-[8px] border border-[#e5e7eb] py-2 pl-7 pr-3 text-[13px] text-text-heading focus:border-brand-green focus:outline-none"
              />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-text-heading">
              Stock quantity <span className="text-[#dc2626]">*</span>
            </label>
            <input
              type="number"
              min="0"
              value={stockStr}
              onChange={(e) => setStockStr(e.target.value)}
              placeholder="e.g. 50"
              className="w-full rounded-[8px] border border-[#e5e7eb] px-3 py-2 text-[13px] text-text-heading focus:border-brand-green focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-text-heading">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Brief description shown to parents and staff…"
              className="w-full resize-none rounded-[8px] border border-[#e5e7eb] px-3 py-2 text-[13px] text-text-heading focus:border-brand-green focus:outline-none"
            />
          </div>

          {/* Sizes — uniform only */}
          {category === "uniform" && (
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-text-heading">
                Available sizes
              </label>
              <input
                value={sizesStr}
                onChange={(e) => setSizesStr(e.target.value)}
                placeholder="e.g. XS, S, M, L, XL, XXL"
                className="w-full rounded-[8px] border border-[#e5e7eb] px-3 py-2 text-[13px] text-text-heading focus:border-brand-green focus:outline-none"
              />
              {parsedSizes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {parsedSizes.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-[#e8f5ee] px-2.5 py-0.5 text-[11px] font-semibold text-brand-green"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-1 text-[11px] text-[#9ca3af]">
                Separate sizes with commas. Parents will choose a size when
                adding to cart.
              </p>
            </div>
          )}

          {/* Active toggle */}
          {initial && (
            <label className="flex cursor-pointer items-center gap-3">
              <div
                onClick={() => setIsActive((v) => !v)}
                className={`relative h-[22px] w-[40px] rounded-full transition-colors ${isActive ? "bg-brand-green" : "bg-[#d1d5db]"}`}
              >
                <div
                  className={`absolute top-[2px] h-[18px] w-[18px] rounded-full bg-white shadow transition-transform ${isActive ? "translate-x-[19px]" : "translate-x-[2px]"}`}
                />
              </div>
              <span className="text-[13px] text-text-heading">
                {isActive
                  ? "Active — visible in store"
                  : "Inactive — hidden from store"}
              </span>
            </label>
          )}
        </div>

        <div className="flex gap-3 border-t border-[#f3f4f6] px-6 py-4">
          <button
            onClick={handleSave}
            disabled={saving || !name.trim() || !price}
            className="flex flex-1 items-center justify-center gap-2 rounded-[8px] bg-brand-green py-2.5 text-[13px] font-medium text-white hover:bg-[#17904f] disabled:opacity-60 transition-colors"
          >
            {saving && <Loader2 className="h-[14px] w-[14px] animate-spin" />}
            {saving ? "Saving…" : initial ? "Save changes" : "Add item"}
          </button>
          <button
            onClick={onClose}
            className="rounded-[8px] border border-[#e5e7eb] px-5 py-2.5 text-[13px] text-text-body hover:border-[#d1d5db] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  X,
  CheckCircle2,
  Package,
  Search,
} from "lucide-react";
import {
  getStoreItemsForSchool,
  getParentChildren,
  parentPurchaseItems,
  formatNaira,
  CATEGORY_META,
  STORE_CATEGORIES,
  type ParentCartLine,
} from "@/src/lib/api/store";
import type { StoreItem, StoreCategory } from "@/src/types/store";
import type { ParentChild } from "@/src/types/parent";

// ── Types ──────────────────────────────────────────────────────────────────────

interface CartLine {
  storeItem: StoreItem;
  studentId: string;
  studentName: string;
  schoolId: string;
  schoolName: string;
  quantity: number;
}

// Group children by school
function groupBySchool(children: ParentChild[]): Map<string, ParentChild[]> {
  const map = new Map<string, ParentChild[]>();
  for (const child of children) {
    if (!map.has(child.schoolId)) map.set(child.schoolId, []);
    map.get(child.schoolId)!.push(child);
  }
  return map;
}

// ── Cart panel ─────────────────────────────────────────────────────────────────

function CartPanel({
  cart,
  onUpdateQty,
  onRemove,
  onCheckout,
  onClose,
}: {
  cart: CartLine[];
  onUpdateQty: (studentId: string, itemId: string, qty: number) => void;
  onRemove: (studentId: string, itemId: string) => void;
  onCheckout: () => void;
  onClose: () => void;
}) {
  const grandTotal = cart.reduce(
    (s, l) => s + l.storeItem.price * l.quantity,
    0
  );

  // Group by student
  const byStudent = new Map<string, CartLine[]>();
  for (const line of cart) {
    if (!byStudent.has(line.studentId)) byStudent.set(line.studentId, []);
    byStudent.get(line.studentId)!.push(line);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-[420px] flex-col bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f3f4f6] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="h-[18px] w-[18px] text-brand-green" />
            <p className="text-[15px] font-semibold text-text-heading">
              Cart
              <span className="ml-2 text-[12px] font-normal text-text-body">
                {cart.length} item{cart.length !== 1 ? "s" : ""}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#9ca3af] hover:text-text-heading"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* Items grouped by child */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Package className="mb-3 h-[32px] w-[32px] text-[#d1d5db]" />
              <p className="text-[14px] text-[#9ca3af]">Your cart is empty</p>
            </div>
          ) : (
            Array.from(byStudent.entries()).map(([studentId, lines]) => {
              const subtotal = lines.reduce(
                (s, l) => s + l.storeItem.price * l.quantity,
                0
              );
              return (
                <div key={studentId}>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#e8f5ee] text-[11px] font-bold text-brand-green">
                        {lines[0].studentName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-text-heading">
                          {lines[0].studentName}
                        </p>
                        <p className="text-[11px] text-text-body">
                          {lines[0].schoolName}
                        </p>
                      </div>
                    </div>
                    <p className="text-[12px] font-semibold text-text-heading">
                      {formatNaira(subtotal)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {lines.map((line) => (
                      <div
                        key={line.storeItem.id}
                        className="flex items-center gap-3 rounded-[10px] border border-[#f3f4f6] bg-[#fafafa] p-3"
                      >
                        <span className="text-[24px]">
                          {line.storeItem.emoji}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-[12px] font-medium text-text-heading">
                            {line.storeItem.name}
                          </p>
                          <p className="text-[11px] text-text-body">
                            {formatNaira(line.storeItem.price)} /{" "}
                            {line.storeItem.unit}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              line.quantity > 1
                                ? onUpdateQty(
                                    studentId,
                                    line.storeItem.id,
                                    line.quantity - 1
                                  )
                                : onRemove(studentId, line.storeItem.id)
                            }
                            className="flex h-[24px] w-[24px] items-center justify-center rounded-full border border-[#e5e7eb] text-text-body hover:border-[#d1d5db] transition-colors"
                          >
                            {line.quantity === 1 ? (
                              <Trash2 className="h-[11px] w-[11px] text-[#dc2626]" />
                            ) : (
                              <Minus className="h-[11px] w-[11px]" />
                            )}
                          </button>
                          <span className="w-[20px] text-center text-[13px] font-semibold text-text-heading">
                            {line.quantity}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateQty(
                                studentId,
                                line.storeItem.id,
                                line.quantity + 1
                              )
                            }
                            className="flex h-[24px] w-[24px] items-center justify-center rounded-full border border-[#e5e7eb] text-text-body hover:border-[#d1d5db] transition-colors"
                          >
                            <Plus className="h-[11px] w-[11px]" />
                          </button>
                        </div>
                        <p className="w-[64px] text-right text-[12px] font-semibold text-text-heading">
                          {formatNaira(line.storeItem.price * line.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-[#f3f4f6] px-6 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[13px] text-text-body">Grand total</p>
              <p className="text-[20px] font-bold text-text-heading">
                {formatNaira(grandTotal)}
              </p>
            </div>
            <p className="text-[11px] text-text-body">
              This amount will be added to your children&apos;s school fee
              invoices.
            </p>
            <button
              onClick={onCheckout}
              className="w-full rounded-[10px] bg-brand-green py-3 text-[14px] font-semibold text-white hover:bg-[#17904f] transition-colors"
            >
              Confirm purchase · {formatNaira(grandTotal)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Child picker (inline, below item card) ─────────────────────────────────────

function ChildPicker({
  item,
  schoolChildren,
  existingLines,
  onAdd,
  onClose,
}: {
  item: StoreItem;
  schoolChildren: ParentChild[];
  existingLines: CartLine[];
  onAdd: (selections: { child: ParentChild; qty: number }[]) => void;
  onClose: () => void;
}) {
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

  function toggle(studentId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) next.delete(studentId);
      else next.add(studentId);
      return next;
    });
  }

  function handleAdd() {
    const selections = schoolChildren
      .filter((c) => selected.has(c.studentId))
      .map((c) => ({ child: c, qty: quantities[c.studentId] ?? 1 }));
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
      <p className="mb-3 text-[12px] font-semibold text-text-heading">
        Buy for which child?
      </p>
      <div className="space-y-2">
        {schoolChildren.map((child) => (
          <label
            key={child.studentId}
            className={`flex cursor-pointer items-center gap-3 rounded-[8px] border p-3 transition-colors ${
              selected.has(child.studentId)
                ? "border-brand-green bg-[#e8f5ee]"
                : "border-[#e5e7eb] hover:border-[#d1d5db]"
            }`}
          >
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
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={handleAdd}
          disabled={selected.size === 0}
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

// ── Item card (parent view) ────────────────────────────────────────────────────

function ParentItemCard({
  item,
  schoolChildren,
  cart,
  onAdd,
}: {
  item: StoreItem;
  schoolChildren: ParentChild[];
  cart: CartLine[];
  onAdd: (selections: { child: ParentChild; qty: number }[]) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const meta = CATEGORY_META[item.category];
  const cartLines = cart.filter((l) => l.storeItem.id === item.id);
  const totalInCart = cartLines.reduce((s, l) => s + l.quantity, 0);

  const stockLabel =
    item.stock === 0 ? "Out of stock" : `${item.stock} in stock`;
  const outOfStock = item.stock === 0;

  return (
    <div className="relative flex flex-col rounded-[14px] border border-[#e5e7eb] bg-white transition-shadow hover:shadow-sm">
      {/* In-cart badge */}
      {totalInCart > 0 && (
        <div className="absolute right-3 top-3 z-10 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-brand-green text-[11px] font-bold text-white shadow">
          {totalInCart}
        </div>
      )}

      {/* Emoji header */}
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
            className={`text-[12px] font-medium ${
              outOfStock ? "text-[#dc2626]" : "text-[#6b7280]"
            }`}
          >
            {stockLabel}
          </p>
        </div>

        {item.description && (
          <p className="text-[12px] leading-relaxed text-text-body line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Add to cart button + picker */}
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

// ── Success screen ─────────────────────────────────────────────────────────────

function SuccessScreen({
  lines,
  onDone,
}: {
  lines: CartLine[];
  onDone: () => void;
}) {
  const total = lines.reduce((s, l) => s + l.storeItem.price * l.quantity, 0);
  const byStudent = new Map<string, CartLine[]>();
  for (const line of lines) {
    if (!byStudent.has(line.studentId)) byStudent.set(line.studentId, []);
    byStudent.get(line.studentId)!.push(line);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-[440px] rounded-[20px] bg-white p-8 shadow-xl">
        <div className="mb-5 flex flex-col items-center text-center">
          <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#f0fdf4]">
            <CheckCircle2 className="h-[30px] w-[30px] text-[#16a34a]" />
          </div>
          <p className="mt-4 text-[18px] font-bold text-text-heading">
            Purchase confirmed!
          </p>
          <p className="mt-1.5 text-[13px] text-text-body">
            Items have been added to your children&apos;s school invoices. Pay
            through the Fees section when ready.
          </p>
        </div>

        <div className="mb-5 space-y-4 rounded-[12px] border border-[#e5e7eb] p-4">
          {Array.from(byStudent.entries()).map(([studentId, sLines]) => (
            <div key={studentId}>
              <p className="mb-2 text-[12px] font-semibold text-text-heading">
                {sLines[0].studentName}
              </p>
              {sLines.map((l) => (
                <div
                  key={l.storeItem.id}
                  className="flex items-center justify-between py-1"
                >
                  <span className="text-[12px] text-text-body">
                    {l.storeItem.emoji} {l.storeItem.name} × {l.quantity}
                  </span>
                  <span className="text-[12px] font-medium text-text-heading">
                    {formatNaira(l.storeItem.price * l.quantity)}
                  </span>
                </div>
              ))}
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-[#f3f4f6] pt-3">
            <p className="text-[13px] font-semibold text-text-heading">
              Total added to fees
            </p>
            <p className="text-[16px] font-bold text-brand-green">
              {formatNaira(total)}
            </p>
          </div>
        </div>

        <button
          onClick={onDone}
          className="w-full rounded-[10px] bg-brand-green py-3 text-[14px] font-semibold text-white hover:bg-[#17904f] transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ParentStorePage() {
  const [children, setChildren] = useState<ParentChild[]>([]);
  const [itemsBySchool, setItemsBySchool] = useState<Map<string, StoreItem[]>>(
    new Map()
  );
  const [loaded, setLoaded] = useState(false);

  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<StoreCategory | "all">(
    "all"
  );
  const [search, setSearch] = useState("");

  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [successLines, setSuccessLines] = useState<CartLine[] | null>(null);

  const load = useCallback(() => {
    getParentChildren().then((childList) => {
      setChildren(childList);
      const schoolIds = [...new Set(childList.map((c) => c.schoolId))];
      Promise.all(schoolIds.map((id) => getStoreItemsForSchool(id))).then(
        (results) => {
          const map = new Map<string, StoreItem[]>();
          schoolIds.forEach((id, i) => map.set(id, results[i]));
          setItemsBySchool(map);
          if (schoolIds.length > 0) setSelectedSchoolId(schoolIds[0]);
          setLoaded(true);
        }
      );
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const schoolGroups = groupBySchool(children);
  const schoolIds = [...schoolGroups.keys()];

  const currentItems = (itemsBySchool.get(selectedSchoolId) ?? []).filter(
    (item) => {
      if (categoryFilter !== "all" && item.category !== categoryFilter)
        return false;
      if (search && !item.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    }
  );

  const childrenAtSchool = schoolGroups.get(selectedSchoolId) ?? [];

  function handleAdd(
    item: StoreItem,
    schoolName: string,
    selections: { child: ParentChild; qty: number }[]
  ) {
    setCart((prev) => {
      const next = [...prev];
      for (const { child, qty } of selections) {
        const idx = next.findIndex(
          (l) => l.storeItem.id === item.id && l.studentId === child.studentId
        );
        if (idx >= 0) {
          next[idx] = { ...next[idx], quantity: qty };
        } else {
          next.push({
            storeItem: item,
            studentId: child.studentId,
            studentName: child.studentName,
            schoolId: child.schoolId,
            schoolName,
            quantity: qty,
          });
        }
      }
      // remove lines where qty was set to 0 somehow
      return next.filter((l) => l.quantity > 0);
    });
  }

  function updateQty(studentId: string, itemId: string, qty: number) {
    setCart((prev) =>
      prev.map((l) =>
        l.studentId === studentId && l.storeItem.id === itemId
          ? { ...l, quantity: qty }
          : l
      )
    );
  }

  function removeLine(studentId: string, itemId: string) {
    setCart((prev) =>
      prev.filter(
        (l) => !(l.studentId === studentId && l.storeItem.id === itemId)
      )
    );
  }

  async function handleCheckout() {
    const lines: ParentCartLine[] = cart.map((l) => ({
      storeItem: l.storeItem,
      studentId: l.studentId,
      studentName: l.studentName,
      schoolId: l.schoolId,
      schoolName: l.schoolName,
      quantity: l.quantity,
    }));
    await parentPurchaseItems(lines);
    setCartOpen(false);
    setSuccessLines([...cart]);
    setCart([]);
  }

  const cartCount = cart.reduce((s, l) => s + l.quantity, 0);

  // find school name for current school
  const currentSchoolName =
    children.find((c) => c.schoolId === selectedSchoolId)?.schoolName ?? "";

  if (!loaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-[28px] w-[28px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
      </div>
    );
  }

  if (schoolIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-[30px] py-24">
        <Package className="mb-4 h-[40px] w-[40px] text-[#d1d5db]" />
        <p className="text-[16px] font-semibold text-text-heading">
          No stores available
        </p>
        <p className="mt-1 text-[13px] text-text-body">
          Your children&apos;s schools haven&apos;t set up a store yet.
        </p>
      </div>
    );
  }

  return (
    <div className="p-[30px]">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-text-heading">
            School Store
          </h1>
          <p className="mt-0.5 text-[14px] text-text-body">
            Browse and purchase items from your children&apos;s schools. Costs
            are added directly to their fee invoices.
          </p>
        </div>

        {/* Cart button */}
        <button
          onClick={() => setCartOpen(true)}
          className="relative flex shrink-0 items-center gap-2 rounded-[10px] border border-[#e5e7eb] bg-white px-4 py-2.5 text-[13px] font-medium text-text-heading hover:border-[#d1d5db] transition-colors"
        >
          <ShoppingCart className="h-[16px] w-[16px]" />
          Cart
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-brand-green text-[10px] font-bold text-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* School tabs — only shown when parent has children in multiple schools */}
      {schoolIds.length > 1 && (
        <div className="mb-6 flex gap-2 flex-wrap">
          {schoolIds.map((schoolId) => {
            const child = children.find((c) => c.schoolId === schoolId);
            const itemCount = itemsBySchool.get(schoolId)?.length ?? 0;
            return (
              <button
                key={schoolId}
                onClick={() => {
                  setSelectedSchoolId(schoolId);
                  setCategoryFilter("all");
                  setSearch("");
                }}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-medium transition-colors ${
                  selectedSchoolId === schoolId
                    ? "bg-brand-green text-white"
                    : "border border-[#e5e7eb] text-text-body hover:border-[#d1d5db]"
                }`}
              >
                {child?.schoolName}
                <span
                  className={`rounded-full px-2 py-px text-[11px] ${
                    selectedSchoolId === schoolId
                      ? "bg-white/20 text-white"
                      : "bg-[#f3f4f6] text-[#6b7280]"
                  }`}
                >
                  {itemCount}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* School name when only one school */}
      {schoolIds.length === 1 && (
        <p className="mb-5 text-[13px] font-medium text-text-body">
          {currentSchoolName}
        </p>
      )}

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-[#9ca3af]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items…"
            className="w-full rounded-[8px] border border-[#e5e7eb] py-2 pl-9 pr-3 text-[13px] focus:border-brand-green focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", ...STORE_CATEGORIES] as const).map((c) => {
            const active = categoryFilter === c;
            const label = c === "all" ? "All" : CATEGORY_META[c].label;
            return (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                  active
                    ? "bg-brand-green text-white"
                    : "border border-[#e5e7eb] text-text-body hover:border-[#d1d5db]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {currentItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[14px] border border-dashed border-[#e5e7eb] py-20">
          <Package className="mb-3 h-[32px] w-[32px] text-[#d1d5db]" />
          <p className="text-[14px] text-[#9ca3af]">
            {search || categoryFilter !== "all"
              ? "No items match your filters"
              : "No items available in this store yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {currentItems.map((item) => (
            <ParentItemCard
              key={item.id}
              item={item}
              schoolChildren={childrenAtSchool}
              cart={cart}
              onAdd={(selections) =>
                handleAdd(item, currentSchoolName, selections)
              }
            />
          ))}
        </div>
      )}

      {/* Cart panel */}
      {cartOpen && (
        <CartPanel
          cart={cart}
          onUpdateQty={updateQty}
          onRemove={removeLine}
          onCheckout={handleCheckout}
          onClose={() => setCartOpen(false)}
        />
      )}

      {/* Success screen */}
      {successLines && (
        <SuccessScreen
          lines={successLines}
          onDone={() => setSuccessLines(null)}
        />
      )}
    </div>
  );
}

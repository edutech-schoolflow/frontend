"use client";

import { useState } from "react";
import { ShoppingCart, Package, Search } from "lucide-react";
import { CATEGORY_META, STORE_CATEGORIES } from "@/src/lib/api/store";
import type { StoreCategory } from "@/src/types/store";
import { useParentStore } from "@/src/hooks/useParentStore";
import CartPanel from "@/src/components/parent/dashboard/store/CartPanel";
import ParentItemCard from "@/src/components/parent/dashboard/store/ParentItemCard";
import SuccessScreen from "@/src/components/parent/dashboard/store/SuccessScreen";

export default function ParentStorePage() {
  const store = useParentStore();
  const [categoryFilter, setCategoryFilter] = useState<StoreCategory | "all">(
    "all"
  );
  const [search, setSearch] = useState("");

  const currentItems = (
    store.itemsBySchool.get(store.selectedSchoolId) ?? []
  ).filter((item) => {
    if (categoryFilter !== "all" && item.category !== categoryFilter)
      return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  if (!store.loaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-[28px] w-[28px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
      </div>
    );
  }

  if (store.schoolIds.length === 0) {
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
        <button
          onClick={store.openCart}
          className="relative flex shrink-0 items-center gap-2 rounded-[10px] border border-[#e5e7eb] bg-white px-4 py-2.5 text-[13px] font-medium text-text-heading hover:border-[#d1d5db] transition-colors"
        >
          <ShoppingCart className="h-[16px] w-[16px]" />
          Cart
          {store.cartCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-brand-green text-[10px] font-bold text-white">
              {store.cartCount}
            </span>
          )}
        </button>
      </div>

      {/* School tabs — only when children attend multiple schools */}
      {store.schoolIds.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {store.schoolIds.map((schoolId) => {
            const child = store.children.find((c) => c.schoolId === schoolId);
            const itemCount = store.itemsBySchool.get(schoolId)?.length ?? 0;
            return (
              <button
                key={schoolId}
                onClick={() => {
                  store.selectSchool(schoolId);
                  setCategoryFilter("all");
                  setSearch("");
                }}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-medium transition-colors ${
                  store.selectedSchoolId === schoolId
                    ? "bg-brand-green text-white"
                    : "border border-[#e5e7eb] text-text-body hover:border-[#d1d5db]"
                }`}
              >
                {child?.schoolName}
                <span
                  className={`rounded-full px-2 py-px text-[11px] ${store.selectedSchoolId === schoolId ? "bg-white/20 text-white" : "bg-[#f3f4f6] text-[#6b7280]"}`}
                >
                  {itemCount}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {store.schoolIds.length === 1 && (
        <p className="mb-5 text-[13px] font-medium text-text-body">
          {store.currentSchoolName}
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
          {(["all", ...STORE_CATEGORIES] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                categoryFilter === c
                  ? "bg-brand-green text-white"
                  : "border border-[#e5e7eb] text-text-body hover:border-[#d1d5db]"
              }`}
            >
              {c === "all" ? "All" : CATEGORY_META[c].label}
            </button>
          ))}
        </div>
      </div>

      {/* Item grid */}
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
              schoolChildren={store.childrenAtSchool}
              cart={store.cart}
              onAdd={(selections) =>
                store.addToCart(item, store.currentSchoolName, selections)
              }
            />
          ))}
        </div>
      )}

      {store.cartOpen && (
        <CartPanel
          cart={store.cart}
          onUpdateQty={store.updateQty}
          onRemove={store.removeLine}
          onCheckout={store.handleCheckout}
          onClose={store.closeCart}
        />
      )}

      {store.successLines && (
        <SuccessScreen lines={store.successLines} onDone={store.clearSuccess} />
      )}
    </div>
  );
}

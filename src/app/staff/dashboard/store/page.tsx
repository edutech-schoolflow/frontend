"use client";

import { useState } from "react";
import { Package, Plus, Search } from "lucide-react";
import { CATEGORY_META, STORE_CATEGORIES } from "@/src/lib/api/store";
import type { StoreItem, StoreCategory } from "@/src/types/store";
import { useStaffStore } from "@/src/hooks/useStaffStore";
import StoreItemCard from "@/src/components/staff/dashboard/store/StoreItemCard";
import ItemPanel from "@/src/components/staff/dashboard/store/ItemPanel";
import AssignModal from "@/src/components/staff/dashboard/store/AssignModal";
import AssignmentsTab from "@/src/components/staff/dashboard/store/AssignmentsTab";

type Tab = "catalog" | "assignments";

export default function SchoolStorePage() {
  const store = useStaffStore();

  const [tab, setTab] = useState<Tab>("catalog");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<StoreCategory | "all">(
    "all"
  );
  const [addingItem, setAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<StoreItem | null>(null);
  const [assigningItem, setAssigningItem] = useState<StoreItem | null>(null);

  const visibleItems = store.items.filter((item) => {
    if (!item.isActive && !store.canManage) return false;
    if (categoryFilter !== "all" && item.category !== categoryFilter)
      return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const tabCls = (t: Tab) =>
    `px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 ${
      tab === t
        ? "border-brand-green text-brand-green"
        : "border-transparent text-text-body hover:text-text-heading"
    }`;

  return (
    <div className="p-[30px]">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-text-heading">
            School Store
          </h1>
          <p className="mt-0.5 text-[14px] text-text-body">
            Manage uniforms, books, and materials — assign items to students and
            bill them through their invoices.
          </p>
        </div>
        {store.canManage && (
          <button
            onClick={() => setAddingItem(true)}
            className="flex shrink-0 items-center gap-2 rounded-[8px] bg-brand-green px-4 py-2.5 text-[13px] font-medium text-white hover:bg-[#17904f] transition-colors"
          >
            <Plus className="h-[14px] w-[14px]" />
            Add item
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex border-b border-[#e5e7eb]">
        <button className={tabCls("catalog")} onClick={() => setTab("catalog")}>
          Catalog
          {store.items.length > 0 && (
            <span className="ml-1.5 rounded-full bg-[#f3f4f6] px-2 py-px text-[11px] text-[#6b7280]">
              {store.items.filter((i) => i.isActive).length}
            </span>
          )}
        </button>
        <button
          className={tabCls("assignments")}
          onClick={() => setTab("assignments")}
        >
          Assignments
          {store.assignments.length > 0 && (
            <span className="ml-1.5 rounded-full bg-[#f3f4f6] px-2 py-px text-[11px] text-[#6b7280]">
              {store.assignments.length}
            </span>
          )}
        </button>
      </div>

      {!store.loaded ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-[28px] w-[28px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
        </div>
      ) : tab === "catalog" ? (
        <>
          {/* Filters */}
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
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

          {/* Grid */}
          {visibleItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[14px] border border-dashed border-[#e5e7eb] py-20">
              <Package className="mb-3 h-[32px] w-[32px] text-[#d1d5db]" />
              <p className="text-[14px] text-[#9ca3af]">
                {search || categoryFilter !== "all"
                  ? "No items match your filters"
                  : "No items in the store yet"}
              </p>
              {store.canManage && !search && categoryFilter === "all" && (
                <button
                  onClick={() => setAddingItem(true)}
                  className="mt-4 flex items-center gap-1.5 rounded-[8px] bg-brand-green px-4 py-2 text-[13px] font-medium text-white hover:bg-[#17904f] transition-colors"
                >
                  <Plus className="h-[13px] w-[13px]" /> Add your first item
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleItems.map((item) => (
                <StoreItemCard
                  key={item.id}
                  item={item}
                  canManage={store.canManage}
                  onAssign={setAssigningItem}
                  onEdit={setEditingItem}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <AssignmentsTab
          assignments={store.assignments}
          students={store.students}
        />
      )}

      {addingItem && (
        <ItemPanel
          onSave={async (data) => {
            await store.handleCreateItem(data);
            setAddingItem(false);
          }}
          onClose={() => setAddingItem(false)}
        />
      )}

      {editingItem && (
        <ItemPanel
          initial={editingItem}
          onSave={async (data) => {
            await store.handleEditItem(editingItem.id, data);
            setEditingItem(null);
          }}
          onClose={() => setEditingItem(null)}
        />
      )}

      {assigningItem && (
        <AssignModal
          item={assigningItem}
          classes={store.classes}
          students={store.students}
          onConfirm={(target, qty, note) =>
            store.handleAssign(assigningItem, target, qty, note)
          }
          onClose={() => setAssigningItem(null)}
        />
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, UserRound, X } from "lucide-react";
import ChildInfoForm, {
  type ChildInfoValues,
} from "@/src/components/shared/ChildInfoForm";
import { getChildProfiles } from "@/src/lib/api/parents";
import type { ChildProfile } from "@/src/types/parent";

type Child = ChildProfile;

// ─── child card ───────────────────────────────────────────────────────────────

function ChildCard({ child, onEdit }: { child: Child; onEdit: () => void }) {
  const fullName = [child.firstName, child.middleName, child.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-[12px] rounded-[10px] border border-[#ccc] p-[20px]">
      <div className="h-[64px] w-[64px] overflow-hidden rounded-full border border-[#eee] bg-[#f5f5f5]">
        {child.photoUrl ? (
          <img
            src={child.photoUrl}
            alt={fullName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <UserRound className="h-[32px] w-[32px] text-[#ccc]" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-[3px]">
        <p className="text-[16px] font-medium text-[#1b1b1b]">{fullName}</p>
        <p className="text-[14px] text-[#666]">{child.desiredClass}</p>
        {child.previousSchool && (
          <p className="text-[14px] text-[#666]">{child.previousSchool}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="mt-auto text-left text-[14px] text-[#ff8d28] hover:underline"
      >
        View/edit details
      </button>
    </div>
  );
}

// ─── edit modal ───────────────────────────────────────────────────────────────

function EditModal({
  child,
  onSave,
  onClose,
}: {
  child: Child;
  onSave: (
    id: string,
    values: ChildInfoValues,
    photo: File | null,
    birthCert: File | null
  ) => void;
  onClose: () => void;
}) {
  const fullName = [child.firstName, child.middleName, child.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-10">
      <div className="w-full max-w-[860px] rounded-[10px] bg-white">
        {/* Modal header */}
        <div className="flex items-center justify-between border-b border-[#eee] px-[44px] py-[24px]">
          <div className="flex items-center gap-[12px]">
            <div className="h-[40px] w-[40px] overflow-hidden rounded-full border border-[#eee] bg-[#f5f5f5]">
              {child.photoUrl ? (
                <img
                  src={child.photoUrl}
                  alt={fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <UserRound className="h-[20px] w-[20px] text-[#ccc]" />
                </div>
              )}
            </div>
            <p className="text-[18px] font-medium text-[#1b1b1b]">{fullName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[32px] w-[32px] items-center justify-center rounded-full hover:bg-[#f5f5f5] transition-colors"
          >
            <X className="h-[18px] w-[18px] text-[#666]" />
          </button>
        </div>

        {/* Form */}
        <div className="px-[44px] py-[32px]">
          <ChildInfoForm
            submitLabel="Save changes"
            defaultValues={child}
            existingPhotoUrl={child.photoUrl}
            onSubmit={(values, photo, birthCert) =>
              onSave(child.id, values, photo, birthCert)
            }
          />
        </div>
      </div>
    </div>
  );
}

// ─── empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center gap-[16px] py-[80px]">
      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#f5f5f5]">
        <UserRound className="h-[36px] w-[36px] text-[#ccc]" />
      </div>
      <div className="flex flex-col items-center gap-[6px] text-center">
        <p className="text-[16px] font-medium text-[#1b1b1b]">
          No children added yet
        </p>
        <p className="text-[14px] text-[#888]">
          Add your child&apos;s details to keep their profile in one place.
        </p>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="flex h-[46px] items-center gap-[8px] rounded-[8px] bg-[#1ca95c] px-[24px] text-[14px] text-white transition-opacity hover:opacity-90"
      >
        <Plus className="h-[16px] w-[16px]" />
        Add a child
      </button>
    </div>
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────

export default function ParentMyChildren() {
  const [children, setChildren] = useState<Child[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);

  useEffect(() => {
    getChildProfiles().then(setChildren);
  }, []);

  const handleAdd = (values: ChildInfoValues, photo: File | null) => {
    const photoUrl = photo ? URL.createObjectURL(photo) : null;
    setChildren((prev) => [
      ...prev,
      { ...values, id: crypto.randomUUID(), photoUrl },
    ]);
    setShowForm(false);
  };

  const handleUpdate = (
    id: string,
    values: ChildInfoValues,
    photo: File | null
  ) => {
    setChildren((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...values,
              id,
              photoUrl: photo ? URL.createObjectURL(photo) : c.photoUrl,
            }
          : c
      )
    );
    setEditingChild(null);
  };

  return (
    <div className="px-[88px] py-[31px] pb-[60px]">
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-medium text-[#1b1b1b]">My children</h1>
        {children.length > 0 && !showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex h-[40px] items-center gap-[7px] rounded-[8px] bg-[#1ca95c] px-[18px] text-[13px] text-white transition-opacity hover:opacity-90"
          >
            <Plus className="h-[14px] w-[14px]" />
            Add a child
          </button>
        )}
      </div>

      {children.length === 0 && !showForm && (
        <EmptyState onAdd={() => setShowForm(true)} />
      )}

      {showForm && (
        <div className="mt-[24px] rounded-[10px] border border-[#ccc] px-[44px] py-[41px]">
          <div className="mb-[20px] flex items-center justify-between">
            <p className="text-[18px] font-normal text-[#1b1b1b]">
              Tell us about your child
            </p>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-[13px] text-[#888] hover:text-[#1b1b1b]"
            >
              Cancel
            </button>
          </div>
          <ChildInfoForm submitLabel="Save child" onSubmit={handleAdd} />
        </div>
      )}

      {children.length > 0 && !showForm && (
        <div className="mt-[24px] grid grid-cols-3 gap-[24px]">
          {children.map((child) => (
            <ChildCard
              key={child.id}
              child={child}
              onEdit={() => setEditingChild(child)}
            />
          ))}
        </div>
      )}

      {editingChild && (
        <EditModal
          child={editingChild}
          onSave={handleUpdate}
          onClose={() => setEditingChild(null)}
        />
      )}
    </div>
  );
}

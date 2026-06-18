"use client";

import { ShoppingCart, Plus, Minus, Trash2, X, Package } from "lucide-react";
import { formatNaira } from "@/src/lib/api/store";
import type { CartLine } from "@/src/types/store";

export default function CartPanel({
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
                            {line.selectedSize && (
                              <span className="ml-1.5 rounded-full bg-[#e8f5ee] px-1.5 py-px text-[10px] font-semibold text-brand-green">
                                {line.selectedSize}
                              </span>
                            )}
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

import { useCallback, useEffect, useState } from "react";
import {
  getStoreItemsForSchool,
  getParentChildren,
  parentPurchaseItems,
  type ParentCartLine,
} from "@/src/lib/api/store";
import type { StoreItem, CartLine } from "@/src/types/store";
import type { ParentChild } from "@/src/types/parent";

export type CartSelection = {
  child: ParentChild;
  qty: number;
  selectedSize?: string;
};

function groupBySchool(children: ParentChild[]): Map<string, ParentChild[]> {
  const map = new Map<string, ParentChild[]>();
  for (const child of children) {
    if (!map.has(child.schoolId)) map.set(child.schoolId, []);
    map.get(child.schoolId)!.push(child);
  }
  return map;
}

export function useParentStore() {
  const [children, setChildren] = useState<ParentChild[]>([]);
  const [itemsBySchool, setItemsBySchool] = useState<Map<string, StoreItem[]>>(
    new Map()
  );
  const [loaded, setLoaded] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
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
  const currentSchoolName =
    children.find((c) => c.schoolId === selectedSchoolId)?.schoolName ?? "";
  const childrenAtSchool = schoolGroups.get(selectedSchoolId) ?? [];
  const cartCount = cart.reduce((s, l) => s + l.quantity, 0);

  function addToCart(
    item: StoreItem,
    schoolName: string,
    selections: CartSelection[]
  ) {
    setCart((prev) => {
      const next = [...prev];
      for (const { child, qty, selectedSize } of selections) {
        const idx = next.findIndex(
          (l) => l.storeItem.id === item.id && l.studentId === child.studentId
        );
        if (idx >= 0) {
          next[idx] = { ...next[idx], quantity: qty, selectedSize };
        } else {
          next.push({
            storeItem: item,
            studentId: child.studentId,
            studentName: child.studentName,
            schoolId: child.schoolId,
            schoolName,
            quantity: qty,
            selectedSize,
          });
        }
      }
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

  const handleCheckout = useCallback(async () => {
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
  }, [cart]);

  return {
    children,
    itemsBySchool,
    loaded,
    selectedSchoolId,
    selectSchool: setSelectedSchoolId,
    schoolIds,
    currentSchoolName,
    childrenAtSchool,
    cart,
    cartOpen,
    cartCount,
    successLines,
    addToCart,
    updateQty,
    removeLine,
    handleCheckout,
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
    clearSuccess: () => setSuccessLines(null),
  };
}

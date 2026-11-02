// Ответ API: { goods: [...] } или { error: "..." }.
// Если деталь не найдена, приходит один пустой элемент — отбрасываем его.
export function parseResponse(data) {
  if (data?.error) {
    const message = Array.isArray(data.error) ? data.error.join('; ') : String(data.error);
    throw new Error(message);
  }
  return (data?.goods ?? []).filter((item) => item.brand);
}

export function toBrands(goods) {
  return goods.map(({ goodsID, brand, number, name, count }) => ({
    id: goodsID,
    brand,
    number,
    name,
    count,
  }));
}

// Цену берём со склада (поле price у товара в документации помечено «не использовать»)
export function toOffers(goods) {
  const [original, ...rest] = goods;
  if (!original) return [];
  const items = [
    { ...original, isOriginal: true },
    ...(original.analogues ?? []),
    ...rest,
  ].filter((item) => item.brand);

  const rows = items.flatMap((item) => {
    const base = {
      goodsID: item.goodsID,
      brand: item.brand,
      number: item.number,
      name: item.name,
      isOriginal: Boolean(item.isOriginal),
    };
    if (!item.warehouses?.length) {
      return [{ ...base, key: item.goodsID, warehouse: null, price: null, stock: 0, shipmentDate: null }];
    }
    return item.warehouses.map((w) => ({
      ...base,
      key: `${item.goodsID}-${w.id}`,
      warehouse: w.code || (w.own ? 'Собственный склад' : 'Склад партнёра'),
      price: w.price,
      stock: w.stock,
      shipmentDate: w.shipmentDate,
    }));
  });

  // Сначала искомая деталь, затем позиции в наличии по возрастанию цены, затем без остатка
  return rows.sort(
    (a, b) =>
      Number(b.isOriginal) - Number(a.isOriginal) ||
      Number(b.stock > 0) - Number(a.stock > 0) ||
      (a.price ?? Infinity) - (b.price ?? Infinity)
  );
}

import { describe, expect, it } from 'vitest';
import { parseResponse, toOffers } from './normalize';

const empty = { brand: '', count: 0, goodsID: '00000000-0000-0000-0000-000000000000', name: '', number: '', price: 0, rate: 0, warehouses: [] };

describe('parseResponse', () => {
  it('бросает ошибку API', () => {
    expect(() => parseResponse({ error: 'Empty key!' })).toThrow('Empty key!');
  });

  it('пустой элемент «не найдено» превращает в пустой список', () => {
    expect(parseResponse({ goods: [empty] })).toEqual([]);
  });
});

describe('toOffers', () => {
  const goods = [
    {
      goodsID: '1', brand: 'CAFFARO', number: '01-89', name: 'Ролик', price: 999,
      warehouses: [{ id: 'w1', code: 'ДМД', own: true, price: 500, stock: 3, shipmentDate: '2026-10-23T20:00:00+03:00' }],
      analogues: [
        { goodsID: '2', brand: 'GATES', number: 'T1', name: 'Ролик', warehouses: [] },
        { goodsID: '3', brand: 'INA', number: 'F1', name: 'Ролик', warehouses: [{ id: 'w2', code: '', own: false, price: 300, stock: 1 }] },
      ],
    },
  ];

  it('берёт цену со склада, а не из товара', () => {
    expect(toOffers(goods)[0].price).toBe(500);
  });

  it('искомая деталь первой, затем в наличии по цене, затем без остатка', () => {
    expect(toOffers(goods).map((r) => r.brand)).toEqual(['CAFFARO', 'INA', 'GATES']);
  });

  it('позиция без складов получает нулевой остаток', () => {
    const row = toOffers(goods).find((r) => r.brand === 'GATES');
    expect(row).toMatchObject({ stock: 0, price: null });
  });
});

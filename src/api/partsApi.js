import { parseResponse } from './normalize';

const API_URL = import.meta.env.VITE_API_URL || '/api/';
const API_KEY = import.meta.env.VITE_API_KEY;

// Один эндпоинт: только number — список брендов, number + brand + analogues=on — аналоги
export async function fetchGoods({ number, brand }, signal) {
  const params = new URLSearchParams({ key: API_KEY, number });
  if (brand) {
    params.set('brand', brand);
    params.set('analogues', 'on');
  }

  let response;
  try {
    response = await fetch(`${API_URL}?${params}`, { signal });
  } catch (e) {
    if (e.name === 'AbortError') throw e;
    throw new Error('Нет соединения с сервером. Проверьте интернет и попробуйте ещё раз.');
  }
  if (!response.ok) {
    throw new Error(`Сервер ответил с ошибкой (${response.status})`);
  }
  return parseResponse(await response.json());
}

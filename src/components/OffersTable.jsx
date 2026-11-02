import { useDispatch, useSelector } from 'react-redux';
import { searchOffers } from '../store/searchSlice';
import Loader from './Loader';
import ErrorAlert from './ErrorAlert';

const priceFormat = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });
const dateFormat = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit' });
const timeFormat = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' });

// shipmentDate: дата — день отгрузки, время — до скольки нужно заказать
function formatShipment(value) {
  if (!value) return '—';
  const date = new Date(value);
  return `${dateFormat.format(date)}, заказ до ${timeFormat.format(date)}`;
}

export default function OffersTable() {
  const dispatch = useDispatch();
  const selected = useSelector((state) => state.search.selected);
  const { items, status, error } = useSelector((state) => state.search.offers);

  if (!selected) return null;

  return (
    <section>
      <h2 className="h5 mb-3">
        {selected.brand} {selected.number}: предложения и аналоги
      </h2>
      {status === 'loading' && <Loader text="Загружаем предложения…" />}
      {status === 'failed' && <ErrorAlert message={error} onRetry={() => dispatch(searchOffers(selected))} />}
      {status === 'succeeded' && !items.length && (
        <div className="alert alert-secondary">Предложений и аналогов не найдено.</div>
      )}
      {status === 'succeeded' && items.length > 0 && (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white mb-0">
            <thead className="table-light">
              <tr>
                <th>Производитель / Наименование</th>
                <th>Склад</th>
                <th>Отгрузка</th>
                <th className="text-end">Цена</th>
                <th className="text-end">Остаток</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.key} className={row.stock > 0 ? undefined : 'text-secondary'}>
                  <td>
                    <span className="fw-semibold">{row.brand}</span>
                    <span className="ms-2 small text-secondary">{row.number}</span>
                    {row.isOriginal && <span className="badge text-bg-primary ms-2">искомая</span>}
                    <div className="small">{row.name}</div>
                  </td>
                  <td>{row.warehouse ?? '—'}</td>
                  <td className="small">{formatShipment(row.shipmentDate)}</td>
                  <td className="text-end text-nowrap">{row.price != null ? priceFormat.format(row.price) : '—'}</td>
                  <td className="text-end text-nowrap">{row.stock > 0 ? `${row.stock} шт.` : 'нет в наличии'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

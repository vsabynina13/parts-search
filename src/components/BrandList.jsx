import { useDispatch, useSelector } from 'react-redux';
import { searchBrands, searchOffers } from '../store/searchSlice';
import Loader from './Loader';
import ErrorAlert from './ErrorAlert';

export default function BrandList() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.search.brands);
  const query = useSelector((state) => state.search.query.trim());
  const selected = useSelector((state) => state.search.selected);

  if (status === 'idle') return null;
  if (status === 'loading') return <Loader text="Ищем производителей…" />;
  if (status === 'failed') {
    return <ErrorAlert message={error} onRetry={() => dispatch(searchBrands(query))} />;
  }
  if (!items.length) {
    return <div className="alert alert-secondary">По артикулу «{query}» ничего не найдено.</div>;
  }

  return (
    <section>
      <h2 className="h6 text-secondary mb-2">Выберите производителя ({items.length})</h2>
      <div className="list-group">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center gap-3${
              selected?.id === item.id ? ' active' : ''
            }`}
            onClick={() => dispatch(searchOffers(item))}
          >
            <span>
              <span className="fw-semibold">{item.brand}</span>
              <span className="ms-2 small opacity-75">{item.number}</span>
              <span className="d-block small">{item.name}</span>
            </span>
            <span className={`badge rounded-pill ${item.count > 0 ? 'text-bg-success' : 'text-bg-secondary'}`}>
              {item.count > 0 ? `${item.count} шт.` : 'нет'}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

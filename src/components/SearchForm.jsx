import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reset, searchBrands, setQuery } from '../store/searchSlice';

const MIN_LENGTH = 3;
const DEBOUNCE_MS = 500;

export default function SearchForm() {
  const dispatch = useDispatch();
  const query = useSelector((state) => state.search.query);
  const number = query.trim();

  // Поиск по факту ввода: ждём паузу и отменяем предыдущий запрос
  useEffect(() => {
    if (number.length < MIN_LENGTH) return undefined;
    let request;
    const timer = setTimeout(() => {
      request = dispatch(searchBrands(number));
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      request?.abort();
    };
  }, [dispatch, number]);

  const handleChange = (e) => {
    const value = e.target.value;
    if (!value.trim()) dispatch(reset());
    else dispatch(setQuery(value));
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} role="search">
      <label htmlFor="article" className="form-label fw-semibold">
        Артикул детали
      </label>
      <input
        id="article"
        type="search"
        className="form-control form-control-lg"
        placeholder="Например, 01089"
        value={query}
        onChange={handleChange}
        autoComplete="off"
        autoFocus
      />
      <div className="form-text">Поиск начнётся автоматически, минимум {MIN_LENGTH} символа.</div>
    </form>
  );
}

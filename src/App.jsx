import SearchForm from './components/SearchForm';
import BrandList from './components/BrandList';
import OffersTable from './components/OffersTable';

export default function App() {
  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">Подбор автозапчастей и аналогов</h1>
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body d-grid gap-3">
              <SearchForm />
              <BrandList />
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <OffersTable />
        </div>
      </div>
    </div>
  );
}

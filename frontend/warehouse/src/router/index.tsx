import { Routes, Route } from "react-router-dom";
import CompaniesPage from "../pages/CompaniesPage";
import WarehousesPage from "../pages/WarehousesPage";
import ProductsPage from "../pages/ProductsPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<CompaniesPage />} />
      <Route path="/companies" element={<CompaniesPage />} />
      <Route path="/warehouses" element={<WarehousesPage />} />
      <Route path="/products" element={<ProductsPage />} />
    </Routes>
  );
}
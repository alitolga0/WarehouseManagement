# Akıllı Depo Yönetimi

## Genel Bilgi
Bu proje, **Akıllı Depo Yönetimi** sistemi için geliştirilmiş bir full-stack uygulamadır.  
Backend **.NET 9.0 (ASP.NET Core Web API)** ile geliştirilmiş, frontend **React 18 + TypeScript + Material-UI (MUI)** kullanılarak tek sayfa (SPA) olarak tasarlanmıştır.  
Veritabanı olarak **MS SQL Server** ve ORM olarak **Entity Framework Core** kullanılmıştır.

Sistem, şirket bazlı (multi-tenant) veri yönetimi ve server-side pagination ile verimli depo yönetimi sağlamaktadır.

---

## Teknoloji ve Araçlar
| Katman | Teknoloji / Araç | Versiyon / Açıklama |
|--------|-----------------|-------------------|
| Backend | .NET 9.0 | ASP.NET Core Web API |
| Frontend | React | v18 + TypeScript |
| UI | Material-UI (MUI) | v5 |


---


## Backend API

### Companies
| Method | Endpoint | Açıklama |
|--------|---------|----------|
| GET | `/api/Companies/get-all` | Server-side pagination ile listeleme |
| GET | `/api/Companies/get-by-id/{id}` | ID bazlı şirket getir |
| POST | `/api/Companies/create` | Yeni şirket oluştur |
| POST | `/api/Companies/update` | Şirket güncelle |
| POST | `/api/Companies/delete` | Şirket sil (soft delete) |

### Products
| Method | Endpoint | Açıklama |
|--------|---------|----------|
| GET | `/api/Products/get-all` | Ürünleri listele (server-side pagination) |
| GET | `/api/Products/get-by-id/{id}` | ID bazlı ürün getir |
| POST | `/api/Products/create` | Ürün oluştur |
| POST | `/api/Products/update` | Ürün güncelle |
| POST | `/api/Products/delete` | Ürün sil |

### Warehouses
| Method | Endpoint | Açıklama |
|--------|---------|----------|
| GET | `/api/Warehouse/get-all` | Depoları listele (pagination) |
| GET | `/api/Warehouse/get-by-id/{id}` | ID bazlı depo getir |
| POST | `/api/Warehouse/create` | Depo oluştur |
| POST | `/api/Warehouse/update` | Depo güncelle |
| POST | `/api/Warehouse/delete` | Depo sil |

### Inventories (Stock Movements)
| Method | Endpoint | Açıklama |
|--------|---------|----------|
| POST | `/api/Inventories/move-stock` | Stok hareketi (giriş/çıkış) |

---

## Frontend
- Tek sayfa (SPA) uygulaması **React + TypeScript + MUI** ile geliştirilmiştir.  
- Özellikler:
  - **Sidebar**: Dashboard, Companies, Warehouses, Products, Stock Movements
  - **Sayfalanmış tablolar**: Server-side pagination, arama ve filtreleme
  - **Ekleme / Düzenleme modalı**: MUI Dialog ile
  - **Silme onay modalı**: Soft delete işlemleri için
  - **Özet bilgi kartları**: Dashboard ana sayfasında

---

## Kurulum ve Çalıştırma

### Backend
```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run

```
### Frontend
```bash
cd frontend
npm install
npm run dev

```

## 📸 Ekran Görüntüleri
<img width="1859" height="920" alt="Image" src="https://github.com/user-attachments/assets/31f50dfe-de6f-46bd-9590-bda166f35304" />

<img width="1857" height="922" alt="Image" src="https://github.com/user-attachments/assets/1e211193-6027-4876-bda7-daa732ededba" />

<img width="1857" height="920" alt="Image" src="https://github.com/user-attachments/assets/a8039589-ed20-47aa-b229-d6630aee1413" />

---

## 📧 İletişim

Bu proje hakkında sorularınız varsa veya katkıda bulunmak istiyorsanız benimle iletişime geçebilirsiniz.

📨 E-posta: [cakiralitolga@gmail.com](mailto:cakiralitolga@gmail.com)

--- 

Hazırlayan: **Ali Tolga Çakir**

--- 

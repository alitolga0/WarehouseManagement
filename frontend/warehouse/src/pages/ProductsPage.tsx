import { useEffect, useState } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, Typography, Pagination, IconButton, CircularProgress,
  Stack, MenuItem, FormControl, InputLabel, Select, Chip, Tooltip, Grid,
  Avatar, Divider
} from "@mui/material";
import {
  EditTwoTone,
  DeleteTwoTone,
  AddCircleTwoTone,
  SwapHorizontalCircleTwoTone as MoveIcon,
  InventoryTwoTone,
  ShoppingBagTwoTone
} from "@mui/icons-material";
import { ProductsService } from "../services/ProductsService";
import { CompaniesService } from "../services/CompaniesService";
import { WarehousesService } from "../services/WarehousesService";
import { InventoriesService } from "../services/InventoriesService";

interface Company { id: string; name: string; }
interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  unit: string;
  totalStock: number;
  companyId: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [openStockDialog, setOpenStockDialog] = useState(false);

  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const [stockFormData, setStockFormData] = useState({ warehouseId: "", quantity: 0 });
  const [productFormData, setProductFormData] = useState({
    name: "", sku: "", description: "", unit: "Adet", totalStock: 0
  });

  // Başlangıçta firmaları çek
  useEffect(() => {
    CompaniesService.getAll(1, 100).then(res => {
      const list = res.data?.data?.items || res.data?.items || [];
      setCompanies(list);
      if (list.length > 0) setSelectedCompanyId(list[0].id);
    });
  }, []);

  // Ürünleri ve Depoları Getir
  const fetchData = async (p: number = 1) => {
    if (!selectedCompanyId) return;
    setLoading(true);
    try {
      const [prodRes, wharfRes] = await Promise.all([
        ProductsService.getAll(selectedCompanyId, p, 10),
        WarehousesService.getAll(selectedCompanyId, 1, 100)
      ]);
      const pData = prodRes.data?.data || prodRes.data;
      setProducts(pData?.items || []);
      setTotalPages(pData?.totalPages || 1);
      setPage(pData?.page || 1);

      const wData = wharfRes.data?.data || wharfRes.data;
      setWarehouses(wData?.items || []);
    } catch (err) {
      console.error("Veri çekme hatası:", err);
      setProducts([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(page); }, [selectedCompanyId, page]);

  // Ürün Dialogunu Aç (Yeni/Düzenle)
  const handleOpenProductDialog = (p?: Product) => {
    if (p) {
      setEditProduct(p);
      setProductFormData({
        name: p.name, sku: p.sku, description: p.description, unit: p.unit, totalStock: p.totalStock
      });
    } else {
      setEditProduct(null);
      // Yeni ürün eklenirken stok her zaman 0 başlar
      setProductFormData({ name: "", sku: "", description: "", unit: "Adet", totalStock: 0 });
    }
    setOpenProductDialog(true);
  };

  const handleSaveProduct = async () => {
    if (!productFormData.name || !selectedCompanyId) return;
    try {
      const payload = { ...productFormData, companyId: selectedCompanyId };
      if (editProduct) {
        await ProductsService.update({ ...payload, id: editProduct.id });
      } else {
        await ProductsService.create(payload);
      }
      setOpenProductDialog(false);
      fetchData(page);
    } catch (err) { console.error("Kaydetme hatası:", err); }
  };

  const handleStockMove = async () => {
    if (!currentProduct || !stockFormData.warehouseId || stockFormData.quantity === 0) return;
    try {
      await InventoriesService.moveStock({
        productId: currentProduct.id,
        warehouseId: stockFormData.warehouseId,
        quantity: stockFormData.quantity,
        companyId: selectedCompanyId
      });
      setOpenStockDialog(false);
      setStockFormData({ warehouseId: "", quantity: 0 });
      fetchData(page);
    } catch (err) { alert("Stok işlemi başarısız oldu!"); }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      await ProductsService.delete(id, selectedCompanyId);
      fetchData(page);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f4f7fa', minHeight: '100vh' }}>
      {/* Üst Başlık ve Filtre Alanı */}
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={3} sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#1a237e', display: 'flex', alignItems: 'center', gap: 2 }}>
            <InventoryTwoTone sx={{ fontSize: 45 }} /> Envanter Yönetimi
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">Ürün portföyünüzü ve depo stok hareketlerinizi kontrol edin.</Typography>
        </Box>

        <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
          <FormControl size="medium" sx={{ minWidth: 240, bgcolor: 'white', borderRadius: 2 }}>
            <InputLabel>Aktif Firma</InputLabel>
            <Select
              sx={{ borderRadius: 2 }}
              value={selectedCompanyId}
              label="Aktif Firma"
              onChange={(e) => setSelectedCompanyId(e.target.value)}
            >
              {companies.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddCircleTwoTone />}
            onClick={() => handleOpenProductDialog()}
            sx={{ borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 700, boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)' }}
          >
            Yeni Ürün
          </Button>
        </Stack>
      </Stack>

      {/* Ürün Tablosu */}
      <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #e0e6ed', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
        {loading && (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.7)', zIndex: 2 }}>
            <CircularProgress thickness={5} size={50} />
          </Box>
        )}
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: '#475569', py: 2.5 }}>ÜRÜN DETAYI</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#475569' }}>SKU / KOD</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#475569' }}>TOPLAM STOK</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: '#475569', pr: 4 }}>EYLEMLER</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length > 0 ? (
                products.map((p) => (
                  <TableRow key={p.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: '#e8eaf6', color: '#3f51b5', fontWeight: 700 }}>{p.name[0].toUpperCase()}</Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b' }}>{p.name}</Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>{p.description || 'Açıklama girilmemiş'}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip label={p.sku} size="small" sx={{ fontWeight: 600, bgcolor: '#f1f5f9', borderRadius: 1.5 }} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{
                          width: 10, height: 10, borderRadius: '50%',
                          bgcolor: p.totalStock > 0 ? '#10b981' : '#f43f5e'
                        }} />
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          {p.totalStock} <span style={{ fontSize: 12, color: '#64748b' }}>{p.unit}</span>
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Stok Giriş/Çıkış">
                          <IconButton
                            onClick={() => { setCurrentProduct(p); setOpenStockDialog(true); }}
                            sx={{ bgcolor: '#eff6ff', color: '#2563eb', '&:hover': { bgcolor: '#2563eb', color: 'white' } }}
                          >
                            <MoveIcon />
                          </IconButton>
                        </Tooltip>
                        <IconButton
                          onClick={() => handleOpenProductDialog(p)}
                          sx={{ bgcolor: '#f0fdf4', color: '#16a34a', '&:hover': { bgcolor: '#16a34a', color: 'white' } }}
                        >
                          <EditTwoTone />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(p.id)}
                          sx={{ bgcolor: '#fff1f2', color: '#e11d48', '&:hover': { bgcolor: '#e11d48', color: 'white' } }}
                        >
                          <DeleteTwoTone />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                    <Typography color="text.secondary">Görüntülenecek ürün bulunamadı.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'center' }}>
          <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" variant="outlined" shape="rounded" />
        </Box>
      </Paper>

      {/* 1. Ürün Ekle/Düzenle Dialog */}
      <Dialog open={openProductDialog} onClose={() => setOpenProductDialog(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800, fontSize: 24, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ShoppingBagTwoTone color="primary" /> {editProduct ? "Ürünü Güncelle" : "Yeni Ürün Tanımla"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {!editProduct ? "Sisteme yeni bir ürün kaydedin. Stok girişi daha sonra hareketler üzerinden yapılacaktır." : "Ürün bilgilerini güncelleyin."}
          </Typography>

          {/* Dialog içindeki Grid yapısını bununla değiştirin */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField
                label="Ürün Adı"
                fullWidth
                variant="filled"
                value={productFormData.name}
                onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                InputProps={{ disableUnderline: true, sx: { borderRadius: 2 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="SKU / Barkod"
                fullWidth
                variant="filled"
                value={productFormData.sku}
                onChange={(e) => setProductFormData({ ...productFormData, sku: e.target.value })}
                InputProps={{ disableUnderline: true, sx: { borderRadius: 2 } }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Açıklama"
                fullWidth
                multiline
                rows={2}
                variant="filled"
                value={productFormData.description}
                onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                InputProps={{ disableUnderline: true, sx: { borderRadius: 2 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Birim (Örn: Adet, Kg)"
                fullWidth
                variant="filled"
                value={productFormData.unit}
                onChange={(e) => setProductFormData({ ...productFormData, unit: e.target.value })}
                InputProps={{ disableUnderline: true, sx: { borderRadius: 2 } }}
              />
            </Grid>
            {editProduct && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Mevcut Toplam Stok"
                  fullWidth
                  variant="filled"
                  disabled
                  value={productFormData.totalStock}
                  InputProps={{ disableUnderline: true, sx: { borderRadius: 2 } }}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenProductDialog(false)} color="inherit" sx={{ fontWeight: 700 }}>Vazgeç</Button>
          <Button variant="contained" onClick={handleSaveProduct} sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}>Kaydet</Button>
        </DialogActions>
      </Dialog>

      {/* 2. Stok Hareketi Dialog */}
      <Dialog open={openStockDialog} onClose={() => setOpenStockDialog(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800, fontSize: 22, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <MoveIcon color="secondary" /> Stok Giriş / Çıkış
        </DialogTitle>
        <DialogContent>
          <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 2, mb: 3, border: '1px solid #e2e8f0' }}>
            <Typography variant="caption" color="text.secondary">SEÇİLİ ÜRÜN</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b' }}>{currentProduct?.name}</Typography>
          </Box>
          <Stack spacing={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Hedef Depo</InputLabel>
              <Select label="Hedef Depo" sx={{ borderRadius: 2 }} value={stockFormData.warehouseId} onChange={(e) => setStockFormData({ ...stockFormData, warehouseId: e.target.value })}>
                {warehouses.map(w => <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField
              label="Değişim Miktarı"
              type="number"
              fullWidth
              helperText="Ekleme için '10', çıkarma için '-10' giriniz."
              onChange={(e) => setStockFormData({ ...stockFormData, quantity: Number(e.target.value) })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenStockDialog(false)} color="inherit" sx={{ fontWeight: 700 }}>İptal</Button>
          <Button variant="contained" color="secondary" onClick={handleStockMove} sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}>Onayla</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
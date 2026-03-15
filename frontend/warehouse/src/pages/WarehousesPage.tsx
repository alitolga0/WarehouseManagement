import { useEffect, useState } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, Typography, Pagination, IconButton, CircularProgress,
  Stack, MenuItem, FormControl, InputLabel, Select, Divider, Avatar, Tooltip
} from "@mui/material";
import {
  EditTwoTone,
  DeleteTwoTone,
  AddCircleTwoTone,
  WarehouseTwoTone,
  CalendarMonthTwoTone
} from "@mui/icons-material";
import { WarehousesService } from "../services/WarehousesService";
import { CompaniesService } from "../services/CompaniesService";

interface Warehouse {
  id: string;
  companyId: string;
  name: string;
  createdAt: string;
}

interface Company {
  id: string;
  name: string;
}

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [editWarehouse, setEditWarehouse] = useState<Warehouse | null>(null);
  const [warehouseName, setWarehouseName] = useState("");

  // Firmaları Yükle
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await CompaniesService.getAll(1, 100);
        const companyList = res.data?.data?.items || res.data?.items || [];
        setCompanies(companyList);
        if (companyList.length > 0) setSelectedCompanyId(companyList[0].id);
      } catch (err) { console.error("Firmalar yüklenemedi", err); }
    };
    fetchCompanies();
  }, []);

  // Depoları Yükle (Sayfalama Parametresiyle)
  const fetchWarehouses = async (p: number = 1) => {
    if (!selectedCompanyId) return;
    setLoading(true);
    try {
      // Sayfa başına 10 kayıt (isteğe göre değiştirilebilir)
      const res = await WarehousesService.getAll(selectedCompanyId, p, 10);
      const data = res.data?.data || res.data;

      setWarehouses(data?.items || []);
      setTotalPages(data?.totalPages || 1);
      setPage(data?.page || p); // Servisten dönen sayfa numarasını veya isteği setle
    } catch (err) {
      console.error("Depolar yüklenirken hata:", err);
      setWarehouses([]);
    } finally { setLoading(false); }
  };

  // Firma değiştiğinde ilk sayfaya dönerek depoları çek
  useEffect(() => {
    if (selectedCompanyId) {
      setPage(1);
      fetchWarehouses(1);
    }
  }, [selectedCompanyId]);

  // Sayfa Değiştirme Olayı
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    fetchWarehouses(value);
  };

  const handleOpenDialog = (w?: Warehouse) => {
    setEditWarehouse(w || null);
    setWarehouseName(w?.name || "");
    setOpenDialog(true);
  };

  const handleSave = async () => {
    if (!warehouseName.trim() || !selectedCompanyId) return;
    try {
      if (editWarehouse) {
        await WarehousesService.update({ id: editWarehouse.id, companyId: selectedCompanyId, name: warehouseName });
      } else {
        await WarehousesService.create({ companyId: selectedCompanyId, name: warehouseName });
      }
      fetchWarehouses(page); // Mevcut sayfayı yenile
      setOpenDialog(false);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bu depoyu silmek istediğinize emin misiniz?")) {
      await WarehousesService.delete(id, selectedCompanyId);
      // Eğer silinen kayıt sayfadaki son kayıt ise bir önceki sayfaya git
      const targetPage = warehouses.length === 1 && page > 1 ? page - 1 : page;
      fetchWarehouses(targetPage);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f4f7fa', minHeight: '100vh' }}>
      {/* Header Alanı */}
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={3} sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#1a237e', display: 'flex', alignItems: 'center', gap: 2 }}>
            <WarehouseTwoTone sx={{ fontSize: 40 }} /> Depo Yönetimi
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Lojistik merkezlerinizi ve depolama alanlarınızı buradan yönetin.
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
          <FormControl size="medium" sx={{ minWidth: 240, bgcolor: 'white', borderRadius: 2 }}>
            <InputLabel>Bağlı Firma</InputLabel>
            <Select
              sx={{ borderRadius: 2 }}
              value={selectedCompanyId}
              label="Bağlı Firma"
              onChange={(e) => setSelectedCompanyId(e.target.value)}
            >
              {companies.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            size="large"
            startIcon={<AddCircleTwoTone />}
            onClick={() => handleOpenDialog()}
            disabled={!selectedCompanyId}
            sx={{ borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 700, boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)' }}
          >
            Yeni Depo
          </Button>
        </Stack>
      </Stack>

      {/* Tablo Kartı */}
      <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #e0e6ed', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
        {loading && (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.7)', zIndex: 2 }}>
            <CircularProgress thickness={5} size={50} />
          </Box>
        )}
        <TableContainer>
          <Table sx={{ minWidth: 700 }}>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: '#475569', py: 2.5 }}>DEPO ADI</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#475569' }}>KAYIT TARİHİ</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: '#475569', pr: 4 }}>EYLEMLER</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {warehouses.length > 0 ? (
                warehouses.map((w) => (
                  <TableRow key={w.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: '#fff3e0', color: '#ef6c00' }}>
                          <WarehouseTwoTone fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b' }}>{w.name}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ color: '#64748b' }}>
                        <CalendarMonthTwoTone sx={{ fontSize: 18 }} />
                        <Typography variant="body2">
                          {new Date(w.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Düzenle">
                          <IconButton
                            onClick={() => handleOpenDialog(w)}
                            sx={{ bgcolor: '#f0fdf4', color: '#16a34a', '&:hover': { bgcolor: '#16a34a', color: 'white' } }}
                          >
                            <EditTwoTone fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Sil">
                          <IconButton
                            onClick={() => handleDelete(w.id)}
                            sx={{ bgcolor: '#fff1f2', color: '#e11d48', '&:hover': { bgcolor: '#e11d48', color: 'white' } }}
                          >
                            <DeleteTwoTone fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 10 }}>
                    <Box sx={{ opacity: 0.5 }}>
                      <WarehouseTwoTone sx={{ fontSize: 60, mb: 2, color: '#cbd5e1' }} />
                      <Typography variant="h6" color="text.secondary">
                        {loading ? "Depolar yükleniyor..." : "Henüz bir depo tanımlanmamış."}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Sayfalama Alt Çubuğu */}
        <Divider />
        <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'center', bgcolor: '#f8fafc' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, v) => fetchWarehouses(v)}
            color="primary"
            variant="outlined"
            shape="rounded"
          />
        </Box>
      </Paper>

      {/* Ekle / Düzenle Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: 22, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <WarehouseTwoTone color="primary" />
          {editWarehouse ? "Depoyu Düzenle" : "Yeni Depo Tanımla"}
        </DialogTitle>
        <DialogContent dividers sx={{ borderBottom: 'none' }}>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Deponun ismini belirleyerek stok takibini bu lokasyon üzerinden yapmaya başlayabilirsiniz.
            </Typography>
            <TextField
              autoFocus
              label="Depo İsmi"
              fullWidth
              variant="filled"
              placeholder="Örn: Merkez Depo, A-Blok..."
              value={warehouseName}
              onChange={(e) => setWarehouseName(e.target.value)}
              InputProps={{ disableUnderline: true, sx: { borderRadius: 2 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: '#64748b', fontWeight: 700 }}>Vazgeç</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!warehouseName.trim()}
            sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
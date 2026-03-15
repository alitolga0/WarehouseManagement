import { useEffect, useState } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, Typography, Pagination, IconButton, CircularProgress, 
  Stack, Avatar, Tooltip, Divider
} from "@mui/material";
import { 
  EditTwoTone, 
  DeleteTwoTone, 
  AddCircleTwoTone, 
  BusinessTwoTone,
  EventNoteTwoTone,
  CorporateFareTwoTone
} from "@mui/icons-material";
import { CompaniesService } from "../services/CompaniesService";

interface Company {
  id: string;
  name: string;
  createdAt: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const [companyName, setCompanyName] = useState("");

  const fetchCompanies = async (p: number = 1) => {
    setLoading(true);
    try {
      const res = await CompaniesService.getAll(p, 10);
      const data = res.data?.data || res.data;
      setCompanies(data.items || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.page || 1);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCompanies(); }, []);

  const handleOpenDialog = (c?: Company) => {
    setEditCompany(c || null);
    setCompanyName(c?.name || "");
    setOpenDialog(true);
  };

  const handleSave = async () => {
    if (!companyName.trim()) return;
    try {
      if (editCompany) await CompaniesService.update({ id: editCompany.id, name: companyName });
      else await CompaniesService.create({ name: companyName });
      fetchCompanies(page);
      setOpenDialog(false);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bu firmayı silmek istediğinize emin misiniz?")) {
      await CompaniesService.delete(id);
      fetchCompanies(page);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f4f7fa', minHeight: '100vh' }}>
      {/* Üst Başlık Bölümü */}
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={3} sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#1a237e', display: 'flex', alignItems: 'center', gap: 2 }}>
            Firma Portföyü
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Sistemde kayıtlı olan tüm ana ve alt firmaları buradan yönetin.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          size="large"
          startIcon={<AddCircleTwoTone />} 
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 700, boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)' }}
        >
          Yeni Firma Tanımla
        </Button>
      </Stack>

      {/* Liste Kartı */}
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
                <TableCell sx={{ fontWeight: 800, color: '#475569', py: 2.5 }}>FİRMA BİLGİSİ</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#475569' }}>KAYIT TARİHİ</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: '#475569', pr: 4 }}>YÖNETİM</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.map((c) => (
                <TableRow key={c.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 'bold', width: 45, height: 45 }}>
                        <CorporateFareTwoTone />
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b' }}>{c.name}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ color: '#64748b' }}>
                      <EventNoteTwoTone sx={{ fontSize: 18 }} />
                      <Typography variant="body2">
                        {new Date(c.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right" sx={{ pr: 3 }}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Düzenle">
                        <IconButton 
                          onClick={() => handleOpenDialog(c)} 
                          sx={{ bgcolor: '#f0fdf4', color: '#16a34a', '&:hover': { bgcolor: '#16a34a', color: 'white' } }}
                        >
                          <EditTwoTone fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Sil">
                        <IconButton 
                          onClick={() => handleDelete(c.id)} 
                          sx={{ bgcolor: '#fff1f2', color: '#e11d48', '&:hover': { bgcolor: '#e11d48', color: 'white' } }}
                        >
                          <DeleteTwoTone fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={(_, v) => fetchCompanies(v)} 
            color="primary" 
            variant="outlined" 
            shape="rounded" 
          />
        </Box>
      </Paper>

      {/* Ekle/Düzenle Modal */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        fullWidth 
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: 22, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <BusinessTwoTone color="primary" /> 
          {editCompany ? "Firmayı Güncelle" : "Yeni Firma Kaydı"}
        </DialogTitle>
        <DialogContent dividers sx={{ borderBottom: 'none' }}>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Lütfen firmanın resmi ticari ünvanını giriniz. Bu isim fatura ve stok fişlerinde görünecektir.
            </Typography>
            <TextField 
              autoFocus 
              label="Firma Ticari Ünvanı" 
              fullWidth 
              variant="filled"
              placeholder="Örn: ABC Lojistik A.Ş."
              value={companyName} 
              onChange={(e) => setCompanyName(e.target.value)} 
              InputProps={{ disableUnderline: true, sx: { borderRadius: 2 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: '#64748b', fontWeight: 700 }}>Vazgeç</Button>
          <Button 
            variant="contained" 
            onClick={handleSave} 
            disabled={!companyName.trim()}
            sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}
          >
            Firmayı Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  Box,
  IconButton,
  CssBaseline,
  Divider
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import BusinessIcon from "@mui/icons-material/Business";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useNavigate } from "react-router-dom";
import { useState, type ReactNode } from "react";

const drawerWidth = 260;

interface Props {
  children?: ReactNode;
}

export default function Sidebar({ children }: Props) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { text: "Firmalar", icon: <BusinessIcon />, path: "/companies" },
    { text: "Depolar", icon: <WarehouseIcon />, path: "/warehouses" },
    { text: "Ürünler", icon: <InventoryIcon />, path: "/products" },
  ];

  const drawerContent = (
    <Box sx={{ bgcolor: '#fff', height: '100%' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
          DEPO PRO
        </Typography>
      </Toolbar>
      <Divider sx={{ mb: 1 }} />
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton 
            key={item.text} 
            onClick={() => { navigate(item.path); setMobileOpen(false); }}
            sx={{ 
              borderRadius: 2, 
              mb: 0.5,
              "&:hover": { bgcolor: '#f0f4f8' }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: '#f4f7f9' }}>
      <CssBaseline />
      
      {/* Üst Bar */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'text.primary',
          borderBottom: '1px solid #e0e6ed'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Menü Alanı */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box", borderRight: '1px solid #e0e6ed' },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Ana İçerik */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          maxWidth: '100%',
          overflowX: 'hidden'
        }}
      >
        <Toolbar /> {/* AppBar boşluğu */}
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
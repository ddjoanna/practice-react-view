import React from "react";
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Box,
  TablePagination,
  TextField,
  FormControl,
  FormLabel,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { Navigate } from "react-router-dom";
import ProductTable from "@/components/ProductTable";
import ProductFormDialog from "@/components/ProductFormDialog";
import useProductManager from "@/hooks/useProductManager";

const ProductManager = () => {
  const {
    products,
    total,
    loading,
    error,
    editingProduct,
    page,
    rowsPerPage,
    setEditingProduct,
    setPage,
    setRowsPerPage,
    searchNameInput,
    searchDescriptionInput,
    setSearchNameInput,
    setSearchDescriptionInput,
    dialogOpen,
    setDialogOpen,
    handleSortModelChange,
    handleFilterApply,
    handleFilterReset,
    handleFormSubmit,
    handleDelete,
    handleDialogClose,
    snackbarOpen,
    handleSnackbarClose,
    errorMessage,
  } = useProductManager();

  if (error === "未授權，請重新登入") {
    return <Navigate to="/login" replace />;
  }

  return (
    <Container maxWidth="100%" sx={{ mt: 4, mb: 4, px: 2 }}>
      {/* 標題與新增 */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        flexWrap="wrap"
      >
        <Typography variant="h4" component="h1" sx={{ mb: { xs: 2, md: 0 } }}>
          產品列表 (總數: {total} 項產品)
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setEditingProduct({});
            setDialogOpen(true);
          }}
        >
          新增產品
        </Button>
      </Box>

      {/* 篩選條件區塊 */}
      <Box mb={2}>
        <FormControl
          component="fieldset"
          sx={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "16px",
            width: "100%",
          }}
        >
          <FormLabel component="legend" sx={{ fontSize: "1rem" }}>
            篩選條件
          </FormLabel>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
            <FormControl sx={{ minWidth: 200, flex: 1 }}>
              <TextField
                label="名稱"
                variant="outlined"
                size="small"
                value={searchNameInput}
                onChange={(e) => setSearchNameInput(e.target.value)}
                fullWidth
              />
            </FormControl>
            <FormControl sx={{ minWidth: 200, flex: 1 }}>
              <TextField
                label="描述"
                variant="outlined"
                size="small"
                value={searchDescriptionInput}
                onChange={(e) => setSearchDescriptionInput(e.target.value)}
                fullWidth
              />
            </FormControl>
            <Box>
              <Button
                variant="contained"
                onClick={handleFilterApply}
                sx={{ mr: 1 }}
              >
                篩選
              </Button>
              <Button variant="outlined" onClick={handleFilterReset}>
                重置
              </Button>
            </Box>
          </Stack>
        </FormControl>
      </Box>

      {/* 分頁 */}
      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) =>
            setRowsPerPage(parseInt(e.target.value, 10))
          }
          labelRowsPerPage="每頁顯示:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} / 共 ${count} 項`
          }
        />
      </Box>

      {/* 表格或載入 */}
      {loading ? (
        <CircularProgress sx={{ display: "block", mx: "auto" }} />
      ) : products.length === 0 ? (
        <Typography variant="body1" align="center">
          目前沒有可用的產品。
        </Typography>
      ) : (
        <ProductTable
          key={page}
          products={products}
          rowsPerPage={rowsPerPage}
          onSortModelChange={handleSortModelChange}
          onDelete={handleDelete}
          onUpdateProduct={handleFormSubmit}
          onEdit={(product) => setEditingProduct(product)}
        />
      )}

      {/* 編輯/新增對話框 */}
      <ProductFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        product={editingProduct}
        onSubmit={handleFormSubmit}
        onCancel={handleDialogClose}
      />

      {/* 錯誤訊息 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
          variant="filled"
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductManager;

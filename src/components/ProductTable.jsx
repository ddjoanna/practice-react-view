import React, { useState, useMemo, useCallback } from "react";
import { Box, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import ProductForm from "./ProductFormDialog";

const ProductTable = ({
  products = [],
  rowsPerPage,
  onSortModelChange,
  onDelete,
  onUpdateProduct = () => {},
  isSmallScreen,
}) => {
  const [editingProduct, setEditingProduct] = useState(null);

  // 👉 抽出價錢顯示函式
  const renderPriceCell = ({ value }) => (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      NT$
      {value.toLocaleString("zh-TW", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </Box>
  );

  // 👉 抽出操作欄位按鈕
  const renderActionsCell = ({ row }) => (
    <Box sx={{ display: "flex", gap: 1 }}>
      <IconButton aria-label="edit" onClick={() => setEditingProduct(row)}>
        <EditIcon color="primary" />
      </IconButton>
      <IconButton aria-label="delete" onClick={() => onDelete(row.id)}>
        <DeleteIcon color="error" />
      </IconButton>
    </Box>
  );

  // 👉 使用 useMemo 優化 columns 避免不必要重算
  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "名稱",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "description",
        headerName: "描述",
        flex: 2,
        minWidth: 200,
        hide: isSmallScreen,
      },
      {
        field: "price",
        headerName: "價錢",
        width: 120,
        renderCell: renderPriceCell,
        sortable: true,
      },
      {
        field: "actions",
        headerName: "操作",
        width: 150,
        sortable: false,
        filterable: false,
        renderCell: renderActionsCell,
      },
    ],
    [isSmallScreen]
  );

  const handleFormCancel = useCallback(() => {
    setEditingProduct(null);
  }, []);

  const handleFormSubmit = useCallback(
    (updatedData) => {
      onUpdateProduct(updatedData);
      setEditingProduct(null);
    },
    [onUpdateProduct]
  );

  const handleSortModelChange = useCallback(
    (sortModel) => {
      onSortModelChange?.(sortModel);
    },
    [onSortModelChange]
  );

  return (
    <Box
      sx={{
        width: "100%",
        overflowY: "auto",
      }}
    >
      <ProductForm
        open={Boolean(editingProduct)}
        product={editingProduct}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />

      <DataGrid
        rows={products}
        columns={columns}
        pageSize={rowsPerPage}
        pagination={false}
        sortingMode="server"
        onSortModelChange={handleSortModelChange}
        components={{ Toolbar: GridToolbar }}
        getRowId={(row) => row.id}
        autoHeight={false}
        sx={{
          minHeight: 400, // 固定高度，約等於10行
          fontSize: isSmallScreen ? "0.8rem" : "1rem",
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
          },
          "& .MuiDataGrid-footerContainer": {
            display: "none",
          },
        }}
      />
    </Box>
  );
};

export default ProductTable;

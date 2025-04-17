import React, { useState, useEffect, useCallback } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const ProductFormDialog = React.memo(
  ({ open, product, onSubmit, onCancel, loading, error }) => {
    const [form, setForm] = useState({
      name: "",
      description: "",
      price: "",
    });

    useEffect(() => {
      if (product) {
        setForm({
          name: product.name || "",
          description: product.description || "",
          price:
            product.price !== undefined && product.price !== null
              ? product.price.toString()
              : "",
        });
      } else {
        setForm({
          name: "",
          description: "",
          price: "",
        });
      }
    }, [product]);

    const handleChange = useCallback((e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = (e) => {
      e.preventDefault();

      const priceNum = form.price === "" ? null : Number(form.price);

      if (priceNum !== null && priceNum < 0) {
        alert("價格不可為負數");
        return;
      }

      onSubmit({
        ...form,
        price: priceNum,
        id: product?.id, // 編輯時帶上 id
      });
    };

    return (
      <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
        <DialogTitle>{product?.id ? "編輯產品" : "新增產品"}</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            autoComplete="off"
          >
            <TextField
              label="產品名稱"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              disabled={loading}
            />
            <TextField
              label="產品描述"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              disabled={loading}
            />
            <TextField
              label="價格"
              name="price"
              value={form.price}
              onChange={handleChange}
              fullWidth
              required
              type="number"
              margin="normal"
              inputProps={{
                min: 0,
                step: "0.01",
              }}
              disabled={loading}
            />
            {error && (
              <Typography color="error" mt={1}>
                {error}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onCancel} disabled={loading}>
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
            type="submit"
          >
            {product?.id ? "更新" : "新增"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

export default ProductFormDialog;

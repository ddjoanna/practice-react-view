import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
} from "@mui/material";

const CategoryFormDialog = ({
  open,
  onClose,
  onSubmit,
  category,
  parentOptions = [],
}) => {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [layer, setLayer] = useState(1);
  const [sortOrder, setSortOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setParentId(
        category.parent_id !== null && category.parent_id !== undefined
          ? category.parent_id
          : ""
      );
      setLayer(category.layer ?? 1);
      setSortOrder(category.sort_order ?? 1);
      setIsActive(category.is_active ?? true);
    } else {
      setName("");
      setParentId("");
      setLayer(1);
      setSortOrder(1);
      setIsActive(true);
    }
  }, [category]);

  const filteredParentOptions = useMemo(() => {
    if (!Array.isArray(parentOptions)) return [];
    if (!category) return parentOptions;

    // 只顯示層級小於當前 layer 的分類（父層級 = 當前層級 - 1）
    return parentOptions.filter((opt) => layer === opt.layer + 1);
  }, [parentOptions, category, layer]);

  // 判斷 parentId 是否有效（存在於 filteredParentOptions）
  const isParentIdValid = filteredParentOptions.some(
    (opt) => opt.id === parentId
  );

  // 當 layer 改變時，若 parentId 不在選項中，清空 parentId
  const handleParentLayerChange = (newLayer) => {
    const validLayer = newLayer >= 1 ? newLayer : 1;
    setLayer(validLayer);
    if (!filteredParentOptions.some((opt) => opt.id === parentId)) {
      setParentId("");
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({
      ...category,
      name: name.trim(),
      parent_id: parentId === "" ? null : parentId,
      layer: Number(layer),
      sort_order: Number(sortOrder),
      is_active: isActive,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{category?.id ? "編輯分類" : "新增分類"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          fullWidth
          label="分類名稱"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          label="層級 (layer)"
          type="number"
          value={layer}
          onChange={(e) => {
            const val = Number(e.target.value);
            handleParentLayerChange(val);
          }}
          margin="normal"
          inputProps={{ min: 1 }}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="parent-select-label">上層分類</InputLabel>
          <Select
            labelId="parent-select-label"
            value={isParentIdValid ? parentId : ""}
            label="上層分類"
            onChange={(e) => setParentId(e.target.value)}
          >
            <MenuItem value="">無（最上層）</MenuItem>
            {filteredParentOptions.map((opt) => (
              <MenuItem key={opt.id} value={opt.id}>
                {opt.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="排序 (sort_order)"
          type="number"
          value={sortOrder}
          onChange={(e) => {
            const val = Number(e.target.value);
            setSortOrder(val >= 1 ? val : 1);
          }}
          margin="normal"
          inputProps={{ min: 1 }}
        />
        <FormControl margin="normal" fullWidth>
          <InputLabel shrink htmlFor="enabled-switch">
            是否啟用
          </InputLabel>
          <Switch
            id="enabled-switch"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            color="primary"
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} type="button">
          取消
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!name.trim()}
          variant="contained"
        >
          儲存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryFormDialog;

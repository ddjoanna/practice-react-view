import { useState, useEffect, useCallback } from "react";
import * as productApi from "@/api/product";

const useProductManager = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("id");
  const [orderDirection, setOrderDirection] = useState("desc");

  const [editingProduct, setEditingProduct] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [searchNameInput, setSearchNameInput] = useState("");
  const [searchDescriptionInput, setSearchDescriptionInput] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchDescription, setSearchDescription] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await productApi.getProducts({
        page: page + 1,
        page_size: rowsPerPage,
        order_by: orderBy,
        order_direction: orderDirection,
        name: searchName || undefined,
        description: searchDescription || undefined,
      });
      const data = response.data;
      const mappedProducts = data.data.products.map((p) => ({
        ...p,
        id: p.id,
      }));
      setProducts(mappedProducts);
      setTotal(data.data.pagination.total);
    } catch (err) {
      handleApiError(err, "無法取得產品資訊");
    }
  }, [
    page,
    rowsPerPage,
    orderBy,
    orderDirection,
    searchName,
    searchDescription,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 篩選排序改變處理
  const handleSortModelChange = (sortModel) => {
    if (sortModel.length > 0) {
      setOrderBy(sortModel[0].field);
      setOrderDirection(sortModel[0].sort);
    } else {
      setOrderBy("id");
      setOrderDirection("desc");
    }
  };

  // 點擊篩選，將輸入值套用到篩選條件
  const handleFilterApply = () => {
    setPage(0);
    setSearchName(searchNameInput);
    setSearchDescription(searchDescriptionInput);
  };

  // 點擊重置，清空輸入與篩選條件，並強制重建輸入欄位
  const handleFilterReset = () => {
    setSearchNameInput("");
    setSearchDescriptionInput("");
    setSearchName("");
    setSearchDescription("");
    setPage(0);
  };

  // 新增/更新產品
  const handleFormSubmit = async (data) => {
    try {
      if (data.id) {
        await productApi.updateProduct(data.id, data);
      } else {
        await productApi.createProduct(data);
      }
      setEditingProduct(null);
      setPage(0);
      setDialogOpen(false);
      fetchProducts();
    } catch (error) {
      handleApiError(error, "儲存失敗");
    }
  };

  // 刪除產品
  const handleDelete = async (id) => {
    if (!window.confirm("確定要刪除此產品嗎？刪除後不可恢復。")) return;
    try {
      await productApi.deleteProduct(id);
      await fetchProducts();
    } catch (error) {
      handleApiError(error, "刪除失敗");
    }
  };

  // 關閉編輯對話框
  const handleDialogClose = () => {
    setEditingProduct(null);
    setDialogOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleApiError = (error, defaultMsg = "發生錯誤，請稍後再試") => {
    const errorData = error.response?.data?.data;
    let msg = defaultMsg;

    if (errorData) {
      const messages = Object.values(errorData).flat().join("；");
      if (messages) {
        msg = messages;
      }
    } else if (error.response?.data?.message) {
      msg = error.response.data.message;
    } else if (error.message) {
      msg = error.message;
    }

    setErrorMessage(msg);
    setSnackbarOpen(true);
  };

  return {
    products,
    total,
    editingProduct,
    page,
    rowsPerPage,
    dialogOpen,
    searchNameInput,
    searchDescriptionInput,
    setSearchNameInput,
    setSearchDescriptionInput,
    setDialogOpen,
    handleSortModelChange,
    handleFilterApply,
    handleFilterReset,
    handleFormSubmit,
    handleDelete,
    setEditingProduct,
    setPage,
    setRowsPerPage,
    handleDialogClose,
    setSnackbarOpen,
    handleSnackbarClose,
    errorMessage,
    snackbarOpen,
  };
};

export default useProductManager;

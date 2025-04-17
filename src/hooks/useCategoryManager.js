import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import * as categoryApi from "@/api/category";

const buildTree = (list) => {
  if (!Array.isArray(list)) return [];
  const map = {};
  const roots = [];

  list.forEach((item) => {
    map[item.id] = { ...item, children: [] };
  });

  list.forEach((item) => {
    if (item.parent_id) {
      if (map[item.parent_id]) {
        map[item.parent_id].children.push(map[item.id]);
      }
    } else {
      roots.push(map[item.id]);
    }
  });

  const sortTree = (nodes) => {
    nodes.sort((a, b) => a.sort_order - b.sort_order);
    nodes.forEach((node) => sortTree(node.children));
  };
  sortTree(roots);

  return roots;
};

const flattenTree = (tree) => {
  if (!Array.isArray(tree)) return [];
  let flattened = [];
  tree.forEach((node) => {
    flattened.push(node);
    if (node.children && Array.isArray(node.children)) {
      flattened = flattened.concat(flattenTree(node.children));
    }
  });
  return flattened;
};

export default function useCategoryManager() {
  const [categories, setCategories] = useState([]);
  const initialized = useRef(false);
  const [initialCategories, setInitialCategories] = useState(null);
  const [flattenedInitialCategories, setFlattenedInitialCategories] = useState(
    []
  );
  const [activeId, setActiveId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [searchNameInput, setSearchNameInput] = useState("");
  const [searchLayerInput, setSearchLayerInput] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchLayer, setSearchLayer] = useState("");

  const fetchCategories = useCallback(async () => {
    try {
      const res = await categoryApi.getCategories({
        name: searchName,
        layer: searchLayer,
      });
      if (res.data && Array.isArray(res.data.data)) {
        setCategories(res.data.data);
        setInitialCategories((prev) => {
          if (prev === null) {
            return res.data.data;
          }
          return prev;
        });
        setErrorMessage("");
      } else {
        setCategories([]);
        setErrorMessage("API 回傳格式錯誤");
        setSnackbarOpen(true);
        console.error("API 回傳格式錯誤", res.data);
      }
    } catch (err) {
      handleApiError(err, "取得分類失敗");
      setCategories([]);
    }
  }, [searchName, searchLayer]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const flattenedCategories = useMemo(
    () => flattenTree(categories),
    [categories]
  );

  useEffect(() => {
    if (!initialized.current && Array.isArray(initialCategories)) {
      setFlattenedInitialCategories(flattenTree(initialCategories));
      initialized.current = true;
    }
  }, [initialCategories]);

  const handleDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over || active.id === over.id) return;

      const activeNode = flattenedCategories.find(
        (cat) => cat.id === active.id
      );
      const overNode = flattenedCategories.find((cat) => cat.id === over.id);

      if (!activeNode || !overNode) return;

      if (activeNode.parent_id !== overNode.parent_id) {
        setErrorMessage("目前只支援同層級排序");
        setSnackbarOpen(true);
        return;
      }

      const siblings = flattenedCategories
        .filter((cat) => cat.parent_id === activeNode.parent_id)
        .sort((a, b) => a.sort_order - b.sort_order);

      const oldIndex = siblings.findIndex((cat) => cat.id === activeNode.id);
      const newIndex = siblings.findIndex((cat) => cat.id === overNode.id);

      if (oldIndex === -1 || newIndex === -1) return;

      const newSiblings = arrayMove(siblings, oldIndex, newIndex);

      const updatedSiblings = newSiblings.map((cat, index) => ({
        ...cat,
        sort_order: index + 1,
      }));

      const updatedCategories = flattenedCategories.map((cat) => {
        const updated = updatedSiblings.find((u) => u.id === cat.id);
        return updated || cat;
      });

      setCategories(buildTree(updatedCategories));

      try {
        await Promise.all(
          updatedSiblings.map((cat) =>
            categoryApi.updateCategory(cat.id, {
              name: cat.name,
              parent_id: cat.parent_id,
              layer: cat.layer,
              sort_order: cat.sort_order,
              is_active: cat.is_active,
            })
          )
        );
        setErrorMessage("");
        fetchCategories();
      } catch (error) {
        handleApiError(error, "排序更新失敗");
      }
    },
    [flattenedCategories, fetchCategories]
  );

  const handleFormSubmit = async (data) => {
    try {
      if (data.id) {
        await categoryApi.updateCategory(data.id, data);
      } else {
        await categoryApi.createCategory(data);
      }
      setDialogOpen(false);
      fetchCategories();
      setErrorMessage("");
    } catch (error) {
      handleApiError(error, "儲存失敗");
    }
  };

  const handleAddClick = () => {
    setEditingCategory({});
    setDialogOpen(true);
  };

  const handleApplyFilters = () => {
    setSearchName(searchNameInput);
    setSearchLayer(searchLayerInput);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleResetFilters = () => {
    setSearchNameInput("");
    setSearchLayerInput("");
    setSearchName("");
    setSearchLayer("");
  };

  const handleEditClick = (id) => {
    const categoryToEdit = flattenedCategories.find((cat) => cat.id === id);
    console.log("categoryToEdit", flattenedCategories);
    if (categoryToEdit) {
      setEditingCategory(categoryToEdit);
      setDialogOpen(true);
    }
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("確定要刪除這個分類嗎？")) return;
    try {
      await categoryApi.deleteCategory(id);
      fetchCategories();
      setErrorMessage("");
    } catch (error) {
      handleApiError(error, "刪除失敗");
    }
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

    console.error(msg, error);
    setErrorMessage(msg);
    setSnackbarOpen(true);
  };

  const handleDialogClose = () => {
    setEditingCategory({});
    setDialogOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      const row = flattenedCategories.find((cat) => cat.id === id);
      await categoryApi.updateCategory(id, {
        name: row.name,
        parent_id: row.parent_id,
        layer: row.layer,
        sort_order: row.sort_order,
        is_active: isActive,
      });
      fetchCategories();
    } catch (error) {
      handleApiError(error, "更新分類失敗");
    }
  };

  return {
    categories,
    flattenedCategories,
    flattenedInitialCategories,
    activeId,
    dialogOpen,
    editingCategory,
    errorMessage,
    snackbarOpen,
    searchNameInput,
    searchLayerInput,
    setSearchNameInput,
    setSearchLayerInput,
    setSearchName,
    setSearchLayer,
    setActiveId,
    setDialogOpen,
    setEditingCategory,
    setSnackbarOpen,
    fetchCategories,
    handleFormSubmit,
    handleDragEnd,
    handleAddClick,
    handleApplyFilters,
    handleResetFilters,
    handleDragStart,
    handleEditClick,
    handleDeleteClick,
    handleDialogClose,
    handleSnackbarClose,
    handleToggleActive,
  };
}

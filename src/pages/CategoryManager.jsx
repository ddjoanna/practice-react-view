import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Container,
  Snackbar,
  Alert,
  TextField,
  Button,
  Stack,
  Box,
  Typography,
  FormControl,
  FormLabel,
} from "@mui/material";

import useCategoryManager from "@/hooks/useCategoryManager";
import CategoryTree from "@/components/CategoryTree";
import CategoryFormDialog from "@/components/CategoryFormDialog";

export default function CategoryPage({ setAuth }) {
  const sensors = useSensors(useSensor(PointerSensor));

  const {
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
    setActiveId,
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
  } = useCategoryManager({ setAuth });

  return (
    <Container maxWidth="100%" sx={{ mt: 4, mb: 4, px: 2 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4">產品分類</Typography>
        <Button variant="contained" onClick={handleAddClick}>
          新增分類
        </Button>
      </Box>

      {/* Search Form */}
      <FormControl
        component="fieldset"
        sx={{
          mb: 2,
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "16px",
          width: "100%",
        }}
      >
        <FormLabel component="legend">篩選條件</FormLabel>
        <Stack
          mt={1}
          display="flex"
          gap={2}
          direction="row"
          alignItems="center"
        >
          <FormControl sx={{ minWidth: 200, flex: 1 }}>
            <TextField
              label="分類名稱"
              variant="outlined"
              size="small"
              value={searchNameInput}
              onChange={(e) => setSearchNameInput(e.target.value)}
            />
          </FormControl>
          <FormControl sx={{ minWidth: 200, flex: 1 }}>
            <TextField
              label="層級"
              variant="outlined"
              size="small"
              value={searchLayerInput}
              onChange={(e) => setSearchLayerInput(e.target.value)}
            />
          </FormControl>
          <Box>
            <Button
              variant="contained"
              onClick={handleApplyFilters}
              sx={{ mr: 1 }}
            >
              篩選
            </Button>
            <Button variant="outlined" onClick={handleResetFilters}>
              重置
            </Button>
          </Box>
        </Stack>
      </FormControl>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <SortableContext
          items={flattenedCategories.map((cat) => cat.id)}
          strategy={verticalListSortingStrategy}
        >
          <CategoryTree
            categories={categories}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onToggleActive={handleToggleActive}
          />
          <DragOverlay>
            {activeId ? (
              <Box
                style={{
                  padding: 10,
                  backgroundColor: "#ddd",
                  border: "1px solid #aaa",
                }}
              >
                {flattenedCategories.find((cat) => cat.id === activeId)?.name}
              </Box>
            ) : null}
          </DragOverlay>
        </SortableContext>

        <CategoryFormDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          onSubmit={handleFormSubmit}
          category={editingCategory}
          parentOptions={flattenedInitialCategories}
        />

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
      </DndContext>
    </Container>
  );
}

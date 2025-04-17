import React from "react";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { Box, IconButton, Switch } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableTreeItem = ({ node, onEdit, onDelete, onToggleActive }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TreeItem
      ref={setNodeRef}
      itemId={node.id.toString()}
      label={
        <Box display="flex" alignItems="center" style={style} width="100%">
          <Box
            flexShrink={0}
            width="10%"
            {...attributes}
            {...listeners}
            sx={{ cursor: "grab", textAlign: "left" }}
          >
            層級{node.layer}
          </Box>
          <Box
            flexShrink={0}
            width="60%"
            {...attributes}
            {...listeners}
            sx={{ cursor: "grab", textAlign: "left" }}
          >
            {node.name}
          </Box>
          <Box
            flexShrink={0}
            width="10%"
            {...attributes}
            {...listeners}
            sx={{ cursor: "grab", textAlign: "left" }}
          >
            排序{node.sort_order}
          </Box>
          <Box flexShrink={0} width="10%">
            <Switch
              size="small"
              checked={node.is_active}
              onClick={(e) => e.stopPropagation()}
              onChange={() => onToggleActive(node.id, !node.is_active)}
            />
          </Box>
          <Box flexShrink={0} width="10%">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(node.id);
              }}
            >
              <EditIcon color="primary" />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node.id);
              }}
            >
              <DeleteIcon color="error" />
            </IconButton>
          </Box>
        </Box>
      }
    >
      {Array.isArray(node.children)
        ? node.children.map((child) => (
            <SortableTreeItem
              key={child.id}
              node={child}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        : null}
    </TreeItem>
  );
};

const CategoryTree = ({ categories, onEdit, onDelete, onToggleActive }) => {
  return (
    <SimpleTreeView>
      {categories.map((category) => (
        <SortableTreeItem
          key={category.id}
          node={category}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
        />
      ))}
    </SimpleTreeView>
  );
};

export default CategoryTree;

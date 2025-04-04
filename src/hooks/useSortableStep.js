import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function useSortableStep(id) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: isDragging ? "#555" : "transparent",
    padding: "2px",
    borderRadius: "1px",
    marginBottom: "1px",
    cursor: "grab",
  };

  return { attributes, listeners, setNodeRef, style };
}

export default useSortableStep;
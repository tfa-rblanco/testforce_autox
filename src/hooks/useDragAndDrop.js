import { useSensors, useSensor, PointerSensor } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

export const useDragAndDrop = (setStepsList) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setStepsList((steps) => arrayMove(steps, active.id, over.id));
    }
  };

  return { sensors, handleDragEnd };
};

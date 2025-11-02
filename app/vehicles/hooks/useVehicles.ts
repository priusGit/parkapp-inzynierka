import { User } from "firebase/auth";
import { useVehicleList } from "./useVehicleList";
import { useVehicleAdd } from "./useVehicleAdd";
import { useVehicleEdit } from "./useVehicleEdit";
import { useVehicleDelete } from "./useVehicleDelete";

export const useVehicles = (user: User | null) => {
  const { vehicles, loading } = useVehicleList(user);
  const {
    showAddForm,
    setShowAddForm,
    newVehicleName,
    setNewVehicleName,
    addingVehicle,
    handleAddVehicle,
    cancelAdd,
  } = useVehicleAdd(user);
  const {
    editingVehicle,
    editedName,
    setEditedName,
    startEdit,
    saveEdit,
    cancelEdit,
  } = useVehicleEdit();
  const { handleDeleteVehicle } = useVehicleDelete();

  return {
    vehicles,
    loading,
    showAddForm,
    setShowAddForm,
    newVehicleName,
    setNewVehicleName,
    addingVehicle,
    editingVehicle,
    editedName,
    setEditedName,
    actions: {
      add: {
        submit: handleAddVehicle,
        cancel: cancelAdd,
      },
      edit: {
        start: startEdit,
        save: saveEdit,
        cancel: cancelEdit,
      },
      delete: {
        remove: handleDeleteVehicle,
      },
    },
  };
};

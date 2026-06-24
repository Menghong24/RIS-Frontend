// composables/useCollection.js
import { ref } from "vue";
import api from "../config/api";
import { useToast } from "vue-toastification";

export function useCollection(collectionName) {
  const loading = ref(false);
  const error = ref(null);
  const toast = useToast();

  // ✅ Create new document
  const createDoc = async (data) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post(`/${collectionName}`, data);
      // toast.success("ជោគជ័យ!");
      return response.data;
    } catch (err) {
      console.error(err);
      // toast.error("បរាជ័យ!");
      error.value = err;
      return null;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Update existing document
  const updateDoc = async (id, data) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.patch(`/${collectionName}/${id}`, data);
      toast.success("update data successfully!");
      return response.data;
    } catch (err) {
      console.error(err);
      toast.error("Failed to update data.");
      error.value = err;
      return null;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Delete document
  const deleteDoc = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.delete(`/${collectionName}/${id}`);
      toast.success("Deleted data successfully!");
      return response.data;
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete data.");
      error.value = err;
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    createDoc,
    updateDoc,
    deleteDoc,
    loading,
    error,
  };
}

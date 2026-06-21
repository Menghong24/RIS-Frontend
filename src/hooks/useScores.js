import { ref } from "vue";
import api from "../config/api"; // Matches your existing API setup
import { useToast } from "vue-toastification"; // Matches your existing toast setup

export function useScores() {
  const scores = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const toast = useToast();

  // 1. Fetch scores by class with filters
  const fetchScores = async (filters) => {
    loading.value = true;
    error.value = null;
    try {
      // filters contains { classId, subjectId, type, month, semester, academicYear }
      const response = await api.get("/scores", { params: filters });
      scores.value = response.data;
    } catch (err) {
      error.value = err.response?.data?.error || "បរាជ័យក្នុងការទាញយកទិន្នន័យពិន្ទុ";
      toast.error(error.value);
    } finally {
      loading.value = false;
    }
  };

  // 2. Save or update a Single Score (Atomic Upsert)
  const saveSingleScore = async (scoreData) => {
    loading.value = true;
    try {
      const response = await api.post("/scores", scoreData);
      toast.success("រក្សាទុកពិន្ទុម្នាក់ៗបានជោគជ័យ");
      return response.data;
    } catch (err) {
      const errMsg = err.response?.data?.error || "មិនអាចរក្សាទុកពិន្ទុបានទេ";
      toast.error(errMsg);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 3. Save entire class scores at once (Bulk Save)
  const saveBulkScores = async (bulkData) => {
    loading.value = true;
    try {
      // bulkData contains { classId, subjectId, type, month, semester, academicYear, scores: [...] }
      const response = await api.post("/scores/bulk", bulkData);
      toast.success("រក្សាទុកពិន្ទុទាំងកញ្ចប់ជោគជ័យ");
      return response.data;
    } catch (err) {
      const errMsg = err.response?.data?.error || "បរាជ័យក្នុងការរក្សាទុកពិន្ទុទាំងកញ្ចប់";
      toast.error(errMsg);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 4. Delete an individual score record
  const deleteScoreRecord = async (scoreId) => {
    loading.value = true;
    try {
      await api.delete(`/scores/${scoreId}`);
      toast.success("លុបពិន្ទុរួចរាល់");
      // Update local state by removing the deleted item
      scores.value = scores.value.filter(s => s._id !== scoreId);
    } catch (err) {
      const errMsg = err.response?.data?.error || "មិនអាចលុបពិន្ទុបានឡើយ";
      toast.error(errMsg);
    } finally {
      loading.value = false;
    }
  };

  return {
    scores,
    loading,
    error,
    fetchScores,
    saveSingleScore,
    saveBulkScores,
    deleteScoreRecord
  };
}
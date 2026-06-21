import { ref, onMounted } from "vue";
import api from "../config/api";


export function useQuery(collectionName) {
  const data = ref([]);

  const fetchData = async () => {
    try {
      const response = await api.get(`/${collectionName}`);
      data.value = response.data;
    } catch (error) {
      console.error(error);
    }
  };

  onMounted(() => {
    fetchData();
  });

  return {
    data,
    fetchData, // expose if you want to refetch manually
  };
}

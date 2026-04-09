import { useState, useEffect } from 'react';
import api from '../utils/api';

export const useExperiment = (id) => {
  const [loading, setLoading] = useState(true);
  const [experiment, setExperiment] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchExperiment = async () => {
      try {
        const res = await api.get(`/experiments/${id}`);
        setExperiment(res.data.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load experiment');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiment();
  }, [id]);

  return { loading, experiment, error };
};

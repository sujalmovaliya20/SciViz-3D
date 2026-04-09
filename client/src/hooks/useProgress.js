import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const useProgress = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState([]);

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const res = await api.get('/progress');
      setProgress(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch progress');
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (experimentId, data) => {
    try {
      await api.post(`/progress/${experimentId}`, data);
      fetchProgress();
    } catch (err) {
      console.error('Failed to update progress');
    }
  };

  return { loading, progress, fetchProgress, updateProgress };
};

import { create } from 'zustand';
import axios from 'axios';

const useExperimentStore = create((set, get) => ({
  experiment: null,
  currentStep: 0,
  isPlaying: false,
  controlValues: {},
  loading: false,
  error: null,
  
  // Actions
  fetchExperiment: async (sceneKey) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/api/experiments/scene/${sceneKey}`);
      set({ 
        experiment: res.data?.data || null, 
        loading: false,
        controlValues: res.data?.data?.defaultControls || {}
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  setStep: (step) => set({ currentStep: step }),
  
  nextStep: () => {
    const { currentStep, experiment } = get();
    if (experiment && currentStep < (experiment.steps?.length || 1) - 1) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  
  setControlValue: (key, value) => set((state) => ({
    controlValues: { ...state.controlValues, [key]: value }
  })),

  resetControls: () => set((state) => ({
    controlValues: state.experiment?.defaultControls || {}
  })),

  syncProgress: async (experimentId, currentStep, totalSteps) => {
    try {
      await axios.post('/api/progress/update', {
        experimentId,
        currentStep: currentStep + 1,
        totalSteps,
        timeSpent: 0.5 // Incremental time
      });
    } catch (err) {
      console.error('Progress sync failed:', err);
    }
  }
}));

export default useExperimentStore;

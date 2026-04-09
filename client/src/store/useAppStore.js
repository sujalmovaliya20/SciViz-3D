import { create } from 'zustand';

const getAccent = (subject) => ({
  all: '#00e5ff',
  physics: '#00e5ff', 
  chemistry: '#a855f7',
  biology: '#22c55e'
}[subject] || '#00e5ff');

const useAppStore = create((set) => ({
  activeSubject: 'all',
  activeClass: 'all',
  searchQuery: '',
  accentColor: '#00e5ff',
  setActiveSubject: (subject) => set({ 
    activeSubject: subject, 
    accentColor: getAccent(subject) 
  }),
  setActiveClass: (cls) => set({ activeClass: cls }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

export default useAppStore;

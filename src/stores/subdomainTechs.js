import { defineStore } from 'pinia';
import { techStacksAPI } from '@/services/api';

export const useSubdomainTechsStore = defineStore('subdomainTechs', {
  state: () => ({
    techStacks: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchTechStacks(subdomainId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await techStacksAPI.getBySubdomain(subdomainId);
        this.techStacks = response.data.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Errore nel caricamento delle tecnologie';
        console.error('Errore fetch tech stacks:', error);
      } finally {
        this.loading = false;
      }
    },

    async addTechStack(subdomainId, techData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await techStacksAPI.create(subdomainId, techData);
        this.techStacks.push(response.data.data);
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Errore nell\'aggiunta della tecnologia';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateTechStack(id, techData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await techStacksAPI.update(id, techData);
        const index = this.techStacks.findIndex(t => t._id === id);
        if (index !== -1) this.techStacks[index] = response.data.data;
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Errore nell\'aggiornamento della tecnologia';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteTechStack(id) {
      this.loading = true;
      this.error = null;
      try {
        await techStacksAPI.delete(id);
        this.techStacks = this.techStacks.filter(t => t._id !== id);
      } catch (error) {
        this.error = error.response?.data?.error || 'Errore nell\'eliminazione della tecnologia';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});

<template>
  <div 
    v-if="show" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="close"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
      <div class="flex justify-between items-center p-6 border-b">
        <h2 class="text-2xl font-bold">{{ isEdit ? 'Modifica Progetto' : 'Nuovo Progetto' }}</h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nome Progetto *</label>
          <input 
            v-model="formData.name" 
            type="text" 
            required
            class="input-field"
            placeholder="Es: Acme Corp Pentest 2024"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Dominio *</label>
          <input 
            v-model="formData.domain" 
            type="text" 
            required
            class="input-field"
            placeholder="Es: example.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
          <input 
            v-model="formData.client" 
            type="text" 
            required
            class="input-field"
            placeholder="Es: Acme Corporation"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Data Inizio</label>
            <input 
              v-model="formData.startDate" 
              type="date" 
              class="input-field"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Data Fine</label>
            <input 
              v-model="formData.endDate" 
              type="date" 
              class="input-field"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="formData.status" class="input-field">
            <option value="in-progress">In corso</option>
            <option value="completed">Completato</option>
            <option value="archived">Archiviato</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
          <textarea 
            v-model="formData.description" 
            rows="3"
            class="input-field"
            placeholder="Descrizione del progetto..."
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button type="button" @click="close" class="btn-secondary">
            Annulla
          </button>
          <button type="submit" class="btn-primary">
            {{ isEdit ? 'Salva Modifiche' : 'Crea Progetto' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: Boolean,
  project: Object
});

const emit = defineEmits(['close', 'submit']);

const isEdit = ref(false);
const formData = ref({
  name: '',
  domain: '',
  client: '',
  startDate: '',
  endDate: '',
  status: 'in-progress',
  description: ''
});


const resetForm = () => {
  formData.value = {
    name: '',
    domain: '',
    client: '',
    startDate: '',
    endDate: '',
    status: 'in-progress',
    description: ''
  };
};

watch(() => props.project, (newProject) => {
  if (newProject) {
    isEdit.value = true;
    formData.value = {
      name: newProject.name || '',
      domain: newProject.domain || '',
      client: newProject.client || '',
      startDate: newProject.startDate ? newProject.startDate.split('T')[0] : '',
      endDate: newProject.endDate ? newProject.endDate.split('T')[0] : '',
      status: newProject.status || 'in-progress',
      description: newProject.description || ''
    };
  } else {
    isEdit.value = false;
    resetForm();
  }
}, { immediate: true });

const close = () => {
  emit('close');
  resetForm();
};

const handleSubmit = () => {
  emit('submit', formData.value);
  close();
};
</script>
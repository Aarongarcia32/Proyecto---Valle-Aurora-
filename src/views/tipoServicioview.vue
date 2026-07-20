<template>
  <div class="gestion-servicios">
    <h2>Crear Tipo de Servicio</h2>

    <form @submit.prevent="handleSubmit" class="formulario-servicio">
      
      <div class="form-row">
        <div class="form-group">
          <label>Nombre del Servicio:</label>
          <input v-model="form.nombre" type="text" placeholder="Ej. Lavandería, Mantenimiento AC" required />
        </div>

        <div class="form-group">
          <label>Categoría:</label>
          <select v-model="form.categoria" required>
            <option value="Amenidad">Amenidad</option>
            <option value="Cuota">Cuota</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Reparación">Reparación</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label>Descripción:</label>
        <textarea v-model="form.descripcion" placeholder="Detalles del servicio..." rows="3"></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Precio Base ($ MXN):</label>
          <input v-model.number="form.precio_base" type="number" min="0" required />
        </div>

        <div class="form-group">
          <label>Unidad de Cobro:</label>
          <select v-model="form.unidad" required>
            <option value="Evento">Evento</option>
            <option value="Mensual">Mensual</option>
            <option value="Hora">Hora</option>
            <option value="Metros Cuadrados">Metros Cuadrados</option>
          </select>
        </div>
      </div>

      <div class="form-row items-center">
        <div class="form-group">
          <label>Duración Estimada (Minutos):</label>
          <input v-model.number="form.duracion_estimada_minutos" type="number" min="0" required />
        </div>

        <div class="form-group checkbox-group">
          <label>
            <input type="checkbox" v-model="form.activo" />
            Servicio Activo
          </label>
        </div>
      </div>

      <hr />

      <div class="form-group checkbox-group programación-toggle">
        <label class="destacado">
          <input type="checkbox" v-model="form.requiere_programacion" />
          ¿Este servicio requiere programación previa?
        </label>
      </div>

      <div v-if="form.requiere_programacion" class="campos-programacion">
        <h3>Programación Obligatoria</h3>
        <div class="form-row">
          <div class="form-group">
            <label>Fecha sugerida/ejecución:</label>
            <input v-model="form.fecha_servicio" type="date" :required="form.requiere_programacion" />
          </div>
          <div class="form-group">
            <label>Hora sugerida/ejecución:</label>
            <input v-model="form.hora_servicio" type="time" :required="form.requiere_programacion" />
          </div>
        </div>
      </div>

      <!-- Botón de acción -->
      <button type="submit" :disabled="store.loading" class="btn-guardar">
        {{ store.loading ? 'Guardando en Firebase...' : 'Registrar Servicio' }}
      </button>

    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useTipoServicioStore } from '../stores/tipoServicioStore';

const store = useTipoServicioStore();

const limpiarFormulario = () => ({
  nombre: '',
  categoria: 'Amenidad',
  descripcion: '',
  precio_base: 0,
  unidad: 'Evento',
  activo: true,
  requiere_programacion: false,
  duracion_estimada_minutos: 30,
  fecha_servicio: '',
  hora_servicio: ''
});

const form = ref(limpiarFormulario());

const handleSubmit = async () => {
  try {
    const payload = { ...form.value };

    if (!payload.requiere_programacion) {
      delete payload.fecha_servicio;
      delete payload.hora_servicio;
    }

    await store.guardarServicio(payload);
    
    alert('¡Servicio registrado exitosamente!');
    form.value = limpiarFormulario(); 
  } catch (error) {
    alert('Hubo un error al guardar en la base de datos.');
  }
};
</script>

<style scoped>
.gestion-servicios {
  max-width: 700px;
  margin: 20px auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.formulario-servicio {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.items-center {
  align-items: center;
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

input[type="text"], input[type="number"], input[type="date"], input[type="time"], select, textarea {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.programación-toggle {
  background: #f0f7f4;
  padding: 10px;
  border-radius: 4px;
}

.destacado {
  font-weight: bold;
  color: #2c3e50;
}

.campos-programacion {
  background: #fff8f0;
  border-left: 4px solid #f39c12;
  padding: 15px;
  border-radius: 0 4px 4px 0;
}

.campos-programacion h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #e67e22;
}

.btn-guardar {
  background: #42b983;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-guardar:hover {
  background: #3aa373;
}

.btn-guardar:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

hr {
  border: 0;
  border-top: 1px solid #eee;
}
</style>
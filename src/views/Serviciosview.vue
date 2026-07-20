<script setup>
import { ref } from 'vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import NavBar from '../components/NavBar.vue'
import { db } from '../config/firebase'

import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const loading = ref(false)

const resetForm = () => ({
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
})

const form = ref(resetForm())

const handleSubmit = async () => {
  loading.value = true
  try {
    const payload = { ...form.value }

    if (!payload.requiere_programacion) {
      delete payload.fecha_servicio
      delete payload.hora_servicio
    }

    // Guardado directo en Firebase
    await addDoc(collection(db, 'tipos_servicio'), {
      ...payload,
      creado: serverTimestamp(),
      actualizado: serverTimestamp()
    })

    alert('¡Servicio guardado con éxito en Firestore!')
    form.value = resetForm() // Limpiar formulario
  } catch (error) {
    console.error("Error al guardar en Firebase:", error)
    alert('Error al conectar con Firestore. Revisa tu archivo firebase.js o la consola.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <DashboardLayout>
    <template #navbar><NavBar /></template>

    <div class="space-y-6">
      <!-- Fila Superior: Tus dos tarjetas actuales -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 class="font-bold text-slate-800 text-lg mb-2">Solicitudes de Reparación</h3>
          <p class="text-xs text-slate-500 mb-4">Reportes generados por los residentes de los departamentos.</p>
          
          <div class="p-4 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
            <p class="font-bold">⚠️ Fuga de Agua - Torre B Depto 304</p>
            <p class="text-slate-600">Prioridad Alta • Asignado a personal de Plomería.</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 class="font-bold text-slate-800 text-lg mb-2">Historial de Trabajos</h3>
          <p class="text-xs text-slate-500 mb-4">Servicios técnicos concluidos con éxito este mes.</p>
          <p class="text-sm text-slate-400 italic">No hay servicios finalizados el día de hoy.</p>
        </div>
      </div>

      <!-- Fila Inferior: Formulario adaptado a Tailwind CSS -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 class="font-bold text-slate-800 text-lg mb-1">Registrar Nuevo Tipo de Servicio</h3>
        <p class="text-xs text-slate-500 mb-6">Agrega servicios, amenidades, mantenimientos o cuotas al catálogo.</p>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          
          <!-- Bloque 1: Nombre y Categoría -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-slate-600">Nombre del Servicio</label>
              <input v-model="form.nombre" type="text" placeholder="Ej. Alberca, Pintura Fachada" class="px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500" required />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-slate-600">Categoría</label>
              <select v-model="form.categoria" class="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-500" required>
                <option value="Amenidad">Amenidad</option>
                <option value="Cuota">Cuota</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Reparación">Reparación</option>
              </select>
            </div>
          </div>

          <!-- Bloque 2: Descripción -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-slate-600">Descripción</label>
            <textarea v-model="form.descripcion" placeholder="Detalles específicos sobre la tarifa o el alcance del servicio..." rows="2" class="px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"></textarea>
          </div>

          <!-- Bloque 3: Precio, Unidad y Duración -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-slate-600">Precio Base ($ MXN)</label>
              <input v-model.number="form.precio_base" type="number" min="0" class="px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500" required />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-slate-600">Unidad de cobro</label>
              <select v-model="form.unidad" class="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-500" required>
                <option value="Evento">Evento</option>
                <option value="Mensual">Mensual</option>
                <option value="Hora">Hora</option>
                <option value="Metros Cuadrados">Metros Cuadrados</option>
              </select>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-slate-600">Duración Estimada (Minutos)</label>
              <input v-model.number="form.duracion_estimada_minutos" type="number" min="0" class="px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500" required />
            </div>
          </div>

          <!-- Bloque 4: Checkbox de Activo -->
          <div class="flex items-center gap-2 py-1">
            <input type="checkbox" id="activo" v-model="form.activo" class="rounded text-indigo-600 focus:ring-indigo-500" />
            <label for="activo" class="text-xs font-medium text-slate-700 cursor-pointer">Servicio Activo (Habilitado para uso inmediato)</label>
          </div>

          <hr class="border-slate-100" />

          <!-- CONTROL DINÁMICO: Requiere programación -->
          <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
            <input type="checkbox" id="programacion" v-model="form.requiere_programacion" class="rounded text-indigo-600 focus:ring-indigo-500" />
            <label for="programacion" class="text-xs font-bold text-slate-800 cursor-pointer">¿Este servicio requiere programación previa de agenda?</label>
          </div>

          <!-- Campos dinámicos de Fecha y Hora con Tailwind -->
          <div v-if="form.requiere_programacion" class="p-4 bg-amber-50/40 border border-amber-200 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-amber-900">Fecha del servicio</label>
              <input v-model="form.fecha_servicio" type="date" class="px-3 py-2 text-sm border border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 bg-white" :required="form.requiere_programacion" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-amber-900">Hora del servicio</label>
              <input v-model="form.hora_servicio" type="time" class="px-3 py-2 text-sm border border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 bg-white" :required="form.requiere_programacion" />
            </div>
          </div>

          <!-- Botón de Envío -->
          <div class="pt-2">
            <button type="submit" :disabled="loading" class="w-full md:w-auto px-6 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-xl shadow-sm hover:bg-indigo-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed">
              {{ loading ? 'Guardando en Firebase...' : 'Guardar en Base de Datos' }}
            </button>
          </div>

        </form>
      </div>
    </div>
  </DashboardLayout>
</template>
<script setup lang="ts">
const route = useRoute()
const id = route.params.id

const { 
  formData, isSubmitting, loadingUsers, usuarios, 
  apiBase, validate, fetchUsers, addToast 
} = useDepartmentForm(`dept-edit-${id}`) // Key única por ID

const pendingData = ref(true)

// Cargar datos del departamento y la lista de usuarios
onMounted(async () => {
  await fetchUsers()
  try {
    const data: any = await $fetch(`${apiBase}/departments/${id}`)
    if (data) {
      formData.value.nombre = data.nombre
      formData.value.codigo = data.codigo
      formData.value.responsableId = data.responsableId
    }
  } catch (e) {
    addToast('No se pudo cargar el departamento', 'error')
  } finally {
    pendingData.value = false
  }
})

const handleUpdate = async () => {
  if (!validate()) return
  isSubmitting.value = true
  try {
    await $fetch(`${apiBase}/departments/update/${id}`, {
      method: 'PUT',
      body: formData.value
    })
    addToast('Actualizado correctamente', 'success')
    navigateTo('/departamentos')
  } catch (err: any) {
    addToast('Error al actualizar', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>
// la página es CSR porque tanto la query como la mutation utilizadas
// necesitan varios parámetros que el cliente debe dar, siendo estos año,
// mes y día (y hora y DNI para la mutation bookSlot). Se podría hacer
// la query getAvailableSlots con SSR utilizando varias páginas con el estilo /[año]/[mes]/[dia],
// pero no sería para nada eficiente, teniendo que reescribir el mismo código
// varias veces y creando numerosas páginas cuando en realidad solo se necesita
// una. En cualquier caso, la mutation deben ser por CSR obligatoriamente.

import PatientData from '@/components/patientData';

export default function PatientPage() {

  return (
    <>
    <PatientData></PatientData>
    </>
  )
}

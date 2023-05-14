// la página es CSR porque tanto la query como la mutation utilizadas
// necesitan varios parámetros que el cliente debe dar, siendo estos año,
// mes y día (y hora y DNI para la mutation bookSlot).

import PatientData from '@/components/patientData';

export default function PatientPage() {

  return (
    <>
    <PatientData></PatientData>
    </>
  )
}

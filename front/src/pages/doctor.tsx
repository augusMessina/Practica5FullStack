// la página es CSR porque tanto la query como las mutations utilizadas
// necesitan varios parámetros que el cliente debe dar, siendo estos año,
// mes y día (y hora para las mutations addSlot y removeSlot). Se podría hacer
// la query getAvailableSlots con SSR, utilizando varias páginas con el estilo /[año]/[mes]/[dia],
// pero no sería para nada eficiente, teniendo que reescribir el mismo código
// varias veces y creando numerosas páginas cuando en realidad solo se necesita
// una. En cualquier caso, las mutations deben ser por CSR obligatoriamente.

import DoctorData from '@/components/doctorData';

export default function DoctorPage() {

  return (
    <>
    <DoctorData></DoctorData>
    </>
  )
}

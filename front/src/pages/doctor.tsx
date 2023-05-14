// la página es CSR porque tanto la query como las mutations utilizadas
// necesitan varios parámetros que el cliente debe dar, siendo estos año,
// mes y día (y hora para las mutations addSlot y removeSlot).

import DoctorData from '@/components/doctorData';

export default function DoctorPage() {

  return (
    <>
    <DoctorData></DoctorData>
    </>
  )
}

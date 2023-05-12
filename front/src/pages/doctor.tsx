import Agenda from '@/components/agenda'
import DoctorData from '@/components/doctorData';
import { getClientSSR } from '@/utils/apolloclient';
import { gql } from '@apollo/client';
import Link from 'next/link'
import internal from 'stream';


export default function DoctorPage() {

  return (
    <>
    <DoctorData></DoctorData>
    </>
  )
}

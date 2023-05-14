import { useEffect, useState } from "react";
import { Menu, Title, BlueBorderMenu, ItemsList, BlueButton, ContactInfo, ErrorMessage, RedButton, GreenBorderMenu } from "../styles/myStyledComponents";
import { gql, useMutation, useQuery } from "@apollo/client";

type QueryResponse = {availableSlots: {
    available: true,
    year: number,
    month: number,
    day: number,
    hour: number,
    dni: string
}[]};

type BookSlotResponse = {bookSlot: {
    available: true,
    year: number,
    month: number,
    day: number,
    hour: number,
    dni: string
}[]};

const PatientData = () => {

    const currentDate = new Date();

    const [searchDate, setSearchDate] = useState<{year: number, month: number, day?: number}>({
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() +1
    })

    const [inputDNI, setInputDNI] = useState<string>("");
    const [showError, setShowError] = useState<boolean>(false);

    const [inputYear, setInputYear] = useState<string>("");
    const [inputMonth, setInputMonth] = useState<string>("");
    const [inputDay, setInputDay] = useState<string>("");


    const query = gql`
    query AvailableSlots($year: Int!, $month: Int!, $day: Int) {
        availableSlots(year: $year, month: $month, day: $day) {
          available
          year
          month
          day
          hour
          dni
        }
      }
    `;

    const mutationBookSlot = gql`
    mutation BookSlot($year: Int!, $month: Int!, $day: Int!, $hour: Int!, $dni: String!) {
        bookSlot(year: $year, month: $month, day: $day, hour: $hour, dni: $dni) {
          day
          month
          year
          hour
          available
          dni
        }
      }
    `;

    const queryAnswer = useQuery<QueryResponse>(query, {
        variables:{
            year: searchDate.year,
            month: searchDate.month,
            day: searchDate.day
        },
        fetchPolicy: "network-only",
    });

    const [bookSlot] = useMutation<BookSlotResponse>(mutationBookSlot)

    async function bookSlotFunction(year: number, month: number, day: number, hour: number, dni: string) {
        await bookSlot({variables:{
            year,
            month,
            day,
            hour,
            dni
        }});
        await queryAnswer.refetch();
    }

    if(queryAnswer.loading){
        return(
            <>
            <h1>Loading..</h1>
            </>
        )
    }

    return(
        <>
        <Menu>
            <h1>Welcome patient :)</h1>
            <BlueBorderMenu style={{borderColor: "green"}}>
                {
                    <>
                    <Title style={{background: "green"}}>Available Slots</Title>
                    <div style={{display: "flex", flexDirection: "column", gap: "5px"}}>
                        <p>DNI (in case you want to book)</p>
                        <input placeholder={`DNI..`} onChange={(e) => {setInputDNI(e.target.value)}}></input>
                        {
                            showError && <ErrorMessage>DNI must be filled in order to book!</ErrorMessage>
                        }
                        <p style={{margin: 0}}>Year: </p>
                        <input value={inputYear} placeholder={`(${currentDate.getFullYear()})`} onChange={(e) => {setInputYear(e.target.value)}}></input>
                        <p style={{margin: 0}}>Month: </p>
                        <input value={inputMonth} placeholder={`(${currentDate.getMonth()+1})`} onChange={(e) => {setInputMonth(e.target.value)}}></input>
                        <p style={{margin: 0}}>Day (optional): </p>
                        <input value={inputDay} placeholder={`Day..`} onChange={(e) => {setInputDay(e.target.value)}}></input>
                        <BlueButton onClick={() => {
                            setSearchDate({
                                year: parseInt(inputYear),
                                month: parseInt(inputMonth),
                                day: parseInt(inputDay)
                            })
                        } }>Search</BlueButton>
                    </div>
                    

                    {
                        queryAnswer.error ?
                        <ErrorMessage>Make sure to include a valid month/year</ErrorMessage>
                        :
                        <ItemsList>
                            {
                                queryAnswer.data?.availableSlots.map(slot => {
                                    if(slot.available){
                                        return(<>
                                            <div style={{display: "flex", flexDirection: "row", alignItems: "center", gap: "5px"}}>
                                            <li>{slot.day}/{slot.month}/{slot.year} at {slot.hour}h</li>
                                            {
                                                <BlueButton onClick={() => {
                                                    if(inputDNI!=""){
                                                        bookSlotFunction(slot.year, slot.month, slot.day, slot.hour, inputDNI);
                                                        setShowError(false);
                                                    } else {
                                                        setShowError(true);
                                                    }}
                                                }>Book</BlueButton>
                                            }
                                            </div> 
                                        </>)
                                    } else {
                                        return(<></>)
                                    }
                                })
                            }
                        </ItemsList>
                    }


                    

                    </>
                }

            </BlueBorderMenu>
            
        </Menu>
        </>
        
    )
}

export default PatientData;
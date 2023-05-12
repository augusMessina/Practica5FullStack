import { useEffect, useState } from "react";
import { Menu, Title, AgendaMenu, ContactList, BlueButton, ContactInfo, ErrorMessage } from "../styles/myStyledComponents";
import { gql, useMutation, useQuery } from "@apollo/client";

type QueryResponse = {availableSlots: {
    available: true,
    year: number,
    month: number,
    day: number,
    hour: number,
    dni: string
}[]};

type AddSlotResponse = {addSlot: {
    available: true,
    year: number,
    month: number,
    day: number,
    hour: number,
    dni: string
}[]};

const DoctorData = () => {

    const currentDate = new Date();

    const [searchDate, setSearchDate] = useState<{year: number, month: number}>({
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() +1
    })

    const [inputYear, setInputYear] = useState<number>(currentDate.getFullYear());
    const [inputMonth, setInputMonth] = useState<number>(currentDate.getMonth()+1);

    const [mutationParams, setMutationParams] = useState<{
        year: string,
        month: string,
        day: string,
        hour: string,
    }>({year:"",month:"",day:"",hour:""});

    const query = gql`
    query AvailableSlots($year: Int!, $month: Int!) {
        availableSlots(year: $year, month: $month) {
          available
          year
          month
          day
          hour
          dni
        }
      }
    `;

    const mutation = gql`
    mutation AddSlot($year: Int!, $month: Int!, $day: Int!, $hour: Int!) {
        addSlot(year: $year, month: $month, day: $day, hour: $hour) {
            available
            year
            month
            day
            hour
            dni
        }
      }
    `;

    const queryAnswer = useQuery<QueryResponse>(query, {
        variables:{
            year: searchDate?.year,
            month: searchDate?.month
        }
    });

    const [mutateFunction, mutationAnswer] = useMutation<AddSlotResponse>(mutation);

    function addSlotFunction() {
        mutateFunction({variables:{
            year: parseInt(mutationParams.year),
            month: parseInt(mutationParams.month),
            day: parseInt(mutationParams.day),
            hour: parseInt(mutationParams.hour),
        }});
        queryAnswer.refetch();
        setMutationParams({
            year: "",
            month: "",
            day: "",
            hour: "",
        })
    }

    if(queryAnswer.loading){
        return(
            <>
            <h1>Loading..</h1>
            </>
        )
    }

    if(queryAnswer.error){
        return(
            <>
            <h1>Error (NOOOOOOOOO)</h1>
            </>
        )
    }

    return(
        <>
        <Menu>
            <AgendaMenu>
                {
                    <>
                    <Title>Slots Added</Title>
                    <div>
                        <p>Year: </p>
                        <input placeholder="Year.." onChange={(e) => {setInputYear(parseInt(e.target.value))}}></input>
                        <p>Month: </p>
                        <input placeholder="Month.." onChange={(e) => {setInputMonth(parseInt(e.target.value))}}></input>
                        <BlueButton onClick={() => {
                            setSearchDate({
                                year: inputYear,
                                month: inputMonth
                            })
                        } }>Search</BlueButton>
                    </div>
                    
                    <ContactList>
                        {
                            queryAnswer.data?.availableSlots.map(slot => {
                                return(<>
                                    <li>{slot.day}/{slot.month}/{slot.year} at {slot.hour}h</li>
                                </>)
                            })
                        }
                    </ContactList>

                    <Title>Add Slots</Title>

                    <input value={mutationParams.year} type="number" placeholder="Year.." onChange={(e) => setMutationParams({
                        year: e.target.value,
                        month: mutationParams.month,
                        day: mutationParams.day,
                        hour: mutationParams.hour,
                    })}></input>
                    <input value={mutationParams.month} type="number" placeholder="Month.." onChange={(e) => setMutationParams({
                        year: mutationParams.year,
                        month: e.target.value,
                        day: mutationParams.day,
                        hour: mutationParams.hour,
                    })}></input>
                    <input value={mutationParams.day} type="number" placeholder="Day.." onChange={(e) => setMutationParams({
                        year: mutationParams.year,
                        month: mutationParams.month,
                        day: e.target.value,
                        hour: mutationParams.hour,
                    })}></input>
                    <input value={mutationParams.hour} type="number" placeholder="Hour.." onChange={(e) => setMutationParams({
                        year: mutationParams.year,
                        month: mutationParams.month,
                        day: mutationParams.day,
                        hour: e.target.value
                    })}></input>
                    <BlueButton onClick={() => addSlotFunction()} >Add</BlueButton>
                    {
                        mutationAnswer.error && <ErrorMessage>Error, either invalid date or slot already added.</ErrorMessage>
                    }
                    </>
                }

                {/* <Title>Add Words</Title>
                <input placeholder="Word.." value={newWord} onChange={(e) => {setNewWord(e.target.value)}}></input>
                <BlueButton onClick={() => {
                    mutateFunction({variables: {word: newWord}});
                    setNewWord("");
                    const newList = wordList;
                    newList.push({word:newWord})
                    setWorldList(newList);
                    }}>Add</BlueButton> */}

            </AgendaMenu>
            
        </Menu>
        </>
        
    )
}

export default DoctorData;
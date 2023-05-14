import { useEffect, useState } from "react";
import { Menu, Title, BlueBorderMenu, ItemsList, BlueButton, ContactInfo, ErrorMessage, RedButton } from "../styles/myStyledComponents";
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

type RemoveSlotResponse = {addSlot: {
    available: true,
    year: number,
    month: number,
    day: number,
    hour: number,
    dni: string
}[]};

const DoctorData = () => {

    const currentDate = new Date();

    const [searchDate, setSearchDate] = useState<{year: number, month: number, day?: number}>({
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() +1
    })

    const [inputYear, setInputYear] = useState<string>("");
    const [inputMonth, setInputMonth] = useState<string>("");
    const [inputDay, setInputDay] = useState<string>("");

    const [mutationParams, setMutationParams] = useState<{
        year: string,
        month: string,
        day: string,
        hour: string,
    }>({year:"",month:"",day:"",hour:""});

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

    const mutationAddSlot = gql`
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

    const mutationRemoveSlot = gql`
    mutation RemoveSlot($year: Int!, $month: Int!, $day: Int!, $hour: Int!) {
        removeSlot(year: $year, month: $month, day: $day, hour: $hour) {
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
            year: searchDate.year,
            month: searchDate.month,
            day: searchDate.day
        },
        fetchPolicy: "network-only"
    });

    

    const [addSlot, addSlotAnswer] = useMutation<AddSlotResponse>(mutationAddSlot);

    const [removeSlot] = useMutation<RemoveSlotResponse>(mutationRemoveSlot)

    async function addSlotFunction() {
        try{
            await addSlot({variables:{
                year: parseInt(mutationParams.year),
                month: parseInt(mutationParams.month),
                day: parseInt(mutationParams.day),
                hour: parseInt(mutationParams.hour),
            }});
            await queryAnswer.refetch();
            setMutationParams({
                year: "",
                month: "",
                day: "",
                hour: "",
            });
        } catch{

        }
        
    }

    async function removeSlotFunction(year: number, month: number, day: number, hour: number) {
        await removeSlot({variables:{
            year,
            month,
            day,
            hour
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
            <h1>Welcome doctor :)</h1>
            <BlueBorderMenu>
                {
                    <>
                    <Title>Available Slots</Title>
                    <div style={{display: "flex", flexDirection: "column", gap: "5px"}}>
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
                                return(<>
                                    <div style={{display: "flex", flexDirection: "row", alignItems: "center", gap: "5px"}}>
                                        <li>{slot.day}/{slot.month}/{slot.year} at {slot.hour}h</li>
                                        <RedButton onClick={() => {
                                            removeSlotFunction(slot.year, slot.month, slot.day, slot.hour);
                                        }}>
                                            <i className="gg-trash"></i>
                                        </RedButton>
                                        
                                        
                                    </div>
                                </>)
                            })
                        }
                        </ItemsList>
                    }

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
                        addSlotAnswer.error && <ErrorMessage>Error, either invalid date or slot already added/booked.</ErrorMessage>
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

            </BlueBorderMenu>
            
        </Menu>
        </>
        
    )
}

export default DoctorData;
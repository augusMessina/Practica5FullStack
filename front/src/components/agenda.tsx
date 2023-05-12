import { useEffect, useState } from "react";
import { Menu, Title, AgendaMenu, ContactList, BlueButton, ContactInfo } from "../styles/myStyledComponents";
import { gql, useMutation, useQuery } from "@apollo/client";

type GraphQLResponse = {getWords:{word: string}[]};

const Agenda = (props:{data: GraphQLResponse}) => {



    

    const mutation = gql`
    mutation ($word: String!) {
        addWord(word: $word) {
          word
        }
      }
    `;

    const [wordList, setWorldList] = useState<{word:string}[]>(props.data.getWords)

    const [newWord, setNewWord] = useState<string>("");

    // const { data, loading, error } = useQuery<GraphQLResponse>(query);

    // if(loading){
    //     return(
    //         <>
    //         <h1>Loading..</h1>
    //         </>
    //     )
    // }

    // if(error){
    //     return(
    //         <>
    //         <h1>Error (NOOOOOOOOO)</h1>
    //         </>
    //     )
    // }

    const [mutateFunction] = useMutation(mutation);

    return(
        <>
        <Menu>
            <AgendaMenu>
                {
                    wordList.length!=0 &&
                    <>
                    <Title>Words</Title>
                    <ContactList>
                        {
                            props.data?.getWords.map(word => {
                                return(<>
                                    <li>{word.word}</li>
                                </>)
                            })
                        }
                    </ContactList>
                    
                    </>
                }

                <Title>Add Words</Title>
                <input placeholder="Word.." value={newWord} onChange={(e) => {setNewWord(e.target.value)}}></input>
                <BlueButton onClick={() => {
                    mutateFunction({variables: {word: newWord}});
                    setNewWord("");
                    const newList = wordList;
                    newList.push({word:newWord})
                    setWorldList(newList);
                    }}>Add</BlueButton>

            </AgendaMenu>
            
        </Menu>
        </>
        
    )
}

export default Agenda;
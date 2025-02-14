import React, {useState,useEffect} from 'react'
function SavedPoems(){
    const [poems,setPoems]=useState([]);
    useEffect(function(){async function getPoems(){const response=await fetch('http://localhost:5000/get_poems');
        const data=await response.json();//or use then
        setPoems(data);


    }getPoems()},[]); //if using function definitions for async functions in useEffect we have to call the function. else use .then

return(<>

<div>
            <h1 style={{textAlign:"center"}}>Saved Poems</h1>
            <ul>
                {poems.map((poem) => (                    //using map on poems state variable as for loop not allowed
                    <li key={poem.id}>
                        <strong>{poem.date} - {poem.topic}:</strong>
                        <p>{poem.poem}</p>
                    </li>
                ))}
            </ul>
        </div>








</>);








}
export default SavedPoems;
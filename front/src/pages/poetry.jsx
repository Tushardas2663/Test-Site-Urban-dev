import React from "react";
import { useState } from "react";
import Title from "./title";
import "../poetry.css"
async function fetchPoem(topic) {
    // Get input value
    const input = topic
    console.log(input)
    // Send data to Flask using POST
    const response = await fetch('http://localhost:5000/poem', {                         //fetch(url,options)         
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: input }),                            //needs json or dict data as string
                                                         // sent data to flask as json string and flask also sent by json.
    });
  
    const data = await response.json(); //gemini to flask to js to html
  
    // Update the page with the result
    return data.poem;
  
  }
function Poetry(){
   const [topic,setTopic]=useState("");
   let a;
    return (
                <>
                <div className="pcontainer">
     
                <section className="pinput-section">
                {/*name is given as attribute, anything can be given, in title.jsx, these passed values accessed using prop */}
                
                    <h1>Personalized Poetry Generator in <Title name="Tushar"/></h1>
                    <textarea name="Enter poem" id="poem" value={a} onChange={(e)=>a=e.target.value}></textarea><br />{/*a is used to prevent simulatneous change, all entered values stored in value attribute, e is predefined */}
                    <button onClick={async()=>{ const poem = await fetchPoem(a);setTopic(poem);}}>Submit</button>
                </section>

                <section className="output-section">

                <h2>Generated Poem</h2>
                <div id="genP">{topic}</div>
                </section>
                </div>
                
                </>
    );
}
export default Poetry;
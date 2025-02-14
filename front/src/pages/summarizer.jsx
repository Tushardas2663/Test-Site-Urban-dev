import React, {useState} from 'react'
import "../summarizer.css";
async function Summary(t){
    console.log(t);
    const response=await fetch('http://localhost:5000/summary', {                         //fetch(url,options)         
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text:t }),                            //needs json or dict data as string
                                                         // sent data to flask as json string and flask also sent by json.
    });
    const data=await response.json(); //not get_json like flask
    return data.summ;


}
function Summarizer(){
    const [text,setText]=useState("");
    let a;
    return(<>
    
    <div className="container">
    <section className="input-section">
    <h1>AI Text Summarizer</h1>
    <textarea id='su' value={a} onChange={(e)=>{a=e.target.value;}}></textarea><br/>
    <button onClick={async ()=>{const summ=await Summary(a);setText(summ);console.log(summ)} }>Submit</button>
    </section>
    <section className="output-section">
        <h2>Summary:</h2>
        <div>{text}</div>
    </section>
    
    </div>
    
    
    </>);
}
export default Summarizer;
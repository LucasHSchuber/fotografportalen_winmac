import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';


function Home() {
    // Define states
    const [name, setName] = useState('');
    const [workname, setWorkname] = useState('');
    const [county, setCounty] = useState('');
    const [anomaly, setAnomaly] = useState('');

    const Navigate = useNavigate();

    //navigate user to index
    const toIndex = () => {
        Navigate('/');
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting form:', name, workname, county, anomaly);
        const currentDate = new Date().toISOString(); // Get the current date in ISO format

        try {

            const result = await window.api.createUser({ name, workname, county, anomaly });
            const resultToComp = await window.api.createUserToComp({ name, workname, county, anomaly, date: currentDate });
            // if (result.success && resultToComp.success) {
                console.log('User created and data saved to desktop successfully');
                setName('');
                setWorkname('');
                setCounty('');
                setAnomaly('');

                //set to localstorage
                localStorage.setItem('user_name', name);
                localStorage.setItem('user_workname', workname);
                localStorage.setItem('user_county', county);
                localStorage.setItem('user_county', anomaly);
            // } else {
            //     console.error('Error creating user or saving data:', result.error || resultToComp.error);
            //     // Handle error case, e.g., show a generic error message or notify the user
            // }
        } catch (err) {
            console.error('Error creating user or saving data:', err);
            // Handle error case, e.g., show a generic error message or notify the user
        }
    };




    return (
        <div className="home-wrapper">
            <h1>Home</h1>
            {/* <button onClick={toIndex}>To Index</button> */}


            <form onSubmit={handleSubmit}>
                <div>
                    <input placeholder='Namn' type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <input placeholder='Jobbnamn' type="text" value={workname} onChange={(e) => setWorkname(e.target.value)} />
                </div>
                <div>
                    <input placeholder='Ort' type="text" value={county} onChange={(e) => setCounty(e.target.value)} />
                </div>
                <div>
                    <textarea placeholder='Avvikelse' type="text" value={anomaly} onChange={(e) => setAnomaly(e.target.value)} cols={50} rows={5}> </textarea>
                </div>
                <button className='button standard' type="submit">Add User</button>
            </form>

        </div>
    );
}
export default Home;
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';


function Home() {
    // Define states
    const [name, setName] = useState('');
    const [workname, setWorkname] = useState('');
    const [county, setCounty] = useState('');

    const Navigate = useNavigate();

    //navigate user to index
    const toIndex = () => {
        Navigate('/');
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting form:', name, workname, county);
        try {
            const result = await window.api.createUser({ name, workname, county });
            console.log('User created successfully');
            setName('');
            setWorkname('');
            setCounty('');

            //set to localstorage
            localStorage.setItem('user_name', name);
            localStorage.setItem('user_workname', workname);
            localStorage.setItem('user_county', county);

        } catch (err) {
            console.error('Error creating user:', err);
            // Handle error case, e.g., show a generic error message or notify the user
        }
    };



    return (
        <div className="">
            <h1>Home</h1>
            <button onClick={toIndex}>To Index</button>


            <form onSubmit={handleSubmit}>
                <div>
                    <input placeholder='Name' type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <input placeholder='Workname' type="text" value={workname} onChange={(e) => setWorkname(e.target.value)} />
                </div>
                <div>
                    <input placeholder='County' type="text" value={county} onChange={(e) => setCounty(e.target.value)} />
                </div>
                <button className='button standard' type="submit">Add User</button>
            </form>



        </div>
    );
}
export default Home;
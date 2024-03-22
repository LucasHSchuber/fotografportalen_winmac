import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';


function Home() {
    // Define states
    const [name, setName] = useState('');
    const [workname, setWorkname] = useState('');
    const [county, setCounty] = useState('');
    const [anomaly, setAnomaly] = useState('');

    const [user, setUser] = useState([]);


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

            fetchUser(workname);


            // } else {
            //     console.error('Error creating user or saving data:', result.error || resultToComp.error);
            //     // Handle error case, e.g., show a generic error message or notify the user
            // }
        } catch (err) {
            console.error('Error creating user or saving data:', err);
            // Handle error case, e.g., show a generic error message or notify the user
        }
    };


    const fetchUser = async (workname) => {
        try {
            // Simulate a delay using setTimeout
            setTimeout(async () => {
                const userData = await window.api.getUser(workname); // Fetch users data from main process
                console.log('User Data:', userData); // Log the users data
                console.log(userData.user);
                if (userData.user) {
                    // If userData.user is a valid user object
                    setUser([userData.user]); // Set the user state with an array containing the user object
                } else {
                    // If userData.user is null, undefined, or any other falsy value
                    setUser([]); // Set an empty array as the user state
                }
            }, 1000); // Delay for 1 second (1000 milliseconds)
        } catch (error) {
            console.error('Error fetching user data:', error);
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

            <div>
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Work Name</th>
                            <th>County</th>
                            <th>Anomaly</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user.length > 0 ? (
                            user.map((userData) => (
                                <tr key={userData.id}>
                                    <td>{userData.id}</td>
                                    <td>{userData.name}</td>
                                    <td>{userData.workname}</td>
                                    <td>{userData.county}</td>
                                    <td>{userData.anomaly}</td>
                                    <td>{userData.date}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No user data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>


        </div>
    );
}
export default Home;
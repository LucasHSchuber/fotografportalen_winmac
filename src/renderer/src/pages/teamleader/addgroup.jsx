// import React, { useEffect, useState } from "react";
// import { useNavigate } from 'react-router-dom';


// function Home() {
//     // Define states
//     const [Orgname, setOrgname] = useState('');
//     const [Amount, setAmount] = useState('');
//     const [Portrait, setPortrait] = useState(false); // Initialize as false since it's a boolean
//     const [Unit, setUnit] = useState(false); // Initialize as false since it's a boolean




//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         let user_id = localStorage.getItem("user_id");
//         console.log(user_id);
//         console.log('Submitting form:', Orgname, Amount, Portrait, Unit, user_id);
//         // const currentDate = new Date().toISOString(); // Get the current date in ISO format

//         try {

//             const result = await window.api.createGroup({ orgname: Orgname, amount: Amount, portrait: Portrait, unit: Unit, user_id });
//             console.log('Group created:', result);
//             // const resultToComp = await window.api.createUserToComp({ name, workname, county, anomaly, date: currentDate });
//             // if (result.success && resultToComp.success) {
//             console.log('Group created');
//             setOrgname('');
//             setAmount('');
//             setPortrait(false);
//             setUnit(false);

//             //set to localstorage
//             // localStorage.setItem('orgname', Orgname);
//             // localStorage.setItem('amount', Amount);
//             // localStorage.setItem('portrait', Portrait);
//             // localStorage.setItem('unit', Unit);


//             // } else {
//             //     console.error('Error creating user or saving data:', result.error || resultToComp.error);
//             //     // Handle error case, e.g., show a generic error message or notify the user
//             // }
//         } catch (err) {
//             console.error('Error creating user or saving data:', err);
//             // Handle error case, e.g., show a generic error message or notify the user
//         }
//     };


//     const openNewWindow = async () => {
//         try {
//             const result = await window.api.createNewWindow({});
//             console.log('New window created:', result);
//         } catch (error) {
//             console.error('Error opening new window:', error);
//         }
//     }
    


//     return (
//         <div className="home-wrapper">
//             <h1>Add group</h1>


//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <input placeholder='Orgname' type="text" value={Orgname} onChange={(e) => setOrgname(e.target.value)} />
//                 </div>
//                 <div className="mb-3">
//                     <input placeholder='Amount' type="text" value={Amount} onChange={(e) => setAmount(e.target.value)} />
//                 </div>
//                 <div>
//                     <label>
//                         <input className=" custom-checkbox mr-2" type="checkbox" checked={Portrait} onChange={(e) => setPortrait(e.target.checked)} />
//                         Portrait:
//                     </label>
//                 </div>
//                 <div className="mb-2">
//                     <label>
//                         <input className="custom-checkbox mr-2" type="checkbox" checked={Unit} onChange={(e) => setUnit(e.target.checked)} />
//                         Unit:
//                     </label>
//                 </div>
//                 <button className='button standard' type="submit">Add new group</button>
//             </form>

//             <div>
//                 <button onClick={openNewWindow}>New window</button>
//             </div>


//         </div>
//     );
// }
// export default Home;
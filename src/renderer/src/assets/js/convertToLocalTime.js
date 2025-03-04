    
    // Covert time to local time from UTC
    const convertToLocalTime = (utcTime) => { 
        const utcDate = new Date(utcTime + "Z"); 
        return utcDate.toLocaleString();
    } 

    export default convertToLocalTime;
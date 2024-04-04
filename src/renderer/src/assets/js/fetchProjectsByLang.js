// apiCalls.js

import axios from 'axios';



// Method to fetch projects by language from the API
const fetchProjectsByLang = async (lang) => {
  try {
    let response = await axios.get(`https://backend.expressbild.org/index.php/rest/teamleader/projects?lang=${lang}`);

    if (response && response.data) {
      console.log(`Fetched projects for language ${lang}:`, response.data);
      return response.data; // Return the fetched data
    } else {
      console.error('Empty response received');
      return null;
    }
  } catch (error) {
    handleAxiosError(error);
    return null;
  }
};


export default fetchProjectsByLang;

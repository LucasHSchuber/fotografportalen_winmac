
import axios from 'axios';



const fetchProjects = async () => {
  try {
    let response = await axios.get('https://backend.expressbild.org/index.php/rest/teamleader/projects');

    if (response && response.data) {
      console.log('Fetched projects:', response.data);
      return response.data; // Return the fetched data
    } else {
      console.error('Empty response received');
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        console.error('Network Error: Please check your internet connection');
      } else {
        console.error('Request failed with status code:', error.response.status);
      }
    } else {
      console.error('Error fetching projects:', error.message);
    }
    return null;
  }
};



export default fetchProjects;


import axios from 'axios';

const fetchNews = async () => {
    let token = localStorage.getItem("token");
    console.log(token);
  try {
    let response = await axios.get('https://backend.expressbild.org/index.php/rest/photographer_portal/News', {
        headers: {
            Authorization: `Token ${token}`
        }
    });

    if (response && response.data) {
      console.log('Fetched news:', response.data);
      return response.data; // Return the fetched data
    } else {
      console.error('Empty news-response received');
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
      console.error('Error fetching news:', error.message);
    }
    return null;
  }
};

export default fetchNews;

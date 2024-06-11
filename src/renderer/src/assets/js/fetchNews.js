
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
      console.log('Fetched news from endpoint:', response.data);

      // Add news to SQLite news table
      try {
        const news = response.data.result;
        console.log("news sending to sqlite:", news);
        const responseCreate_news = await window.api.create_news(news);
        if (responseCreate_news.success) {
          console.log("Successfully added news to news table");
        } else {
          console.log("Error adding news to news table");
        }
      } catch (error) {
        console.log("Error adding news to news table", error);
      }
      return response.data;
    } else {
      console.error('Empty news-response received');
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        console.error('Network Error: Please check your internet connection');
        return null;
      } else {
        console.error('Request failed with status code:', error.response.status);
      }
    } else {
      console.error('Error fetching news:', error.message);
    }
    throw error;
  }
};

export default fetchNews;

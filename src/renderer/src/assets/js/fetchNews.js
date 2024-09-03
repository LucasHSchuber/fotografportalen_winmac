
import axios from 'axios';

const fetchNews = async () => {
  let token = localStorage.getItem("token");
  let user_id = localStorage.getItem("user_id");
  // console.log("token", token);
  // console.log("user id", user_id);
  
  try {
    let response = await axios.get('https://backend.expressbild.org/index.php/rest/photographer_portal/News', {
      headers: {
        Authorization: `Token ${token}`
      }
    });

    if (response && response.data) {
      console.log('Fetched news from endpoint:', response.data);


      
      // try {
      //   const responseRead = await axios.get(
      //     `https://backend.expressbild.org/index.php/rest/photographer_portal/newsread/${user_id}`, {
      //       headers: {
      //         Authorization: `Token ${token}`,
      //       },
      //     },
      //   );
      //   console.log("responseRead:", responseRead);  
        
      // } catch (error) {
      //   console.log("Error fetching news read", error)
      // }


     
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

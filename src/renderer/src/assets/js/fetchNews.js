
import axios from 'axios';

const fetchNews = async () => {
  let token = localStorage.getItem("token");
  let _user_id = localStorage.getItem("user_id");
  let user_id = parseInt(_user_id);

  try {
    let response = await axios.get('https://backend.expressbild.org/index.php/rest/photographer_portal/News', {
      headers: {
        Authorization: `Token ${token}`
      }
    });

    if (response && response.data) {
      console.log('Fetched news from endpoint:', response.data);

      const news = response.data.result;

      // loop through news and check if news article is read by user or not
      news.forEach((newsItem) => {
        let isRead = false;
        newsItem.read_by.forEach((item) => {
          // console.log(item.id);
          if (item.id === user_id){
            // console.log("ok");
            isRead = true;
          } else {
            // console.log("no");
          }
        })
        newsItem.isRead = isRead;
      });
      console.log("new news aray - sending to backend", news);
      // Add news to SQLite news table
      try {
        const responseCreate_news = await window.api.create_news(news);
        if (responseCreate_news.success) {
          console.log("Successfully added news to news table");
        } else {
          console.log("Error adding news to news table");
        }
      } catch (error) {
        console.log("Error adding news to news table", error);
      }
      // console.log(response.data)
      // return response.data;
      return news;
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

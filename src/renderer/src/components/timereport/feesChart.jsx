import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";



const FeesChart = ({dataForFeesChart, userLang}) => {
  // define states
  const [tollsData, setTollsData] = useState(0);
  const [parkData, setParkData] = useState(0);
  const [otherFeesData, setOtherFeesData] = useState(0);
  const [currency, setCurrency] = useState("");


  // Set currency kr or euro based on userlang 
  useEffect(() => {
    if (userLang === "DK" || userLang === "SE" || userLang === "NO") {
      setCurrency("kr")
    } else {
      setCurrency("€")
    }
  }, [userLang]);  


  // Calculating the different expenses on mount to then place them in donut chart    
  useEffect(() => {
      let tolls = 0;
      let other_fees = 0;
      let park = 0;
      dataForFeesChart.forEach(element => {
          tolls = element.tolls + tolls;
          other_fees = element.other_fees + other_fees;
          park = element.park + park;
      });
      console.log('tolls', tolls);
      console.log('park', park);
      console.log('other_fees', other_fees);
      setTollsData(tolls);
      setParkData(park);
      setOtherFeesData(other_fees);
  }, [dataForFeesChart]);



   
  // Conditionally set the labels configuration
  const labelsConfig = tollsData + parkData + otherFeesData === 0 ? {
    show: true,
    total: {
      show: true,
      label: 'Total'
    }
  } : {
    show: false 
  };
  // Chart data
  const data = {
    series: [tollsData || 0, parkData || 0, otherFeesData || 0],
    options: {
      chart: {
        type: 'donut', 
        // height: 350,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '30%',
            labels: labelsConfig,
          }
        }
      },
      labels: ['Tolls', 'Parking', 'Other'],
      colors: ['#000000', '#630086', '#A74FFF'], 
      legend: {
        position: 'bottom'
      },
      tooltip: {
        y: {
          formatter: (val) => `${val} ${currency}` 
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          colors: ['#fff'],
        },
        formatter: (val, opts) => {
          const seriesIndex = opts.seriesIndex;
          const seriesData = [tollsData, parkData, otherFeesData]; 
          return `${seriesData[seriesIndex]} ${currency}`; 
        },
      },
    }
  };

  return (
    <div>
      <h6 style={{ textAlign: "center", fontWeight: "700", fontSize: "0.9em" }}>Expenses</h6>
      <Chart options={data.options} series={data.series} type="donut" height={200} />
    </div>
  );
};

export default FeesChart;

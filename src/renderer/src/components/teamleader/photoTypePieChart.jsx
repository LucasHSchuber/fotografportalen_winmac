import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const photoTypePieChart = ({ data }) => {
    //define states
    const [projectCountByType, setProjectCountByType] = useState({});
   
    const getPieData = () => {
            //filter out duplicate project_id
            const uniqueProjectsArray = [ ...new Map(data.map(item => [item.project_id, item])).values() ]
            console.log('uniqueProjectsArray', uniqueProjectsArray);
            //change typ "sport_portrait to "sport""
            const modifiedData = uniqueProjectsArray.map(item =>
                item.type === "sport_portrait" ? {...item, type: "sport" } : item
            );
            console.log('modifiedData', modifiedData);
            //count amount of sport and school jobs
            const projectType = modifiedData.reduce((acc, project) => {
                acc[project.type] = (acc[project.type] || 0) + 1;
                return acc;
            }, {});
            console.log('projectType', projectType);
            setProjectCountByType(projectType);
    }
    useEffect(() => {
        getPieData();
    }, [data]);

    
    const chartOptions = {
        chart: {
        type: "donut", 
        },
        labels: Object.keys(projectCountByType),
        title: {
        // text: "Number of Jobs by Type",
        align: "center" , 
        style: {
            fontSize: '12px', 
            fontWeight: "800",
            textDecoration: 'underline'
          },
        },
        legend: {
        position: "bottom" ,
        },
        plotOptions: {
            pie: {
              donut: {
                size: '10%' 
              },
            },
        },
        colors: ['#1df854', '#76ccff'],
        dataLabels: {
            style: {
              fontSize: '10px',
              fontWeight: "100"
            },
        },
    };

    const chartSeries = Object.values(projectCountByType) ; 

    return (
        <div>
            <Chart options={chartOptions} series={chartSeries} type="donut" width="160" />
        </div>
    );
};

export default photoTypePieChart;

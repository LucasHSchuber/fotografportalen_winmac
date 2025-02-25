import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const ProjectsHeatmap = ({ data }) => {
    const [heatmapData, setHeatmapData] = useState([]);
    const [years, setYears] = useState([]);  
    console.log('data', data);

    useEffect(() => {
        // Filter out duplicate project_id
        const uniqueProjectsArray = [...new Map(data.map(item => [item.project_id, item])).values()];
        console.log('uniqueProjectsArray', uniqueProjectsArray);

        // Group data by year and month and count the number of projects
        const projectsByMonth = uniqueProjectsArray.reduce((acc, project) => {
            const year = new Date(project.sent_date).getFullYear(); 
            const month = new Date(project.sent_date).getMonth(); 
            const key = `${year}-${month}`;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        // Get unique years from the projectsByMonth keys
        const yearsList = [...new Set(Object.keys(projectsByMonth).map(key => key.split("-")[0]))];
        setYears(yearsList);

        const months = Array.from({ length: 12 }, (_, i) => i); 
        const matrix = yearsList.map(year => months.map(month => projectsByMonth[`${year}-${month}`] || 0));

        setHeatmapData(matrix);  
    }, [data]);

    const chartOptions = {
        chart: {
            type: "heatmap",
            toolbar: {
                show: false,
            },
        },
        xaxis: {
            type: "category",
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            labels: {
                style: {
                    fontSize: '9px', 
                },
            },
        },
        yaxis: {
            categories: years,
            labels: {
                style: {
                    fontSize: '9px', 
                },
            },
        },
        // color: ['#76ccff'],
        plotOptions: {
            heatmap: {
                colorScale: {
                    ranges: [
                        { from: 1, to: 3, color: "#3d9eff", name: "1-3 Project" }, // Light Blue
                        { from: 4, to: 7, color: "#0076ec", name: "4-7 Projects" }, // Medium Blue
                        { from: 8, to: 11, color: "#003f7f", name: "8-11 Projects" }, // Darker Blue
                        { from: 12, to: 100, color: "#002246", name: "12+ Projects" }, // Dark Blue
                    ],
                },
            },
        },
    };

    const chartSeries = heatmapData.map((data, index) => ({
        name: years[index],
        data,
    }));

    return (
        <div>
            <Chart options={chartOptions} series={chartSeries} type="heatmap" width="300" height="110" />
        </div>
    );
};

export default ProjectsHeatmap;

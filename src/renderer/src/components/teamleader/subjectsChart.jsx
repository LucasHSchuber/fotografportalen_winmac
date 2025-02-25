import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const SubjectsChart = ({ data, prevProjectsLength }) => {
    console.log('data', data);
    const [chartData, setChartData] = useState({ categories: [], series: [], projectNames: [] });
    const [userInputChartOne, setUserInputChartOne] = useState(prevProjectsLength);

    useEffect(() => {
        setUserInputChartOne(prevProjectsLength);
    }, [prevProjectsLength]);

    useEffect(() => {
        const getLastTenProjectsData = () => {
            const uniqueProjectIds = data && [...new Set(data.map(item => item.project_id))].slice(-userInputChartOne);
            const projectData = uniqueProjectIds.map(projectId => {
                const projectItems = data.filter(item => item.project_id === projectId);
                const sumAmount = projectItems.reduce((total, item) => total + item.teams.amount, 0);
                const sentDate = projectItems[0].sent_date.substring(5, 10);
                const projectName = projectItems[0].projectname;
                return { sentDate, sumAmount, projectName };
            });
            projectData.sort((a, b) => new Date(a.sentDate) - new Date(b.sentDate));
            
            setChartData({
                categories: projectData.map(item => item.sentDate),
                series: [{ name: "Amount", data: projectData.map(item => item.sumAmount) }],
                projectNames: projectData.map(item => item.projectName)
            });
        };
        getLastTenProjectsData();
    }, [data, userInputChartOne]);


    const chartOptions = {
        chart: { type: "bar", 
            height: 240, 
            toolbar: {
            show: false,
        }, },
        xaxis: { categories: chartData.categories, title: { text: "Sent Date" } },
        yaxis: { title: { text: "Amount" } },
        tooltip: { 
            y: { 
                formatter: (val, { dataPointIndex }) => {
                    return `Amount: ${val}<br/>Project name: ${chartData.projectNames[dataPointIndex]}`;
                },
                title: {
                    formatter: () => ""
                }
            }
        }, 
        colors: ["#76ccff"] // the bar color
    };

    return (
        <div className="chart-teamleader-wrapper my-3">
            <div className="chart-container">
                <h6 className="my-3"><b>Amount of photographed subjects - last {userInputChartOne} jobs</b></h6>
                <div className="d-flex">
                    <h6 style={{ margin: "0 0.5em 0 0", textDecoration: "none", fontSize: "0.75em" }}>Change scope:</h6>
                    <select value={userInputChartOne} onChange={(e) => setUserInputChartOne(e.target.value)}>
                        {prevProjectsLength && [...Array(prevProjectsLength).keys()].map((num) => (
                            <option key={num + 1} value={num + 1}>{num + 1}</option>
                        ))}
                    </select>
                </div>
                {data.length > 0 ? (
                    <Chart options={chartOptions} series={chartData.series} type="bar" height={240} />
                ) : (
                    <div className="chart-container" style={{ width: "500px" }}>
                        <p style={{ fontSize: "0.85em", fontWeight: "300" }}>Could not load any subject data</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubjectsChart;


// import React, { useState, useEffect, useRef } from "react";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


// const SubjectsChart = ({ data, prevProjectsLength }) => {
//     // define states
//     const [chartData, setChartData] = useState([]);
//     const [userInputChartOne, setUserInputChartOne] = useState(prevProjectsLength);


    
//     useEffect(() => {
//         setUserInputChartOne(prevProjectsLength);
//     }, [prevProjectsLength]);


//     useEffect(() => {
//         const getLastTenProjectsData = () => {
//             // Extract unique project_ids
//             const uniqueProjectIds = data && [...new Set(data.map(item => item.project_id))].slice(-userInputChartOne);
//             // Sum up the amount for each project_id
//             const projectData = uniqueProjectIds.map(projectId => {
//                 const projectItems = data.filter(item => item.project_id === projectId);
//                 const sumAmount = projectItems.reduce((total, item) => total + item.teams.amount, 0);
//                 const sentDate = projectItems[0].sent_date;
//                 const projectName = projectItems[0].projectname;
//                 return { sentDate, sumAmount, projectName };
//             });

//             // Sort projectData array based on sentDate
//             projectData.sort((a, b) => new Date(a.sentDate) - new Date(b.sentDate));
//             setChartData(projectData);
//         };


//         getLastTenProjectsData();
//     }, [data, userInputChartOne])

//     console.log(data);


//     //custom tooltip
//     const CustomTooltip = ({ active, payload, label }) => {
//         if (active && payload && payload.length) {
//             const data = payload[0].payload;
//             return (
//                 <div className="custom-tooltip">
//                     <p>{`Project name: ${data.projectName}`}</p>
//                     {/* <p>{`Sent date: ${data.sentDate.substring(0, 10)}`}</p> */}
//                     <p>{`Amount: ${data.sumAmount}`}</p>
//                 </div>
//             );
//         }
//         return null;
//     };


//     return (
//         <div className="chart-teamleader-wrapper my-3">
//                 <div className="chart-container">
//                     <div className="d-flex">
//                         <h6 style={{ textDecoration: "none", margin: "0.3em 0.5em 0 0", fontSize: "0.85em" }}>Change scope: </h6>
//                         <select value={userInputChartOne} onChange={(e) => setUserInputChartOne(e.target.value)}>
//                             {prevProjectsLength && [...Array(prevProjectsLength).keys()].map((num) => (
//                                 <option key={num + 1} value={num + 1} >
//                                     {num + 1}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                     <h6 className="my-3"><b>Amount of photographed subjects - last {userInputChartOne} jobs</b></h6>
//                     {data.length > 0 ? (
//                         <BarChart width={500} height={240} data={chartData}>
//                             <CartesianGrid strokeDasharray="0 0" />
//                             <XAxis dataKey="sentDate" tickFormatter={(tick) => tick.substring(5, 10)} label={{ value: 'Sent date', position: 'insideBottom', dy: 10, fontSize: '0.8em' }} tick={{ fontSize: '0.8em' }} />
//                             <YAxis label={{ value: 'Amount', angle: -90, position: 'insideLeft', fontSize: '0.8em' }} tick={{ fontSize: '0.8em' }} />
//                             <Tooltip content={<CustomTooltip />} />
//                             <Legend payload={[{ value: '', type: 'line', id: 'ID01' }]} />
//                             <Bar dataKey="sumAmount" fill="#5B5B5B" name="Amount" />
//                         </BarChart>
//                      ) : (
//                         <div className="chart-container" style={{ width: "500px" }}>
//                             <p style={{ fontSize: "0.85em", fontWeight: "300" }}>Could not load any subject data</p>
//                         </div>
//                     )}
//                 </div>
//         </div>
//     );
// };

// export default SubjectsChart;
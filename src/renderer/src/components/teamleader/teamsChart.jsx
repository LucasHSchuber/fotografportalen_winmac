import React, { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';



const TeamsChart = ({ data, prevProjectsLength }) => {

    //define states
    const [chartData, setChartData] = useState([]);
    const [userInputChartOne, setUserInputChartOne] = useState(10);


    useEffect(() => {
        const getLastTenProjectsData = () => {
            // Step 1: Extract the last 10 unique project_ids
            const uniqueProjectIds = [...new Set(data.map(item => item.project_id))].slice(-userInputChartOne);
            // Step 2 and 3: Sum up the amount for each project_id
            const projectData = uniqueProjectIds.map(projectId => {
                const projectItems = data.filter(item => item.project_id === projectId);
                const sumAmount = projectItems.length;
                const sentDate = projectItems[0].sent_date;
                const projectName = projectItems[0].projectname;
                return { sentDate, sumAmount, projectName };
            });

            // Sort projectData array based on sentDate
            projectData.sort((a, b) => new Date(a.sentDate) - new Date(b.sentDate));
            setChartData(projectData);
        };
        getLastTenProjectsData();
    }, [data, userInputChartOne])



    //custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="custom-tooltip">
                    <p>{`Project name: ${data.projectName}`}</p>
                    {/* <p>{`Sent date: ${data.sentDate.substring(0, 10)}`}</p> */}
                    <p>{`Amount: ${data.sumAmount}`}</p>
                </div>
            );
        }

        return null;
    };


    return (
        <div className="chart-teamleader-wrapper my-3">
            <div className="chart-container">
                <div className="d-flex">
                    <h6 style={{ textDecoration: "none", margin: "0.3em 0.5em 0 0" }}>Change scope: </h6>
                    <select value={userInputChartOne} onChange={(e) => setUserInputChartOne(e.target.value)}>
                        {[...Array(prevProjectsLength).keys()].map((num) => (
                            <option key={num + 1} value={num + 1} >
                                {num + 1}
                            </option>
                        ))}
                    </select>
                </div>
                <h6 className="my-3"><b>Amount of photographed teams or classes - last {userInputChartOne} jobs</b></h6>
                <BarChart width={560} height={240} data={chartData}>
                    <CartesianGrid strokeDasharray="0 0" />
                    <XAxis dataKey="sentDate" tickFormatter={(tick) => tick.substring(5, 10)} label={{ value: 'Sent date', position: 'insideBottom', dy: 10, fontSize: '0.8em' }} tick={{ fontSize: '0.8em' }} />
                    <YAxis label={{ value: 'Amount', angle: -90, position: 'insideLeft', fontSize: '0.8em' }} tick={{ fontSize: '0.8em' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend payload={[{ value: '', type: 'line', id: 'ID01' }]} />
                    <Bar dataKey="sumAmount" fill="#1d1d1d" name="Amount" />
                </BarChart>
            </div>
        </div>
    );
};

export default TeamsChart;

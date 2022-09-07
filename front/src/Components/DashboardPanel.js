import React, { useState } from 'react';
import "./CSS/DashboardPanel.css"
import Paper from '@mui/material/Paper';
import { AreaChart, LineChart, Line, Legend, Cell, PieChart, Pie, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PaperItem from './PaperItem';
import Button from '@mui/material/Button';
import moment from 'moment';

const ranges = ["3M", "6M", "1Y", "2Y", "3Y", "6Y", "All"];

function calculateRange(data, range) {
    let start = moment();
    switch (range) {
        case "3M":
            start = start.subtract(3, "months");
            break;
        case "6M":
            start = start.subtract(6, "months");
            break;
        case "1Y":
            start = start.subtract(1, "year");
            break;
        case "2Y":
            start = start.subtract(2, "year");
            break;
        case "3Y":
            start = start.subtract(3, "year");
            break;
        case "6Y":
            start = start.subtract(6, "year");
            break;
        default:
            return data;
    }
    return data.filter(item => moment(item.date).isAfter(start));
}

export default function DashboardPanel({ author, publications }) {
    const formatXAxis = (tickItem) => {
        return moment(tickItem).format('MMM YY')
    }

    const formatTimeDetailed = (tickItem) => {
        return moment(tickItem).format('MM/DD/YY')
    }

    const [range, setRange] = useState("All");

    const theme = useTheme();
    const secondaryTextStyle = {
        color: theme.palette.secondary.main,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };
    let most_cited;
    if (publications.length > 0) {
        most_cited = publications[0];
        for (let i = 0; i < publications.length; i++) {
            if (publications[i].cited_by.value > most_cited.cited_by.value) {
                most_cited = publications[i];
            }
        }
    }

    return (
        <div id="dashboard">
            <h1 className="dashboard_header" style={{ color: theme.palette.primary.text }}>
                {author.name}
            </h1>
            <div id='dashboard-charts'>
                <Paper className='big-tile tile' elevation={1}>
                    <h2 style={{ textAlign: "left", marginLeft: "1vw", marginBottom: "4px" }}> Cites and Papers </h2>
                    <div className='chart-range-selector' style={{ backgroundColor: theme.palette.background.paper }}>
                        {ranges.map((item, index) =>
                            <Button size="small"
                                key={index}
                                style={{ color: item == range ? theme.palette.primary.contrastText : theme.palette.text.gray }}
                                variant="text" className='range-item'
                                onClick={() => setRange(item)}
                            >
                                {item}</Button>
                        )}
                    </div>
                    <ResponsiveContainer width="100%" height="70%">
                        <AreaChart data={calculateRange(author.detailed, range)}>
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Legend verticalAlign="bottom" height={1} />
                            <XAxis
                                // type='number'
                                // domain={[dataMin => (new Date(2018, 1, 31)).getTime(), 'dataMax']}
                                scale="time" allowDuplicatedCategory={false} tick={{ fill: theme.palette.text.gray }}
                                axisLine={false} tickLine={false} dataKey={'date'} tickFormatter={formatXAxis} />
                            <YAxis yAxisId="left" tick={{ fill: theme.palette.text.gray }} axisLine={false} tickLine={false} />
                            <YAxis yAxisId="right" orientation="right" tick={{ fill: theme.palette.text.gray }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: theme.palette.background.default + "aa", borderRadius: "5px", borderColor: theme.palette.background.default }} offset={20} labelFormatter={formatTimeDetailed} />
                            <Area type="monotone" yAxisId="left" dataKey="cites" stroke={theme.palette.primary.main} fillOpacity={1} fill="url(#colorUv)" />
                            <Area type="monotone" yAxisId="right" dataKey="total_papers" stroke={theme.palette.secondary.main} fillOpacity={1} fill="url(#colorPv)" />
                        </AreaChart>
                    </ResponsiveContainer>

                </Paper>

                {/* <div className='vertical-container '> */}
                <Paper elevation={1} className='normal-tile tile accent-tile' style={{ backgroundColor: theme.palette.primary.main }}>
                    <h2 style={{ textAlign: "left", marginLeft: "1vw", color: theme.palette.primary.contrastText }}> Contribution </h2>
                    <ResponsiveContainer width="100%" height="80%">
                        <PieChart >
                            <text
                                x="51%"
                                y="53%"
                                textAnchor="middle"
                                dominantBaseline="middle"

                                style={{ textAnchor: 'middle', fontSize: '100%', fill: theme.palette.primary.contrastText }}
                            >
                                {Math.floor(author.detailed[author.detailed.length - 1].contributions * 100) / 100}
                            </text>
                            <Pie
                                data={[
                                    { id: "1", name: "L1", value: author.detailed[author.detailed.length - 1].contributions },
                                    { id: "2", name: "L2", value: (author.detailed[author.detailed.length - 1].total_papers - author.detailed[author.detailed.length - 1].contributions) }
                                ]}
                                dataKey="value"
                                innerRadius="94%"
                                outerRadius="100%"
                                fill={theme.palette.primary.main}
                                startAngle={90}
                                endAngle={-270}
                                paddingAngle={0}
                                blendStroke
                            >
                                <Cell
                                    key="l1"
                                    fill={theme.palette.primary.contrastText}
                                />
                                <Cell
                                    key="l2"
                                    fill={theme.palette.primary.light}
                                />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </Paper>
                <Paper elevation={1} className='small-tile tile' >
                    <div className='h-index-box'>
                        <div className='h_index_box_text'>
                            <h3>H-index</h3>
                            <h2>{author.detailed[author.detailed.length - 1].h_index}</h2>
                        </div>
                        <ResponsiveContainer width="50%">
                            <LineChart width="100%" data={author.detailed.slice(-5)} >
                                <YAxis type="number" domain={['dataMin', 'dataMax']} hide={true} />
                                <XAxis dataKey="date" hide={true} />
                                <Tooltip labelFormatter={formatTimeDetailed} cursor={false} wrapperStyle={{ zIndex: 1000 }}
                                    contentStyle={{ backgroundColor: theme.palette.background.default + "aa", borderRadius: "5px", borderColor: theme.palette.background.default }} position={{ y: -55 }} />
                                <Line width="100%" dot={false} type="monotone" dataKey="h_index" stroke={theme.palette.secondary.main} strokeWidth={4} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Paper>
                {/* </div> */}
                <Paper className='normal-tile tile'>
                    <h4> Papers </h4>
                    <h2> {author.detailed[author.detailed.length - 1].total_papers} </h2>
                    <p style={secondaryTextStyle}> <ArrowDropUpIcon fontSize="small" /> {author.detailed[author.detailed.length - 1].total_papers - author.detailed[author.detailed.length - 2].total_papers} </p>
                </Paper>
                <Paper className='normal-tile tile'>
                    <h4> Cites </h4>
                    <h2> {author.detailed[author.detailed.length - 1].cites} </h2>
                    <p style={secondaryTextStyle}> <ArrowDropUpIcon fontSize="small" /> {author.detailed[author.detailed.length - 1].cites - author.detailed[author.detailed.length - 2].cites} </p>
                </Paper>
                <Paper className='normal-tile tile'>
                    <h4> Most cited </h4>
                    <h2> {publications.length > 0 ? <a href={most_cited.link}>{most_cited.cited_by.value}</a> : 0} </h2>
                    <p style={secondaryTextStyle}> <CalendarMonthIcon fontSize="small" /> {publications.length > 0 ? most_cited.year : 0} </p>
                </Paper>
            </div >
            <h1 className="dashboard_header">
                {publications.length > 1 ? "Papers" : "Paper"}
            </h1>

            <PaperItem paper={{ title: "TITLE", authors: " ", link: "", year: 'YEAR', cited_by: { value: "CITES" } }} main_author={'a b'} index={'#'} />
            <Paper className='publication'>{
                publications.map((publication, index) => <PaperItem paper={publication} key={index} main_author={author.name} index={index + 1} />)
            }</Paper>
        </div >
    )
}
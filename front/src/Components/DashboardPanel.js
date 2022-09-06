import React from 'react';
import "./CSS/DashboardPanel.css"
import Paper from '@mui/material/Paper';
import { AreaChart, LineChart, Line, Legend, Cell, PieChart, Pie, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PaperItem from './PaperItem';
import moment from 'moment';


export default function DashboardPanel({ author, publications }) {
    const formatXAxis = (tickItem) => {
        return moment(tickItem).format('M/DD/YY')
    }

    const formatTimeDetailed = (tickItem) => {
        return moment(tickItem).format('MM/DD/YY')
    }

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
                    <h2 style={{ textAlign: "left", marginLeft: "1vw" }}> Cites and Papers </h2>
                    <ResponsiveContainer width="99%" height="70%">
                        <AreaChart width="100%" data={author.detailed}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={1} />
                                    <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={1} />
                                </linearGradient>
                                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.9} />
                                    <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={1} />
                                </linearGradient>
                            </defs>
                            <Legend verticalAlign="bottom" height={1} />
                            <XAxis tick={{ fill: theme.palette.text.gray }} axisLine={false} tickLine={false} dataKey={'date'} tickFormatter={formatXAxis} />
                            <YAxis yAxisId="left" tick={{ fill: theme.palette.text.gray }} axisLine={false} tickLine={false} />
                            <YAxis yAxisId="right" orientation="right" tick={{ fill: theme.palette.text.gray }} axisLine={false} tickLine={false} />
                            <Tooltip labelFormatter={formatTimeDetailed} />
                            <Area type="monotone" yAxisId="left" dataKey="cites" stroke={theme.palette.primary.main} fillOpacity={1} fill="url(#colorUv)" />
                            <Area type="monotone" yAxisId="right" dataKey="total_papers" stroke={theme.palette.secondary.main} fillOpacity={1} fill="url(#colorPv)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Paper>

                {/* <div className='vertical-container '> */}
                <Paper elevation={1} className='normal-tile tile accent-tile' style={{ backgroundColor: theme.palette.primary.main }}>
                    <h2 style={{ textAlign: "left", marginLeft: "1vw", color: theme.palette.primary.contrastText }}> Contribution </h2>
                    <ResponsiveContainer width="100%" height="60%">
                        <PieChart >
                            <text
                                x="51%"
                                y="53%"
                                textAnchor="middle"
                                dominantBaseline="middle"

                                style={{ textAnchor: 'middle', fontSize: '120%', fill: theme.palette.primary.contrastText }}
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
                        <ResponsiveContainer width="40%" height={70}>
                            <LineChart margin={{ top: 0, left: 0, right: 0, bottom: 0 }} width="100%" data={author.detailed.slice(-5)} tick={false} axisLine={false} tickLine={false}>
                                <YAxis type="number" domain={['dataMin', 'dataMax']} tick={false} axisLine={false} tickLine={false} />
                                <XAxis dataKey="date" tick={false} axisLine={false} tickLine={false} />
                                <Line width="100%" dot={false} type="monotone" dataKey="h_index" stroke={theme.palette.secondary.main} strokeWidth={4} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Paper>
                {/* </div> */}
                <Paper className='normal-tile tile'>
                    <h3> Papers </h3>
                    <h2> {author.detailed[author.detailed.length - 1].total_papers} </h2>
                    <p style={secondaryTextStyle}> <ArrowDropUpIcon /> {author.detailed[author.detailed.length - 1].total_papers - author.detailed[author.detailed.length - 2].total_papers} </p>
                </Paper>
                <Paper className='normal-tile tile'>
                    <h3> Cites </h3>
                    <h2> {author.detailed[author.detailed.length - 1].cites} </h2>
                    <p style={secondaryTextStyle}> <ArrowDropUpIcon /> {author.detailed[author.detailed.length - 1].cites - author.detailed[author.detailed.length - 2].cites} </p>
                </Paper>
                <Paper className='normal-tile tile'>
                    <h3> Most cited </h3>
                    <h2> {publications.length > 0 ? <a href={most_cited.link}>{most_cited.cited_by.value}</a> : 0} </h2>
                    <p style={secondaryTextStyle}> <CalendarMonthIcon /> {publications.length > 0 ? most_cited.year : 0} </p>
                </Paper>
            </div>
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
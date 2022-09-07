import React from 'react';
import './CSS/ListItem.css'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';


export default function ListItem({ snapshot, provided, author, isSelected, onAuthorclick }) {
    // Declare a new state variable, which we'll call "count"

    const theme = useTheme();
    const selected = isSelected ? "selected" : "";
    const selectedStyle = isSelected ? { backgroundColor: theme.palette.background.default } : {};
    let paperProg = (author.detailed[author.detailed.length - 1].total_papers - author.detailed[author.detailed.length - 2].total_papers);
    let citeProg = (author.detailed[author.detailed.length - 1].cites - author.detailed[author.detailed.length - 2].cites);
    const hasProg = (citeProg > 0 ? "prog" : "#noprog")
    const citeColor = (citeProg > 0 ? theme.palette.primary.main : theme.palette.secondary.main)

    return (
        <div ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}>
            <div
                className={'listitem ' + selected} style={selectedStyle} onClick={onAuthorclick}>

                <img className="listitem_image" src={author.picture} alt="profile photo" />
                <p className="left-panel-author">{author.name.split(" ")[0]}</p>

                <ResponsiveContainer width="20%" height={40} className="panel-chart">
                    <AreaChart width="100%" data={author.detailed.slice(-12)} >
                        <defs>
                            <linearGradient id={hasProg} x1="0" y1="0" x2="0.3" y2="1">
                                <stop offset="5%" stopColor={citeColor} stopOpacity={0.6} />
                                <stop offset="95%" stopColor={citeColor} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <YAxis type="number" hide={true} domain={['dataMin - 1', 'dataMax + 1']} />
                        <XAxis dataKey="date" scale="time" hide={true} />
                        <Area width="100%" dot={false} type="monotone" dataKey="cites" stroke={citeColor} strokeWidth={1} animationDuration={500} fill={("url(#" + hasProg + ")")} />
                    </AreaChart>
                </ResponsiveContainer>

                <div className="summary_item">
                    <p>{author.detailed[author.detailed.length - 1].cites} </p>
                    <p style={{
                        backgroundColor: (citeProg > 0 ? theme.palette.primary.main : theme.palette.secondary.main),

                    }}>  {citeProg === 0 ? 0 : '+' + citeProg}</p>
                </div>

                <div className="summary_item">
                    <p> {author.detailed[author.detailed.length - 1].total_papers} </p>
                    <p style={{
                        color: (!(isNaN(paperProg) || paperProg === 0) ? theme.palette.primary.main : theme.palette.secondary.main),

                    }}>
                        +{isNaN(paperProg) ? 0 : paperProg} </p>

                </div>
            </div >
            <Divider variant="middle" />
        </div>
    )
}

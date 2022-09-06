import React from 'react';
import './CSS/ListItem.css'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ArticleIcon from '@mui/icons-material/Article';
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';


export default function ListItem({ snapshot, provided, author, isSelected, onAuthorclick }) {
    // Declare a new state variable, which we'll call "count"

    const theme = useTheme();
    const selected = isSelected ? "selected" : "";
    const selectedStyle = isSelected ? { backgroundColor: theme.palette.background.default } : {};
    let paperProg = (author.detailed[author.detailed.length - 1].publications - author.detailed[author.detailed.length - 2].publications);
    return (
        <div ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}>
            <div
                className={'listitem ' + selected} style={selectedStyle} onClick={onAuthorclick}>

                <img className="listitem_image" src={author.picture} />
                <h3 style={{ flex: 1, textAlign: "left" }}>{author.name.split(" ")[0]}</h3>

                <ResponsiveContainer width="28%" height={70} className="panel-chart">
                    <LineChart margin={{ top: 0, left: 0, right: 0, bottom: 0 }} width="100%" data={author.detailed.slice(-5)} tick={false} axisLine={false} tickLine={false}>
                        {/* <YAxis type="number" domain={['dataMin', 'dataMax']} tick={false} axisLine={false} tickLine={false} /> */}
                        <XAxis dataKey="date" tick={false} axisLine={false} tickLine={false} />
                        <Line width="100%" dot={false} type="monotone" dataKey="cites" stroke={theme.palette.primary.main} strokeWidth={4} animationDuration={500} />
                    </LineChart>
                </ResponsiveContainer>

                <div style={{ width: "24%" }}>
                    <div className='summary_item'>
                        <div>
                            {/* <FormatQuoteIcon /> */}
                            <p>{author.detailed[author.detailed.length - 1].cites} </p>
                            <p> /{author.detailed[author.detailed.length - 1].total_papers} </p>
                        </div>
                        {/* <ArrowDropUpIcon style={{ marginLeft: "2px", fontSize: "1.2em", color: theme.palette.secondary.main }} /> */}
                        <p style={{
                            backgroundColor: theme.palette.secondary.main,
                            color: theme.palette.secondary.contrastText,
                            fontSize: "0.9em",
                            // width: "70%",
                            padding: "2px 5px",
                            borderRadius: "3px",
                        }}>  +{author.detailed[author.detailed.length - 1].cites - author.detailed[author.detailed.length - 2].cites}
                            /+
                            {isNaN(paperProg) ? 0 : paperProg} </p>
                    </div>

                </div>
            </div >
            <Divider variant="middle" />
        </div>
    )
}

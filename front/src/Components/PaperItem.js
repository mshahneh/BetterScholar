import React from 'react';
import './CSS/PaperItem.css'
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import { height, palette } from '@mui/system';
import LaunchIcon from '@mui/icons-material/Launch';
import LinkIcon from '@mui/icons-material/Link';

function createMarkup(text) {
    return { __html: text };
}

export default function PaperItem({ paper, main_author, index }) {
    const theme = useTheme();
    main_author = main_author.split(" ");
    main_author = main_author[main_author.length - 1];

    let authors = "";
    let authorsText = JSON.stringify(paper.authors).slice(1, -1);
    authorsText.split(', ').forEach((author, I) => {
        if (author.includes(main_author)) {
            authors += "<span class='main_author'>" + author + "</span>, "
        }
        else
            authors += author + ", ";
    })
    authors = authors.slice(0, -2);


    return (
        <div className='paper_container'>
            <div className='paper_item'>
                <h3 style={{ width: "10 %", color: theme.palette.primary.dark }}>{index}.</h3>
                <div className='paper_details'>
                    <h3 className='paper_title' >
                        <a {...(!paper.link ? {} : { href: paper.link })} target="_blank"  >
                            {paper.title}
                            {!paper.link ? null : <LaunchIcon style={{ fontSize: "0.7em", marginTop: "-5px", color: theme.palette.secondary.main }} />}
                        </a>
                    </h3>
                    <div className='paper_subdetails'>
                        <p dangerouslySetInnerHTML={createMarkup(authors)} />
                        <div className='detail_divider' style={{
                            borderLeftColor: theme.palette.primary.main, boxSizing: "border-box",
                            borderLeftWidth: "1px", borderLeftStyle: "dotted", margin: "5px 10px"
                        }} />
                        <p> {paper.publication}</p>
                    </div>
                </div>
                <a {...(!paper.link ? {} : { href: paper.cited_by.link })} target="_blank" style={{ color: theme.palette.secondary.main }}> {paper.cited_by.value} </a>
                <p className='paper_year'>{paper.year}</p>
            </div>
            <Divider variant="middle" sx={{ margin: "auto", width: "100%", background: theme.palette.primary.main, opacity: "0.3" }} />
        </div>
    )
}
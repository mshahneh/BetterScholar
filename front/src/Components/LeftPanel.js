import React from 'react';
import ListItem from './ListItem';
import SearchPanel from "./SearchPanel";
import { useTheme } from '@mui/material/styles';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import PulseLoader from "react-spinners/PulseLoader";
import "./CSS/LeftPanel.css"
import Box from '@mui/material/Box';


let sortingBasedOnOther = (list1, orderList) => {
    if (Object.keys(list1).length === 0) {

        return {};
    }
    list1 = list1.sort((a, b) => {
        let item1 = orderList.indexOf(a.id);
        item1 = item1 === -1 ? list1.length : item1;
        let item2 = orderList.indexOf(b.id);
        item2 = item2 === -1 ? list1.length : item2;
        return item1 - item2
    })
    return list1;
}

export default function LeftPanel({ loadingAuthor, onDragEnd, items, selected, onAuthorSubmit, onAuthorclick }) {
    // a little function to help us with reordering the result

    const theme = useTheme();
    items = sortingBasedOnOther(items, JSON.parse(localStorage.getItem('authorsOrder')));
    // console.log(JSON.stringify(items))

    return (<Box id="left_panel" sx={{ boxShadow: 2, bgcolor: theme.palette.background.panel, overflowY: 'auto', overflowX: 'visible', direction: 'rtl' }}>
        {/* <Paper elevation={1} className="left-panel-top">
            

        </Paper> */}
        <SearchPanel onSubmit={onAuthorSubmit} />
        <div className='listitem' style={{ backgroundColor: theme.palette.background.darkdefault }}>
            <img className='listitem_image' style={{ height: 0, opacity: 0 }} alt="image placeholder" />
            <h4 className="left-panel-author" style={{ textAlign: "left" }}>Author</h4>
            <h4 className='panel-chart' style={{ width: "20%" }}>Growth</h4>
            <h4 className='summary_item'>Cite(s)</h4>
            <h4 className='summary_item'>Paper(s)</h4>
        </div>
        {loadingAuthor ?
            <PulseLoader color={theme.palette.secondary.main} cssOverride={{
                margin: '20px auto'
            }} />
            :
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => {
                        return (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            // style={{ marginTop: "100px" }}
                            >

                                {items.map((author, index) =>
                                    <Draggable key={author.id} draggableId={author.id} index={index}>
                                        {(provided, snapshot) =>
                                            <ListItem key={author.id}
                                                provided={provided} snapshot={snapshot}
                                                author={author}
                                                onAuthorclick={() => onAuthorclick(index)}
                                                isSelected={author.id === selected ? true : false} />
                                        }
                                    </Draggable>)}
                                {provided.placeholder}
                            </div>
                        )
                    }
                    }
                </Droppable>
            </DragDropContext>
        }
    </Box>)
}

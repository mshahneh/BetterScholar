// import logo from './logo.svg';
import React, { useState } from 'react';
import '../App.css';
import LeftPanel from "../Components/LeftPanel";
import DashboardPanel from '../Components/DashboardPanel';
import { useTheme } from '@mui/material/styles';
import Box from "@mui/material/Box";
import ScaleLoader from "react-spinners/ScaleLoader";
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';

const address = "http://localhost:3006";

export default function MainPage({ authors, loadingAuthors, onAuthorSubmit }) {
  const theme = useTheme();
  const [items, setItems] = useState(authors);
  const [author, setAuthor] = useState(authors[0]);
  const [publications, setpublications] = React.useState({ articles: [] });
  const [loadingpublications, setLoadingpublications] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(true);
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 768px)").matches
  )

  React.useEffect(() => {
    window
      .matchMedia("(min-width: 768px)")
      .addEventListener('change', e => setMatches(e.matches));
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  React.useEffect(() => {
    setTimeout(() => {
      setLoadingpublications(true);
      fetch(address + '/api/publications/' + "AY6InkoAAAAJ").then(res => res.json()).then(data => {
        setpublications(data[0]);
        setLoadingpublications(false);
      }).catch(err => {
        console.log(err);
      })
    }, 200)
  }, [])

  const onAuthorclick = (id) => {
    let text = items[id].id;
    setLoadingpublications(true);
    fetch(address + '/api/publications/' + text).then(res => res.json()).then(data => {
      setpublications(data[0]);
      setLoadingpublications(false);
      setAuthor(items[id]);
      handleDrawerToggle()
    }).catch(err => {
      console.log(err);
    })
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const tempItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );
    // if (localStorage.getItem('authorsOrder') !== null) {
    //   let temp = JSON.parse(localStorage.getItem('authorsOrder'));
    //   localStorage.setItem('authorsOrder', reorder(
    //     localStorage.getItem('authorsOrder'),
    //     result.source.index,
    //     result.destination.index
    //   ))
    // }
    // else
    localStorage.setItem('authorsOrder', JSON.stringify(tempItems.map((item) => item.id)))
    setItems(tempItems);
  }

  return (

    < div className="App" >
      <Box
        // component="nav"
        sx={{ margin: { sm: "0" }, width: matches ? "25%" : "0%", flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant={matches ? "permanent" : "temporary"}
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            margin: { sm: "0" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: matches ? "25%" : "85%"
            }
          }}
        >
          <LeftPanel loadingAuthor={loadingAuthors} onDragEnd={onDragEnd} items={items} selected={publications.id} onAuthorclick={onAuthorclick} onAuthorSubmit={onAuthorSubmit} />
        </Drawer>
      </Box>
      {
        matches ? null : <IconButton style={{ zIndex: 10, position: "absolute", top: 10, left: 5 }} onClick={handleDrawerToggle} >
          <MenuIcon />
        </IconButton>
      }
      {/* <LeftPanel loadingAuthor={loadingAuthors} onDragEnd={onDragEnd} items={items} selected={publications.id} onAuthorclick={onAuthorclick} onAuthorSubmit={onAuthorSubmit} /> */}
      <div style={{ flex: 1, position: "relative" }}>
        {(loadingpublications || loadingAuthors) ? <ScaleLoader color={theme.palette.secondary.main} size={40} cssOverride={{ position: "absolute", left: "50%", top: "5vh" }} /> : <DashboardPanel loadingpublications={loadingpublications} publications={publications.articles} author={author} />}
        {/* {loadingAuthors ? null : } */}
      </div>

    </div >
  );
}

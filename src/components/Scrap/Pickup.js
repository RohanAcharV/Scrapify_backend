import { Box, Button, IconButton, ImageList, ImageListItem, Typography ,CircularProgress, TextField} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React, { useState } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AddPhotoAlternate, Camera, Delete } from "@mui/icons-material";
import Webcamera from "../Olx/Sellform/Webcam";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { Icon } from "leaflet";

function Pickup(){


const [pdate,setpdate]=useState(null);
const [imagesArray, setImagesArray] = useState([]);
  const [imageflag, setimageflag] = useState('close');


  const handleDeleteimage = (index) => {
    setImagesArray((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");


  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      console.log(position)
    });
  }, []);

  const customIcon = new Icon({
    iconUrl: require("./marker.webp"),
    iconSize: [30, 30],
  });

    return (
        <div>

            <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',m:'5vh 0',textAlign:'center'}}>

            <Box sx={{ m: '3vh 0', border: '1px solid grey', borderRadius: '5px', width: { xs: "90vw", sm: "70vw" } }}>
        <Box>
          <Typography sx={{mb:'1vh',height:'5vh',backgroundColor:'rgba(144, 238, 144, 0.8);',fontWeight:'bolder',fontSize:{xs:'14px',sm:'16px'},p:'1vh 0'}}>Select date</Typography>
        </Box>
        <Box sx={{m:'2vh 0'}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
      
        <DatePicker  
        disablePast
        dateFormat="dd/MM/yyyy"
        isClearable
        onChange={(date)=>setpdate(`${date.$D}/${date.$M+1}/${date.$y}`)}
        />
      
    </LocalizationProvider>
    <br />
    <Typography sx={{mt:'2vh',color:'grey'}}>Our pickup team will call one hour before their arrival </Typography>
        </Box>
      </Box>

      <Box
          sx={{
            m: "3vh 0",
            border: "1px solid grey",
            borderRadius: "5px",
            width: { xs: "90vw", sm: "70vw" },
          }}
        >
          <Box>
            <Typography
              sx={{
                mb: "1vh",
                height: "5vh",
                backgroundColor: "rgba(144, 238, 144, 0.8);",
                fontWeight: "bolder",
                fontSize: { xs: "14px", sm: "16px" },
                p: "1vh 0",
              }}
            >
              Enter address
            </Typography>
          </Box>
          <Box sx={{ m: "2vh 0" }}>
          <TextField label="Address line 1" sx={{width:'80%',marginBottom:'2vh'}} />
      <TextField label="Address line 2" sx={{width:'80%',marginBottom:'2vh'}} />
      <TextField label="Pincode" sx={{width:'80%',marginBottom:'2vh'}} />
          </Box>
          {/*---------------------Map box below --------------------------------------------------- */}
          <Box
            sx={{
              backgroundColor: "white",
              width: "100%",
              height: { xs: "260px", sm: "320px" },
            }}
          >
            {
              (latitude!='' && longitude!='') ? (<MapContainer center={[latitude, longitude]} zoom={20}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  style={{ pointerEvents: 'none' }}
                />
                <Marker position={[latitude, longitude]} icon={customIcon}>
                  <Popup>A</Popup>
                </Marker>
              </MapContainer>):(<><CircularProgress/><Typography>fetching current location</Typography></>)
            }
          </Box>
        </Box>

      <Box sx={{ m: '3vh 0', border: '1px solid grey', borderRadius: '5px',width: { xs: "90vw", sm: "70vw" } }}>
        <Box><Typography sx={{mb:'1vh',height:'5vh',backgroundColor:'rgba(144, 238, 144, 0.8);',fontWeight:'bolder',fontSize:{xs:'14px',sm:'16px'},p:'0vh 0'}}>Upload images</Typography></Box>
         <Box sx={{m:'0vh 0'}}>
         <Box sx={{ border: '1px solid black' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Button sx={{ display: 'flex', alignItems: 'center' }} onClick={() => setimageflag('select')}> <AddPhotoAlternate />Add photo</Button>
            <Button sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }} onClick={() => setimageflag('click')}><Camera />Click a photo</Button>
          </Box>

          <Webcamera imageflag={imageflag} imagesArray={imagesArray} setImagesArray={setImagesArray} setimageflag={setimageflag} />

          <Box>
            <ImageList sx={{ width: '100%' }} cols={2} rowHeight={180}>
              {imagesArray.map((image, index) => (
                <ImageListItem sx={{ margin: '1px', border: '0.2px solid black' }} key={index}>
                  <img src={image} alt={'image'} loading="lazy" style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
                  <IconButton sx={{ position: 'absolute', top: 0, right: 0, borderRadius: '20px', color: 'white', backgroundColor: 'red' }} onClick={() => handleDeleteimage(index)}>
                    <Delete fontSize="small" />
                  </IconButton>

                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        </Box>

         </Box>
      </Box>

      <Button sx={{width:'70vw',backgroundColor:'rgba(0,128,0,0.8)',height:'5vh',color:'white',fontWeight:'bold',m:'3vh 0'}}>Confirm pickup</Button>
            </Box>
        </div>
    )
}

export default Pickup;
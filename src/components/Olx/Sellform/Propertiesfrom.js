// PropertiesForm.jsx
import React, { useEffect,useRef,useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
  ImageListItem,
  ImageList,
} from '@mui/material';
import { AddPhotoAlternate, Camera, Delete } from '@mui/icons-material';
import Webcam from "react-webcam";
import Webcamera from './Webcam';

import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { imgDB } from '../../../config/firebase';
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from 'react-router-dom';

const PropertiesForm = ({flag,editdata}) => {

  const [imagesArray,setImagesArray]=useState([]);
  const [imageflag,setimageflag]=useState('close');
  const fileInputRef = useRef(null);

  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    category:'Properties',
    propertyType: 'house', 
    transactionType: 'sale', 
    price:'',
    plotArea: '',
    lengthBreadth: '',
    floors: '',
    rooms: '',
    address: '',
    landmark: '',
    additionalDescription: '',
    postedDate: new Date().toLocaleDateString('en-GB'),
    images:[],
    useremail:localStorage.getItem('user_email'),
    status:'active'
  });

  useEffect(()=>{
    if(flag=='edit' && editdata)
    {setFormData(editdata);setImagesArray(editdata.images)}
  },[flag]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePropertyTypeChange = (e) => {
    setFormData((prevData) => ({ ...prevData, propertyType: e.target.value }));
  };

   
  const handleDeleteimage = (index) => {
    setImagesArray((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit =async(e) => {
    e.preventDefault();
    // Handle the form submission logic here
    if(flag=='save'){
      try {
        const promises = imagesArray.map(async (image) => {
          const imgRef = ref(imgDB, `Imgs/${v4()}`);
          const imageData = await fetch(image).then((res) => res.blob());
          await uploadBytes(imgRef, imageData);
          const downloadURL = await getDownloadURL(imgRef);
          console.log("Download URL:", downloadURL);
          return downloadURL;
        });
    
        const downloadURLs = await Promise.all(promises);
        console.log("All URLs:", downloadURLs);
        formData.images = downloadURLs;

      } catch (error) {
        console.error("Error uploading images:", error);
      }


      const uid = localStorage.getItem('uid');
      try {
        const resellDocRef = await addDoc(collection(db,"resellDoc"), formData);

        console.log('Document written with ID: ', uid);
      } catch (error) {
        console.error('Error adding/updating document: ', error);
      }
      navigate("/myads")
    }
    else{
      // edit logic here
      //u will get the id from formdata
    }
    console.log(formData);
  };

  return (
    <Container maxWidth="sm">
      
      <form onSubmit={handleSubmit}>
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Property Type</FormLabel>
          <RadioGroup row name="propertyType" value={formData.propertyType} onChange={handlePropertyTypeChange}>
            <FormControlLabel value="house" control={<Radio />} label="House" />
            <FormControlLabel value="landPlot" control={<Radio />} label="Land/Plot" />
          </RadioGroup>
        </FormControl>
        <TextField label="Price" fullWidth margin="normal" name="price" value={formData.price} onChange={handleChange} />
        {formData.propertyType === 'house' ? (
          <>
            <FormControl fullWidth margin="normal">
              {/* <InputLabel id="transaction-type-label">Transaction Type</InputLabel> */}
              <Select
                labelId="transaction-type-label"
                name="transactionType"
                value={formData.transactionType}
                onChange={handleChange}
              >
                <MenuItem value="sale">Sale</MenuItem>
                <MenuItem value="rent">Rent</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Plot Area" fullWidth margin="normal" name="plotArea" value={formData.plotArea} onChange={handleChange} />
            
            <TextField label="Floors" fullWidth margin="normal" name="floors" value={formData.floors} onChange={handleChange} />
            <TextField label="Rooms" fullWidth margin="normal" name="rooms" value={formData.rooms} onChange={handleChange} />
          </>
        ) : (
          <>
            <TextField label="Plot Area" fullWidth margin="normal" name="plotArea" value={formData.plotArea} onChange={handleChange} />
            <TextField
              label="Length x Breadth"
              fullWidth
              margin="normal"
              name="lengthBreadth"
              value={formData.lengthBreadth}
              onChange={handleChange}
            />
          </>
        )}
        
        <TextField label="Address" fullWidth margin="normal" name="address" value={formData.address} onChange={handleChange} />
        <TextField label="Landmark Nearby" fullWidth margin="normal" name="landmark" value={formData.landmark} onChange={handleChange} />
        <TextField
          label="Additional Description"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          name="additionalDescription"
          value={formData.additionalDescription}
          onChange={handleChange}
        />
                <Box sx={{border:'1px solid black'}}>
          <Box sx={{display:'flex',justifyContent:'space-around'}}>
          <Button sx={{ display: 'flex', alignItems: 'center' }} onClick={()=>setimageflag('select')}> <AddPhotoAlternate/>Add photo</Button>
          <Button sx={{display:{xs:'none',md:'flex'}, alignItems: 'center'}} onClick={()=>setimageflag('click')}><Camera/>Click a photo</Button>
          </Box>
          
         <Webcamera imageflag={imageflag} imagesArray={imagesArray} setImagesArray={setImagesArray} setimageflag={setimageflag}/>

<Box>
<ImageList sx={{ width: '100%' }} cols={2} rowHeight={180}>
  {imagesArray.map((image,index) => (
    <ImageListItem sx={{margin:'1px',border:'0.2px solid black'}} key={index}>
      <img src={image} alt={'image'} loading="lazy" style={{objectFit:'contain',width:'100%',height:'100%'}}/>
      <IconButton sx={{ position: 'absolute', top: 0, right: 0, borderRadius: '20px', color: 'white', backgroundColor: 'red' }} onClick={() => handleDeleteimage(index)}>
  <Delete fontSize="small" />
</IconButton>

    </ImageListItem>
  ))}
</ImageList>
</Box>
        </Box>

        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" sx={{width:'100%',fontWeight:'bold'}}>
          {flag=='save'? ('Submit'):('Update')}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default PropertiesForm;

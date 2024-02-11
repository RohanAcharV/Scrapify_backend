import { CloudUpload } from "@mui/icons-material";
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, TextField, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

function Dialog1({ open1, handleClose, setprofileimg }) {
  const [imageSrc, setImageSrc] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const uploadedImageSrc = reader.result;
        setImageSrc(uploadedImageSrc);
        
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageSrc(null);
  };

  const handleSave=()=>{
    //update the image firebase
    setprofileimg(imageSrc); 
    handleClose();
  }

  return (
    <Dialog open={open1} onClose={handleClose}>
      <DialogTitle>Edit Image </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <input
          accept="image/*"
          id="contained-button-file"
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="contained-button-file">
          <IconButton component="span">
          <Avatar sx={{ width: { xs: '100px', sm: '200px' }, height: { xs: '100px', sm: '200px' } }}>
            {imageSrc ? <img src={imageSrc} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <CloudUpload />}
          </Avatar>

          </IconButton>
        </label>
        {imageSrc && (
          <Button variant="outlined" onClick={handleRemoveImage} sx={{ mt: 1 }}>
            Change
          </Button>
        )}
        
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}


function Profile(){
  // const navigate = useNavigate();
  const [profileimg,setprofileimg]=useState(null);
  const [open1, setopen1] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleClose = () => {
    setopen1(false);
  };

  useEffect(() => {
    // Get UID from local storage
    const uid = localStorage.getItem('uid');
      
    if (uid) {
      const getUserData = async () => {
        try {
          const userDocRef = doc(db,'users',uid);
          //
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserData(userData);
          } else {
            console.log('User document does not exist');
          }
        } catch (error) {
          console.error('Error fetching user data:', error.message);
        }

        //   getDoc(userDocRef)
        //   .then((doc)=>{
        //     console.log(doc.data().email);
        //     // const userData = doc.data();
        //     setUserData(doc.data());
        //   })
        
        // } catch (error) {
        //   console.error('Error fetching user data:', error.message);
        // }
      };

      getUserData();
    } else {
      console.log('User UID not found in local storage');
    }
    // console.log(userData)
  }, []);
    return(
        <>
        <Box sx={{width:{xs:'90vw',sm:'80vw',md:'60vw'},margin:'5vh auto'}}>
            <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',margin:'5vh 0'}}><Avatar sx={{width:{xs:'150px',sm:'250px'},height:'auto'}} src={profileimg}></Avatar>
                <Typography sx={{m:'2vh 0',fontSize:{xs:'18px',sm:'24px'}}}>{userData ? userData.name : 'Loading...'}</Typography>
                <Button sx={{color:'green',fontWeight:'bold',textTransform:'none' ,'&:hover': { backgroundColor: 'transparent' } }} disableRipple onClick={()=>setopen1(true)}>Change</Button>
            </Box>
            <Dialog1 open1={open1} handleClose={handleClose} setprofileimg={setprofileimg}/>
            {/* <Dialog2 open2={open2} handleClose={handleClose}/> */}
            <Divider/>
            <Box mt={'4vh'} sx={{textAlign:'center'}}>
                <Box sx={{margin:'2vh 0'}}>
                    <Box><Typography sx={{color:'grey'}}>Mobile number</Typography>
                    <Typography>{userData ? userData.phone : 'Loading...'}</Typography>
                    </Box>
                   
                </Box>
                <Box sx={{margin:'2vh 0'}}>
                    <Box><Typography sx={{color:'grey'}}>Email address</Typography>
                    <Typography>{userData ? userData.email : 'Loading...'}</Typography>
                    </Box>
                   
                </Box>
            </Box>
        </Box>
        </>
    )
}

export default Profile;
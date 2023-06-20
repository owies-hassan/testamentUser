

import React, {Fragment, useState} from 'react';


import {Box, TextField,DialogTitle,DialogContent,DialogActions,Dialog,Button,InputLabel,MenuItem,FormControl,Select,Chip,Stack,Grid} from "@mui/material";

import styles from '../../styles/model_testament.module.scss'

import {postData, updateData} from "../../Utils/FetchData";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import AlertNotify from "./AlertNotify";
import CheckIcon from '@mui/icons-material/Check';
import {useTranslation} from "next-i18next";
import {showNotify} from "../../Store/Slicess/SliceNotify";



const ModelTestament = ({open,setOpen}) => {


    const router=useRouter()
    const dispatch=useDispatch()

    const{Alert}=useSelector(state=>state.sliceNotify)
    const {testamentUser}=useSelector(state=>state.sliceTestament)
    const {auth}=useSelector(state=>state.sliceAuth)

    const {t:translate}=useTranslation('index')
    const kindOfTestament=['public','votes users','special Friends']
    const[writeTestament,setWriteTestament]=useState(testamentUser.testament||'')
    const[selectTypeTestament,setSelectTypeTestament]=useState('');
    const[selectSpecialFriend,setSelectSpecialFriend]=useState({email:'',name:'',password:''})
    const[selectReceiveFriend,setSelectReceiveFriend]=useState('')
    const[selectCountLikeFriend,setSelectCountLikeFriend]=useState(testamentUser.countLikeUsers||0)
    const[collectionSelectSpecialFriend,setCollectionSelectSpecialFriend]=useState(testamentUser.selectSpecialFriend||[])
    const[collectionReceiveSpecialFriend,setCollectionReceiveSpecialFriend]=useState(testamentUser.selectReceiveFriend||[])






    const data={
        typeTestament:selectTypeTestament,
        testament:writeTestament,
        selectSpecialFriend:collectionSelectSpecialFriend,
        selectReceiveFriend: collectionReceiveSpecialFriend,
        countLikeUsers:selectCountLikeFriend,
        statusTestament:true,
    }


    const handleClose = () => {
        setOpen(false);
    };


    const addSpecialFriends = async () => {
        const checkDoubleName=collectionSelectSpecialFriend.find(item=>item.email===selectSpecialFriend.email)

        if (!selectSpecialFriend.email||!selectSpecialFriend.name||!selectSpecialFriend.password){

            dispatch(showNotify({showAlert:true,title:translate('error_add_all_field'),status:'error'}))

        }else if (checkDoubleName !== undefined){
            dispatch(showNotify({showAlert:true,title:translate('error_email_exist'),status:'error'}))

        }else {

                const data={
                    name:selectSpecialFriend.name,
                    email:selectSpecialFriend.email,
                    password:selectSpecialFriend.password,
                    type:'select special friends',
                }

                const addUser=await postData('user/check',data,auth.access_Token)
                dispatch(showNotify({showAlert:true,title: translate('success_special_friends'),status:'success'}))

                setCollectionSelectSpecialFriend([...collectionSelectSpecialFriend,addUser])
                setSelectSpecialFriend({...selectSpecialFriend,name:'',email: '',password:''})


        }


    }
    const addReceiveSpecialFriends=()=>{
        const existName=collectionSelectSpecialFriend.find(item=>item.name===selectReceiveFriend)
        const checkDoubleName=collectionReceiveSpecialFriend.find(item=>item.name===selectReceiveFriend)


        if (!selectReceiveFriend){
            dispatch(showNotify({showAlert:true,title: translate('error_add_name'),status:'error'}))

        } else if (existName !== undefined) {
            if (checkDoubleName){
                dispatch(showNotify({showAlert:true,title: translate('error_email_exist'),status:'error'}))

            }else{
                dispatch(showNotify({showAlert:true,title: translate('success_receive_friends'),status:'success'}))
                setCollectionReceiveSpecialFriend([...collectionReceiveSpecialFriend,existName])
                setSelectReceiveFriend('')


            }

        }else {
            dispatch(showNotify({showAlert:true,title: translate('error_name_no_exist'),status:'error'}))

        }

    }

    const handleDeleteSelectSpecialFriend=(email)=>{

        const filtered= collectionSelectSpecialFriend.filter(item=>item.email!==email)
        setCollectionSelectSpecialFriend(filtered)
        dispatch(showNotify({showAlert:true,title: translate('success_delete_special'),status:'success'}))



    }
    const handleDeleteReceiveFriends=(name)=>{
        const filtered= collectionReceiveSpecialFriend.filter(item=>item.name!==name)
        setCollectionReceiveSpecialFriend(filtered)


        dispatch(showNotify({showAlert:true,title: translate('success_delete_receive'),status:'success'}))



    }
    const updateDataTestament=async (data,)=>{
        const update=await updateData('testament',data,auth.access_Token)
        if (update.err) return  console.log('err')
        return  router.reload()
    }
    const createDataTestament=async (data)=>{
        const update=await postData('testament', data, auth.access_Token)
        if (update.err) return  console.log('err')
       return  router.reload()
    }
    const handleSubmit = async () => {

        if (selectTypeTestament==='special Friends'){
            if (!collectionSelectSpecialFriend.length || !collectionReceiveSpecialFriend.length || !writeTestament){


                dispatch(showNotify({showAlert:true,title: translate('error_add_all_field'),status:'error'}))

            }else {
             return  await createDataTestament(data)

            }
        }
        else if (selectTypeTestament==='votes users'){
            if (!selectCountLikeFriend || !writeTestament){
                dispatch(showNotify({showAlert:true,title: translate('error_add_all_field'),status:'error'}))



            }else {

                return  await createDataTestament(data)
            }
        }
        else if (selectTypeTestament==='public') {

            if (!writeTestament){
                dispatch(showNotify({showAlert:true,title: translate('error_testament'),status:'error'}))



            }else {
                return  await createDataTestament(data)
            }


        }else {
            dispatch(showNotify({showAlert:true,title: translate('error_select_type'),status:'error'}))



        }




    }
    const handleUpdate=async ()=>{
        if (selectTypeTestament==='special Friends'){
            if (!collectionSelectSpecialFriend.length || !collectionReceiveSpecialFriend.length || !writeTestament){


                dispatch(showNotify({showAlert:true,title: translate('error_add_all_field'),status:'error'}))

            }else {

             return  await updateDataTestament(data)
            }
        }
        else if (selectTypeTestament==='votes users'){
            if (!selectCountLikeFriend|| !writeTestament){


                dispatch(showNotify({showAlert:true,title: translate('error_add_all_field'),status:'error'}))

            }else {
              return   await updateDataTestament(data)

            }
        }
        else if (selectTypeTestament==='public') {
            if (!writeTestament){


                dispatch(showNotify({showAlert:true,title: translate('error_testament'),status:'error'}))

            }else {
                let data={
                    typeTestament:selectTypeTestament,
                    testament:writeTestament,
                    selectSpecialFriend:[],
                    selectReceiveFriend: [],
                    countLikeUsers:0,
                    statusTestament:true,
                }
                return   await updateDataTestament(data)
            }



        }
        else {



            dispatch(showNotify({showAlert:true,title: translate('error_select_type'),status:'error'}))

        }

    }



    return (
        <div  className={styles.content_model_testament}>
            <Dialog fullWidth
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"



            >
                {Alert.showAlert&&<AlertNotify  status={Alert.status}  title={Alert.title} showAlert={Alert.showAlert} />}

                <DialogTitle id="alert-dialog-title">
                    {testamentUser.statusTestament?<p>{translate('updateTestament')}</p>:  <p>{translate('create_testament')}</p>}
                </DialogTitle>

                <DialogContent >

                    <div className='create_testament'>
                        <TextField
                         sx={{background:'white'}}
                            id="filled-textarea"
                            label={translate('Testament')}
                            multiline
                            rows={6}
                            fullWidth
                            variant="filled"
                            value={writeTestament}
                            onChange={(e)=>setWriteTestament(e.target.value)}
                        />

                    </div>
                    {testamentUser.statusTestament?<p>{translate('change mode')}</p>:<div>{translate('add mode')}</div>}

                    { /*select mode*/}
                    <div className={'selectModeTestament'}>
                        <FormControl fullWidth variant="standard" sx={{ m: 1 }}>
                            <InputLabel id="demo-simple-select-standard-label">{translate('select Type of Testament')}</InputLabel>
                            <Select
                                sx={{color:'white'}}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={selectTypeTestament}
                                onChange={(e)=>setSelectTypeTestament(e.target.value)}
                                label="select Type of Testament"
                            >
                                {kindOfTestament.map(item=>{
                                    return(

                                        <MenuItem key={item} value={item}>{item}</MenuItem>

                                    )
                                })}

                            </Select>
                        </FormControl>
                    </div>
                    { /*select mode*/}

                    { /*option mode*/}
                    <Box className={'optionModeTestament'}>
                        {!selectTypeTestament&&''}
                        {selectTypeTestament==='public'&& <div className='info_defult'>
                           <p>{translate('warning_public')}</p>
                        </div>}

                        { /*votes users*/}
                        {selectTypeTestament==='votes users'&& <Box className={styles.option_votes_users}>
                            <div className='info_likes_friend'>
                             <p>{translate('warning_likes_users')}</p>
                            </div>
                            {/*<span>{translate('select_friends')}</span>*/}
                            <TextField
                                fullWidth
                                id="filled-textarea"
                                variant="filled"

                                type='number'
                                label='test-user'
                                value={selectCountLikeFriend}
                                onChange={(e)=>setSelectCountLikeFriend(e.target.valueAsNumber)}
                                placeholder='example 100'
                            />

                            <p>{translate('you_pick_up')} : <span> {selectCountLikeFriend} {selectCountLikeFriend&&translate('friends')}</span></p>
                        </Box>}
                        { /*votes users*/}




                        { /*special Friends*/}
                        {selectTypeTestament === 'special Friends' &&
                        <Box className={styles.option_special_friends}>
                            <div className='info_special_Friends'>
                               <p>{translate('warning_special_friends')}</p>
                            </div>
                            <Grid className='pick_up_select_friends' mt={2} container direction='column'>
                                <span>{translate('select_witness')}</span>
                                <TextField
                                    id="filled-textarea"
                                    variant="filled"
                                    sx={{margin: '10px 0',}}
                                    type='email'
                                    label={translate('email')}
                                    value={selectSpecialFriend.email}
                                    onChange={(e) => setSelectSpecialFriend(prevState => ({
                                        ...prevState,
                                        email: e.target.value
                                    }))}
                                    placeholder='lallala@lolo.com   write here any thing or email'
                                />
                                <TextField
                                    id="filled-textarea"
                                    variant="filled"
                                    sx={{margin: '10px 0'}}
                                    type='text'
                                    label={translate('Name')}
                                    value={selectSpecialFriend.name}
                                    onChange={(e) => setSelectSpecialFriend(prevState => ({
                                        ...prevState,
                                        name: e.target.value
                                    }))}
                                    placeholder={translate('writeHere_first_last_name')}
                                />
                                <TextField
                                    id="filled-textarea"
                                    variant="filled"
                                    sx={{margin: '10px 0'}}
                                    type='text'
                                    label={translate('password')}
                                    value={selectSpecialFriend.password}
                                    onChange={(e) => setSelectSpecialFriend(prevState => ({
                                        ...prevState,
                                        password: e.target.value
                                    }))}
                                    placeholder='example 100'
                                />
                                <Button variant='contained' color='primary' onClick={addSpecialFriends}>{collectionSelectSpecialFriend.length ? translate('add_more_special') : translate('add')}</Button>


                               <Grid gap={2} p={1}  container direction='column' alignContent='center'>
                                   {collectionSelectSpecialFriend && collectionSelectSpecialFriend.map(item => {
                                       return (
                                           <Fragment  key={item.name}>
                                               <Stack width={'80%'}  direction="row" spacing={1}  justifyContent='center' alignItems='center'>
                                                   <Chip label={`${item.name} ${item.email}`} variant="outlined"
                                                         color="success"
                                                         onDelete={() => handleDeleteSelectSpecialFriend(item.email)}/>

                                                   {item.isExist?
                                                       <Grid container direction='row' justifyContent='space-around' alignItems='center' flexWrap='nowrap'  >
                                                           <p style={{fontSize:'12px'}} >{translate('user_exist')}</p>
                                                           <CheckIcon  color='success'/>
                                                       </Grid>
                                                       :''}
                                               </Stack>

                                           </Fragment>
                                       )
                                   })

                                   }
                               </Grid>
                            </Grid>
                            ____________________________

                            <Grid className='pick_up_receive_friends' mt={2} container direction='column'>
                                <span>{translate('select_receive_witness')}</span>

                                <TextField
                                    id="filled-textarea"
                                    variant="filled"
                                    sx={{margin: '10px 0'}}
                                    type='test'
                                    label={translate('Name')}
                                    value={selectReceiveFriend}
                                    onChange={(e) => setSelectReceiveFriend(e.target.value)}
                                    placeholder={translate('ali baba')}
                                />
                                <Button variant='contained' color='primary' onClick={addReceiveSpecialFriends}>{collectionReceiveSpecialFriend.length ? translate('add_more_receive') : translate('add')}</Button>



                               <Grid gap={2} p={2}  container direction='column' alignContent='center'>
                                   {collectionReceiveSpecialFriend && collectionReceiveSpecialFriend.map(item => {
                                       return (
                                           <Fragment key={Math.random()*10}>
                                               <Stack  direction="row" spacing={1} >
                                                   <Chip label={`${item.name} ${item.email}`} variant="outlined"
                                                         color="success"
                                                         onDelete={() => handleDeleteReceiveFriends(item.name)}/>
                                               </Stack>
                                           </Fragment>
                                       )
                                   })}
                               </Grid>

                            </Grid>
                        </Box>}
                        { /*special Friends*/}




                    </Box>
                    { /*option mode*/}

                </DialogContent>


                <DialogActions>
                    <Button onClick={handleClose}>{translate('cancel')}</Button>
                    {testamentUser.statusTestament?<Button onClick={handleUpdate} autoFocus>{translate('update')}</Button>: <Button onClick={handleSubmit} autoFocus>{translate('submit')}</Button>}
                </DialogActions>



            </Dialog>
        </div>
    );
};

export default ModelTestament
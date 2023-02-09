import { Box, Typography, Button } from '@mui/material'

function UpdateModal({task, setShowUpdateModal}) {
    
    const handleSubmit = () => {
        console.log('saved');
    }
    
    
    return (
        <Box component="form" sx={{ zIndex: 5 }} noValidate>
            <div className='modal'>
                <div className='modalWrapper'>
                    <Typography variant='h5'>Update task: {task.title}</Typography>
                    <Button onClick={handleSubmit}>Save</Button> 
                    <Button onClick={() => setShowUpdateModal(false)} color="error">Cancel</Button>                  
                </div>
            </div>
            
        </Box>


    )
}

export default UpdateModal;
import "./App.css"

import { useEffect, useState } from "react"
import { Uploader } from "./uploader"

import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


export default function App() {
  const [file, setFile] = useState(undefined)
  const [uploader, setUploader] = useState(undefined)
  const [percentage, setPercentage] = useState(0)


  useEffect(() => {
    if (file) {
      let percentage = undefined

     const videoUploaderOptions = {
        fileName: "foo",
        file: file,
      }
      const uploader = new Uploader(videoUploaderOptions)
      setUploader(uploader)

      uploader
        .onProgress(({ percentage: newPercentage }) => {
          // to avoid the same percentage to be logged twice
          if (newPercentage !== percentage) {
            percentage = newPercentage
            setPercentage(percentage)
          }
        })
        .onError((error) => {
          setFile(undefined)
          console.error(error)
        })

      uploader.start()
    }
  }, [file])

  const onCancel = () => {
    if (uploader) {
      uploader.abort()
      setFile(undefined)
    }
  }

  function CircularProgressWithLabel(props) {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress variant="determinate" {...props} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" component="div" color="text.secondary">
            {`${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
    );
  }
  

  return (
    <div className="App">
      <h1>Upload your file</h1>
      <div>
        <input
          type="file"
          onChange={(e) => {
            setFile(e.target?.files?.[0])
          }}
        />
      </div>
      <Box sx={{marginBottom: "20px"}}>
        <button onClick={onCancel}>Cancel</button>
      </Box>
      <CircularProgressWithLabel value={percentage} />
    </div>
  )
}
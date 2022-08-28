import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import { Box, Button, IconButton, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { IosShare } from '@mui/icons-material';
import io from 'socket.io-client';
const url = 'https://gnaniai-backend.herokuapp.com';
const socket = io(url);

const getData = async () => {
  const res = await axios.get(`${url}/api/`);
  return res.data;
};
function App() {
  const [count, setCount] = useState([0, 0, 0]);
  const handleUpdate = () => {
    axios.post(`${url}/api/`, {
      data: count,
    });
    socket.emit('send-data', count);
  };

  const handleClick = (i: number) => {
    let temp;
    setCount(prev => {
      temp = [...prev];
      temp[i]++;
      return temp;
    });
    socket.emit('send-data', temp);
  };

  useEffect(() => {
    socket.on('recieve-data', data => {
      setCount(data);
    });
  }, [socket]);
  useEffect(() => {
    getData().then(data => {
      // console.log(data.buttons);
      if (data?.buttons?.length) {
        setCount(data.buttons);
      }
    });
  }, []);
  return (
    <div style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Stack direction='row' gap={4}>
        {count.map((val, i) => (
          <Stack key={i}>
            <h2>{val}</h2>
            <Button variant='contained' onClick={() => handleClick(i)}>
              Button&nbsp;{i + 1}
            </Button>
          </Stack>
        ))}
        <Stack gap={2}>
          <Button
            color='secondary'
            variant='contained'
            onClick={() => {
              setCount(prev => [...prev, 0]);
              socket.emit('send-data', [...count, 0]);
            }}
          >
            <AddIcon />
          </Button>
          <Button variant='contained' onClick={handleUpdate}>
            Update
          </Button>
        </Stack>
      </Stack>
    </div>
  );
}

export default App;

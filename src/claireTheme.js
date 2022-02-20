import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function LabTabs() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Box component="span" sx={{ p: 2, border: '1px dashed grey', width =[100, 200, 300, 400, 500] }}>
        <h1>Website Name</h1>
      </Box>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="website tabs">
              <Tab label="Multiplayer Search" value="1" />
              <Tab label="Single Player Search" value="2" />
              <Tab label="Other" value="3" />
              <Tab label="Other" value="4" />
            </TabList>
          </Box>
          <TabPanel value="1">Multiplayer Search</TabPanel>
          <TabPanel value="2">Single Player Search</TabPanel>
          <TabPanel value="3">Other</TabPanel>
          <TabPanel value="4">Other</TabPanel>
        </TabContext>
      </Box>
      <TextField id="outlined-basic" label="Steam ID" variant="outlined" />
      <Button variant="contained">ADD</Button>
    </div>
  );
}




<Box sx={{ width: '100%' }}>
  <Tabs
    value={value}
    onChange={handleChange}
    textColor="secondary"
    indicatorColor="secondary"
    aria-label="secondary tabs example"
  >
    <Tab value="one" label="Item One" />
    <Tab value="two" label="Item Two" />
    <Tab value="three" label="Item Three" />
  </Tabs>
</Box>




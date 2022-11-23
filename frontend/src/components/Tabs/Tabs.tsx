import React, { useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { IApp, IAssetData } from '../../types/assets';
import CustomTable from '../../components/Table/Table';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface BasicTabsProps {
  apps: Array<IApp>;
  allData: IAssetData[];
  handleUpdate: Function;
}

export default function BasicTabs({apps, allData, handleUpdate}: BasicTabsProps) {
  const [value, setValue] = useState(1);
  const [appData, setAppData] = useState<Array<IAssetData>>(allData.filter(data => data.managed_app === 1));
  
  // 選択されたタブの値に応じて、表示データを変更する
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setAppData(allData.filter(data => data.managed_app === newValue))
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {apps.map((m, index) => (
            <Tab label={m.name} {...a11yProps(m.id)} value={m.id}/>
          ))}
        </Tabs>
      </Box>
      {apps.map((m, index) => (
        <TabPanel value={value} index={m.id}> {(appData !== undefined) && <CustomTable appData={appData} app={m.name} handleUpdate={handleUpdate} />}</TabPanel>
          ))}
      
    </Box>
  );
}
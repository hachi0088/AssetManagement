import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from "axios";
import { IApp, IChartData, IAssetData } from '../types/assets';
import styles from '../styles/assets.module.css';
import BasicTabs from '../components/Tabs/Tabs';
import Button from '@mui/material/Button';
import RegisterAssetDialog from '../components/Dialog/RegisterAssetDialog';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const borderColorList: string[] = ['rgb(255, 99, 132)', 'rgb(53, 162, 235)']
const backgroundColorList: string[] = ['rgba(255, 99, 132, 0.5)', 'rgba(53, 162, 235, 0.5)']

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: '資産残高',
    },
  },
};

export const Assets = () => {
  const [apps, setApps] = useState<Array<IApp>>();
  const [chartData, setChartData] = useState<Array<IChartData>>([]);
  const [labels, setLabels] = useState<Array<IChartData>>([]);
  const [allData, setAllData] = useState<Array<IAssetData>>();
  const [update, setUpdate] = useState(false);
  const [open, setOpen] = useState(false);


  const createChartData = (appNames:Array<IApp>) => {
    console.log(appNames);
    let temp: IChartData[] = [];
    appNames.map((e, i) => {
      let test:Number[] = []
      axios
      .get(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/asset-management/v1/asset-amount/?target=${e.name}`)
      .then((response) => {
        test = response.data.data;
        const value: IChartData = {
          label: e.name,
          data: response.data.data,
          borderColor: borderColorList[i],
          backgroundColor: backgroundColorList[i],
        }
        temp.push(value);
        if (temp.length === appNames.length){
          setChartData(temp);
        }
      });      
    });
  }

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/asset-management/v1/asset-date/`)
      .then((response) => {
        setLabels(response.data.data)
    });
  }, [update]);

  const data = {
    labels,
    datasets: chartData,
  };

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/asset-management/v1/appmaster/`)
      .then((response) => {
        setApps(response.data);
        createChartData(response.data);
      });
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/asset-management/v1/assetlist/`)
      .then((response) => {
        setAllData(response.data);
      });
    }, [update]);

    const handleUpdate = () => {
      setUpdate(!update);
    }

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    return (
      <div className={styles.content_wrapper}>
        <div className={styles.chart}>
          <Line options={options} data={data} />
        </div>
        
        <div className={styles.table}>
          <Button variant="outlined" onClick={handleClickOpen}>
            新規データ登録
          </Button>
          {(apps !== undefined) && (allData !== undefined) && <BasicTabs apps={apps} allData={allData} handleUpdate={handleUpdate} /> }
        </div>

        {(apps !== undefined) && <RegisterAssetDialog open={open} setOpen={setOpen} apps={apps} handleUpdate={handleUpdate} /> }
        
      </div>
    );
  }
  
  export default Assets;
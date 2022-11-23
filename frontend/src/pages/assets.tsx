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
  // アプリ一覧
  const [apps, setApps] = useState<Array<IApp>>();
  // グラフ用データ
  const [chartData, setChartData] = useState<Array<IChartData>>([]);
  // グラフ用ラベルデータ
  const [labels, setLabels] = useState<Array<IChartData>>([]);
  // テーブル表示様データ
  const [allData, setAllData] = useState<Array<IAssetData>>();
  // 更新用
  const [update, setUpdate] = useState(false);
  // ダイアログのOpen/Close制御用
  const [open, setOpen] = useState(false);

  // グラフ表示用データ作成関数
  const createChartData = (appNames:Array<IApp>) => {
    console.log(appNames);
    let temp: IChartData[] = [];
    appNames.map((e, i) => {
      axios
      .get(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/asset-management/v1/asset-amount/?target=${e.name}`)
      .then((response) => {
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
    // アプリ一覧取得
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/asset-management/v1/appmaster/`)
      .then((response) => {
        setApps(response.data);
        createChartData(response.data);
      });
    // ラベルデータ取得
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/asset-management/v1/asset-date/`)
      .then((response) => {
        setLabels(response.data.data)
    });
    // テーブル表示用データ取得
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/asset-management/v1/assetlist/`)
      .then((response) => {
        setAllData(response.data);
      });
  }, [update]);

  // 更新用関数。データが更新された際にAPIの再呼び出しを行う
  const handleUpdate = () => {
    setUpdate(!update);
  }

  // ダイアログのオープン用関数
  const handleClickOpen = () => {
    setOpen(true);
  };

  const data = {
    labels,
    datasets: chartData,
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
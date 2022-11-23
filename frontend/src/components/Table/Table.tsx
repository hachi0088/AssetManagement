import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from "@mui/material/TableHead";
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui//icons-material/EditOutlined";
import DoneIcon from "@mui//icons-material/DoneAllTwoTone";
import RevertIcon from "@mui//icons-material/NotInterestedOutlined";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { IAssetData } from '../../types/assets';
import axios from "axios";

// 型定義
export interface ICreateData{
  [key: string]: string|number|boolean|null;
}

export interface ITableCell{
  row:ICreateData;
  name:string;
  onChange:Function;
}

export interface IPrevious{
  [id: string]: ICreateData;
}

export interface ITableProps{
  appData: IAssetData[];
  app: string;
  handleUpdate: Function;
}

const SimpleTableCell = styled(TableCell)(({ theme }) => ({
  width: 150,
  height: 40
}));



// セルコンポーネント。「isEditMode」がtrueの場合は「Input」、falseの場合はデータを表示する
const CustomTableCell = ({ row, name, onChange }:ITableCell) => {
  const { isEditMode } = row;
  return (
    <SimpleTableCell align="left">
      {isEditMode ? (
        <Input
          value={row[name]}
          name={name}
          onChange={e => onChange(e, row)}
        />
      ) : (
        row[name]
      )}
    </SimpleTableCell>
  );
};

// データ変換用関数。テーブル表示に合わせてデータを変換
const createData = (
  id: number,
  asset_amount: number,
  diff: number,
  diff_rate: number,
  created_at: Date,
  managed_app: string,
  memo: string|null
) => {
return ({
  id: String(id),
  asset_amount: asset_amount,
  diff: diff,
  diff_rate: diff_rate,
  created_at: String(created_at),
  managed_app,
  memo,
  isEditMode: false
})
};

// データ作成用関数
const createTableData = (appData:IAssetData[]|undefined, app:string) => {
  let data: ICreateData[] = [];
  if (appData !== undefined){
    appData.map((d) => {
      data.push(createData(d.id, d.asset_amount, d.diff, d.diff_rate, d.created_at, app, d.memo))
    })
  }
  return data;
}

const CustomTable = ({appData, app, handleUpdate}:ITableProps) => { 
  // テーブル表示用データ
  const [rows, setRows] = useState<Array<ICreateData>>(createTableData(appData, app));
  
  const [previous, setPrevious] = useState<IPrevious>({});

  const onToggleEditMode = (id: string) => {
    setRows(state => {
      return rows.map(row => {
        if (row.id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
  };

  const onChange = (e:any, row:ICreateData) => {
    if (!previous[Number(row.id)]) {
      setPrevious(state => ({ ...state, [String(row.id)]: row }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    const newRows = rows.map(row => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(newRows);
  };

  // データ更新用関数
  const onUpdate = (id:string) => {
    rows.map(row => {
      if (row.id === id) {
        const tempRow = appData.filter(data => data.id.toString() === id)[0];
        tempRow.asset_amount = Number(row.asset_amount);
        tempRow.diff = Number(row.diff);
        tempRow.diff_rate = Number(row.diff_rate);
        tempRow.memo = !row.memo ? null : row.memo.toString();

        axios
          .put(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/asset-management/v1/assetlist/`, tempRow)
          .then((response) => {
            handleUpdate()
          });
      }
    })
    onToggleEditMode(id);
  };

  // データ削除用関数
  const onDelete = (id:string) => {
    rows.map(row => {
      if (row.id === id) {
        axios
          .delete(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/asset-management/v1/assetlist/?target=${id}`)
          .then((response) => {
            handleUpdate()
          });
      }
    })
    onToggleEditMode(id);
  };

  return (
    <Paper>
      <Table aria-label="caption table">
        <TableHead>
          <TableRow>
            <TableCell align="left" />
            <TableCell align="left">資産額</TableCell>
            <TableCell align="left">前回比（円）</TableCell>
            <TableCell align="left">前回比（％）</TableCell>
            <TableCell align="left">日付</TableCell>
            <TableCell align="left">メモ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={String(row.id)}>
              <TableCell>
                {row.isEditMode ? (
                  <>
                    <IconButton
                      aria-label="done"
                      onClick={() => onUpdate(String(row.id))}
                    >
                      <DoneIcon />
                    </IconButton>
                    <IconButton
                      aria-label="revert"
                      onClick={() => onDelete(String(row.id))}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      aria-label="revert"
                      onClick={() => onToggleEditMode(String(row.id))}
                    >
                      <RevertIcon />
                    </IconButton>
                  </>
                ) : (
                  <IconButton
                    aria-label="delete"
                    onClick={() => onToggleEditMode(String(row.id))}
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </TableCell>
              <CustomTableCell {...{ row, name: "asset_amount", onChange }} />
              <CustomTableCell {...{ row, name: "diff", onChange }} />
              <CustomTableCell {...{ row, name: "diff_rate", onChange }} />
              <CustomTableCell {...{ row, name: "created_at", onChange }} />
              <CustomTableCell {...{ row, name: "memo", onChange }} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default CustomTable;

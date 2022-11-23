import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { IApp } from '../../types/assets';
import axios from "axios";

interface RegisterAssetDialogProps {
  open: boolean;
  setOpen: Function;
  apps: Array<IApp>;
  handleUpdate: Function;
}

export default function RegisterAssetDialog({open, setOpen, apps, handleUpdate}: RegisterAssetDialogProps) {
  // 資産額
  const [asset, setAsset] = useState('');
  // メモ
  const [memo, setMemo] = useState('');
  // アプリ
  const [appId, setAppId] = useState('');
  // 各項目エラー用
  const [assetError, setAssetError] = useState(false);
  const [assetErrorMsg, setAssetErrorMsg] = useState('');
  const [appIdError, setAppIdError] = useState(false);
  const [appIdErrorMsg, setAppIdErrorMsg] = useState('');
  
  // 資産額入力のたびに呼び出され、値を変数に格納
  const  handleChangeAsset = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAsset(event.target.value);
    setAssetError(false);
    setAssetErrorMsg('');
  };

  // メモ入力のたびに呼び出され、値を変数に格納
  const  handleChangeMemo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMemo(event.target.value);
  };

  // アプリ選択のたびに呼び出され、値を変数に格納
  const handleChangeAppId = (event: SelectChangeEvent) => {
    setAppId(event.target.value);
    setAppIdError(false);
    setAppIdErrorMsg('');
  };

  // Registerボタン押下時に呼び出され、データ登録APIを呼び出す
  const handleRegister = () => {
    if (asset === ''){
      setAssetError(true);
      setAssetErrorMsg('入力してください');
      return -1;
    }
    if (appId === ''){
      setAppIdError(true);
      setAppIdErrorMsg('選択してください');
      return -1;
    }
    const data = {'asset': asset, 'memo': memo, 'app': appId};
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/asset-management/v1/assetlist/`, data)
      .then((response) => {
        handleUpdate();
        handleClose();
      });
  };

  // ダイアログを閉じる
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>新規データ登録</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="name"
            label="資産額"
            fullWidth
            variant="standard"
            onChange={handleChangeAsset}
            error={assetError}
            helperText={assetErrorMsg}
            required
          />
          <TextField
            margin="dense"
            id="name"
            label="メモ"
            fullWidth
            variant="standard"
            onChange={handleChangeMemo}
          />
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth required error={appIdError}>
              <InputLabel id="demo-simple-select-label">アプリ</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={appId}
                label="Managed App"
                onChange={handleChangeAppId}
              >
                {apps.map((app) => {
                  return <MenuItem value={app.id}>{app.name}</MenuItem>
                })}
              </Select>
              <FormHelperText>{appIdErrorMsg}</FormHelperText>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRegister}>Register</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { IconButton, TextField } from "@mui/material";
import { AddBox } from "@mui/icons-material";

export type AddItemFormSubmitHelperType = {
  setError: (error: string) => void;
  setTitle: (title: string) => void;
};

type AddItemFormPropsType = {
  addItem: (title: string, helpers: { setError: (error: string) => void; setTitle: (title: string) => void }) => void;
  disabled?: boolean;
};

export const AddItemForm = React.memo(function ({ addItem, disabled = false }: AddItemFormPropsType) {
  let [title, setTitle] = useState("");
  let [error, setError] = useState<string | null>(null);

  const addItemHandler = () => {
    if (title.trim() !== "") {
      addItem(title, { setError, setTitle });
    } else {
      setError("Title is required");
    }
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error !== null) {
      setError(null);
    }
    if (e.charCode === 13) {
      addItemHandler();
    }
  };

  return (
    <div>
      <TextField
        id="filled-basic"
        variant="filled"
        disabled={disabled}
        error={!!error}
        value={title}
        onChange={onChangeHandler}
        onKeyPress={onKeyPressHandler}
        label="Title"
        helperText={error}
        sx={{ width: "29ch" }}
      />
      <IconButton color="primary" onClick={addItemHandler} disabled={disabled} style={{ marginLeft: "2px" }}>
        <AddBox />
      </IconButton>
    </div>
  );
});

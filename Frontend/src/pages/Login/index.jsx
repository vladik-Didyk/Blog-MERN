import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Typography, TextField, Paper, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";

import styles from "./Login.module.scss";

const initialState = {
  defaultValues: {
    email: "edasw3jer@dsaf.com",
    password: "13456",
  },
  mode: "onChange",
};

export const Login = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm(initialState);

  const onSubmit = (values) => {
    dispatch(fetchAuth(values));
  };

  console.log(isAuth);

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          type={"email"}
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          // helperText="Неверно указана почта"
          {...register("email", {
            required: 'Поле "E-Mail" обязательно для заполнения',
          })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Пароль"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register("password", {
            required: 'Поле "Пароль" обязательно для заполнения',
          })}
          fullWidth
        />
        <Button type="submit" size="large" variant="contained" fullWidth>
          Войти
        </Button>
      </form>
    </Paper>
  );
};


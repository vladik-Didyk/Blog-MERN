import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegister, selectIsAuth } from "../../redux/slices/auth";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { Avatar, Button, Paper, TextField, Typography } from "@mui/material/";
import styles from "./Login.module.scss";

const initialState = {
  defaultValues: {
    fullName: "Va Pu",
    email: "er@dsaf.com",
    password: "13456_123456",
  },
  mode: "onChange",
};

export const Registration = () => {
  // Check if user is authenticated using Redux useSelector
  const isAuth = useSelector(selectIsAuth);

  // Initialize Redux useDispatch for dispatching actions
  const dispatch = useDispatch();

  // Configure useForm with initial state, error handling, and form state
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm(initialState);

  // Define onSubmit function to handle form submission
  const onSubmit = async (values) => {
    // Dispatch fetchAuth action with submitted form values
    const data = await dispatch(fetchRegister(values));

    // Check if data payload is received
    if (!(data ?? {}).payload) {
      return alert("Ошибка при регистрации");
    }

    // Check if the payload contains a token
    if ("token" in (data ?? {}).payload) {
      // Save token to localStorage
      window.localStorage.setItem("token", data.payload.token);
    } else {
      // Show an error message if the payload doesn't contain a token
      return alert("Ошибка при регистрации");
    }
  };

  // Redirect to the home page if the user is authenticated
  if (isAuth) {
    return <Navigate to="/" />;
  }
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register("fullName", {
            required: 'Поле "Полное имя" обязательно для заполнения',
          })}
          className={styles.field}
          label="Полное имя"
          fullWidth
        />
        <TextField
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register("email", {
            required: 'Поле "E-Mail" обязательно для заполнения',
          })}
          className={styles.field}
          label="E-Mail"
          fullWidth
        />
        <TextField
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register("password", {
            required: 'Поле "Пароль" обязательно для заполнения',
          })}
          className={styles.field}
          label="Пароль"
          fullWidth
        />
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};


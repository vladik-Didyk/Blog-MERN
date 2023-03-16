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
  // Check if user is authenticated using Redux useSelector
  const isAuth = useSelector(selectIsAuth);

  // Initialize Redux useDispatch for dispatching actions
  const dispatch = useDispatch();

  // Configure useForm with initial state, error handling, and form state
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(initialState);

  // Define onSubmit function to handle form submission
  const onSubmit = async (values) => {
    // Dispatch fetchAuth action with submitted form values
    const data = await dispatch(fetchAuth(values));

    // Check if data payload is received
    if (!data?.payload) {
      return alert("Ошибка при авторизации");
    }

    // Check if the payload contains a token
    if ("token" in data?.payload) {
      // Save token to localStorage
      window.localStorage.setItem("token", data.payload.token);
    } else {
      // Show an error message if the payload doesn't contain a token
      return alert("Ошибка при авторизации");
    }
  };

  // Redirect to the home page if the user is authenticated
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


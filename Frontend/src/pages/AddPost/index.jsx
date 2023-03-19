import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import axios from "../../api/axios";
import { uploadValidation } from "../../utilities/uploadValidation";
import { Button, Paper, TextField } from "@mui/material";

import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { Navigate, useNavigate, useParams } from "react-router-dom";

export const AddPost = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const inputFileRef = useRef(null);
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleChangeFile = async (event) => {
    try {
      const file = event.target.files[0];

      if (!file) {
        console.warn("No file selected");
        return;
      }

      const formData = new FormData();
      formData.append("image", file, file.name); // Add the filename property here

      const { data } = await axios.post("/uploads", formData);

      console.log(data);
      setImageUrl(data.url);
    } catch (error) {
      console.warn(error);
      alert("Ошибка при загрузке файла");
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  const onChange = useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    setLoading(true);

    const validationErrors = uploadValidation(title, text, tags, imageUrl);
    if (validationErrors.length > 0) {
      // Display the validation errors to the user, for example using an alert.
      alert(validationErrors.join("\n"));
      return;
    }

    // Split the tags string by comma and trim whitespace
    const tagsArray = tags.split(",").map((tag) => tag.trim());

    const fileds = {
      title,
      text,
      tags: tagsArray,
      imageUrl,
    };

    try {
      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fileds)
        : await axios.post("/posts", fileds);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert("Ошибка при добавлении статьи");
    }
  };

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  useEffect(() => {
    try {
      if (id) {
        axios.get(`/posts/${id}`).then(({ data }) => {
          setTitle(data.title);
          setText(data.text);
          setTags(data.tags.join(", "));
          setImageUrl(data.imageUrl);
        });
      }
    } catch (error) {
      alert("Ошибка при редактировании статьи");
    }
  }, []);

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/login" />;
  }
  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
        size="large"
      >
        Загрузить превью
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Удалить
          </Button>

          <img
            className={styles.image}
            src={`http://localhost:4444${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Сохранять" : "Опубликовать"}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};


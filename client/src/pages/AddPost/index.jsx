import React from "react";
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
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleChangeFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file, file.name);
    try {
      const { data } = await axios.post("/uploads", formData);
      setImageUrl(data.url);
    } catch (error) {
      alert("Ошибка при загрузке файла");
    }
  };

  const onClickRemoveImage = () => setImageUrl("");
  const onChange = useCallback((value) => setText(value), []);
  const onSubmit = async () => {
    const validationErrors = uploadValidation(title, text, tags, imageUrl);
    if (validationErrors.length > 0) {
      alert(validationErrors.join("\n"));
      return;
    }
    const tagsArray = tags.split(",").map((tag) => tag.trim());
    const fields = { title, text, tags: tagsArray, imageUrl };
    try {
      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post("/posts", fields);
      navigate(`/posts/${isEditing ? id : data._id}`);
    } catch (error) {
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
      autosave: { enabled: true, delay: 1000 },
    }),
    []
  );

  useEffect(() => {
    if (!id) return;
    axios.get(`/posts/${id}`).then(({ data }) => {
      setTitle(data.title);
      setText(data.text);
      setTags(data.tags.join(", "));
      setImageUrl(data.imageUrl);
    });
  }, [id]);

  if (!isAuth) return <Navigate to="/login" />;

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


/* eslint-env node */
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, fetchTags } from "../redux/slices/posts";
import { Grid, Tabs, Tab } from "@mui/material/";
import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);
  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, [dispatch]);

  const renderPost = (element, index) => {
    const isLoading = isPostsLoading;
    const postProps = isLoading
      ? { isLoading }
      : {
          id: element._id,
          title: element.title,
          imageUrl: element.imageUrl
            ? `${process.env.REACT_APP_BACKEND_PORT}${element.imageUrl}`
            : "",
          user: element.user,
          createdAt: element.createdAt,
          viewsCount: element.viewCount,
          commentsCount: 3,
          isLoading,
          tags: element.tags,
          isEditable: userData?._id === element.user._id,
        };

    return <Post key={index} {...postProps} />;
  };

  return (
    <>
      <Tabs value={0} aria-label="basic tabs example" style={{ marginBottom: 15 }}>
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid item xs={8}>
          {(isPostsLoading ? [...Array(5)] : posts.items).map(renderPost)}
        </Grid>
        <Grid item xs={4}>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: "Вася Пупкин",
                  avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                },
                text: "Это тестовый комментарий",
              },
              {
                user: {
                  fullName: "Иван Иванов",
                  avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
                },
                text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};

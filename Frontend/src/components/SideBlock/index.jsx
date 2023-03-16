import { Paper, Typography } from "@mui/material";
import styles from "./SideBlock.module.scss";

export const SideBlock = ({ title, children }) => {
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography variant="h6" classes={{ root: styles.title }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
};


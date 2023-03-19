import React from "react";
import PropTypes from "prop-types"; 

import {
  Skeleton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";

import { SideBlock } from "./SideBlock";

export const TagsBlock = ({ items, isLoading = true }) => {
  return (
    <SideBlock title="Тэги">
      <List>
        {(isLoading ? [...Array(5)] : items).map((name, i) => (
          <a
            key={i}
            style={{ textDecoration: "none", color: "black" }}
            href={`/tags/${name}`}
          >
            <ListItem key={i} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <TagIcon />
                </ListItemIcon>
                {isLoading ? (
                  <Skeleton width={100} />
                ) : (
                  <ListItemText primary={name} />
                )}
              </ListItemButton>
            </ListItem>
          </a>
        ))}
      </List>
    </SideBlock>
  );
};

// Add propTypes to the TagsBlock component
TagsBlock.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string),
  isLoading: PropTypes.bool,
};

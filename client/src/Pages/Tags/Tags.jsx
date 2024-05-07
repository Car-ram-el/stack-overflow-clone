import React from "react";

import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import TagsList from "./TagsList";
import "./Tags.css";
import { tagsList } from "./tagList";

const Tags = ({ slideIn }) => {
  return (
    <div className="home-container-1">
      <LeftSidebar slideIn={slideIn} />
      <div className="home-container-2">
        <h1 className="tags-h1">Tags</h1>
        <div className="tags-list-container">
          {tagsList.map((tag, index) => (<TagsList tag={tag} key={index} />))}
        </div>
      </div>
    </div>
  );
};

export default Tags;

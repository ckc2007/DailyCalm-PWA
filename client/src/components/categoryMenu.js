import React from "react";
import { categories } from "./data"; // Import the categories
import './categoryMenu.css';

const CategoryMenu = ({ activeCategory, handleCategoryClick }) => {
  return (
    <>
      <div className="container">
        <div className="columns">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`column categoryCard ${
                activeCategory === category.id ? "active" : ""
              }`}
            >
              <div className="card">
                <div className="card-content">
                  <p className="title">{category.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoryMenu;

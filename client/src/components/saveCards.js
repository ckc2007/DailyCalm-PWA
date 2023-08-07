import React, { useState } from "react";
import CategoryMenu from "./CategoryMenu";
import RelatedCards from "./RelatedCards";
import { categories } from "./data"; // Import the data

const SaveCards = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <>
      <div className="container">
        <div className="columns">
          <div className="column">
            <CategoryMenu
              activeCategory={selectedCategoryId}
              handleCategoryClick={handleCategoryClick}
            />
          </div>
          <div className="column">
            {selectedCategoryId && (
              <RelatedCards
                category={categories.find(
                  (category) => category.id === selectedCategoryId
                )}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SaveCards;


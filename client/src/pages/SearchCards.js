import React, { useState, useEffect } from "react";

import { authService } from "../utils/auth";
import { saveCard } from "../utils/API";
import { saveCardIds, getSavedCardIds } from "../utils/localStorage";

import { categories } from "../components/data"; // Import the categories array from data.js
import CategoryMenu from "../components/categoryMenu"; // Import the CategoryMenu component from categoryMenu.js

import "./SearchCards.css";

// import { GET_ME } from "../utils/queries"; // Import the GET_ME query if you haven't already
// import { useQuery } from "@apollo/client"; // Import useQuery hook

// hard coded dummy data - will be replaced by our custom card data
// TODO: bring in our card data here once we create it

const dummyCards = [
  {
    cardId: "dummy_card_1",
    title: "Dummy Card 1",
    description: "This is the first dummy card.",
    image: "https://dummyimage.com/200x300",
  },
  {
    cardId: "dummy_card_2",
    title: "Dummy Card 2",
    description: "This is the second dummy card.",
    image: "https://dummyimage.com/200x300",
  },
  {
    cardId: "dummy_card_3",
    title: "Dummy Card 3",
    description: "This is the third dummy card.",
    image: "https://dummyimage.com/200x300",
  },
  {
    cardId: "dummy_card_4",
    title: "Dummy Card 4",
    description: "This is the fourth dummy card.",
    image: "https://dummyimage.com/200x300",
  },
  {
    cardId: "dummy_card_5",
    title: "Dummy Card 5",
    description: "This is the fifth dummy card.",
    image: "https://dummyimage.com/200x300",
  },
  {
    cardId: "dummy_card_6",
    title: "Dummy Card 6",
    description: "This is the sixth dummy card.",
    image: "https://dummyimage.com/200x300",
  },
];

const SearchCards = () => {
  // TODO: remove the search bar feature
  const [searchedCards, setSearchedCards] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [savedCardIds, setSavedCardIds] = useState(getSavedCardIds());

  // for saved message
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  // create state for the active category
  const [activeCategory, setActiveCategory] = useState(null);

  // Create a useEffect hook to set the searchedCards based on the selected category's cards
  useEffect(() => {
    if (categories && categories.length > 0) {
      setSearchedCards(categories[0].cards || []);
      setActiveCategory(categories[0]);
    } else {
      setSearchedCards(dummyCards);
    }
  }, [categories]);

  useEffect(() => {
    return () => saveCardIds(savedCardIds);
  }, [savedCardIds]);

  // create method to search for cards and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    // new code

    try {
      // no need for an API fetch here anymore
      console.log("Form submitted with search input:", searchInput);

      setSearchedCards(dummyCards);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a card to our database
  const handleSaveCard = async (cardId) => {
    // debug searchedCards
    console.log("Searched Cards:", searchedCards);
    // find the card in `searchedCards` state by the matching id
    const cardToSave = searchedCards.find((card) => card.cardId === cardId);

    // console.log("cardToSave:", cardToSave);

    // get token
    const token = authService.loggedIn() ? authService.getToken() : null;

    if (!token) {
      return false;
    }

    const cardData = {
      title: cardToSave.title,
      description: cardToSave.description,
      image: cardToSave.image,
    };
    // debug
    // console.log("cardData:", cardData);

    // debug
    try {
      const savedCard = await saveCard(cardToSave, token);
      // Handle the response from saveCard if needed
      console.log("Calm saved:", savedCard);

      // Show the saved message only when saving for the first time
      if (!savedCardIds.includes(cardId)) {
        setShowSavedMessage(true);
        setTimeout(() => {
          setShowSavedMessage(false);
        }, 2000); // Hide the message after 2 seconds (adjust the time as needed)
      }
      // Update the savedCardIds state
      setSavedCardIds([...savedCardIds, cardToSave.cardId]);
    } catch (err) {
      console.error(err);
      // Handle the error message if needed
      console.log("Error saving the Calm:", err.message);
    }
  };

  return (
    <>
      <section className="hero is-bold is-small">
        <div className="hero-body">
          <div className="container">
            <h1 className="title has-text-white">Search for Calms!</h1>
            <form onSubmit={handleFormSubmit}>
              <div className="columns">
                <div className="column is-8">
                  <input
                    name="searchInput"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    type="text"
                    className="input is-large"
                    placeholder="Search for a Calm"
                  />
                </div>
                <div className="column is-4">
                  <button
                    type="submit"
                    className="button is-success is-large is-fullwidth is-rounded"
                  >
                    Submit Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      <div className="container">
        

        {/* CategoryMenu component to display categories */}
        <CategoryMenu
          categories={categories}
          activeCategory={activeCategory} // Pass the categoryId as activeCategory
          handleCategoryClick={(categoryId) => {
            // Update the activeCategory state with the categoryId
            setActiveCategory(categoryId);
            // Filter the selected category's cards and set searchedCards accordingly
            const selectedCategory = categories.find(
              (category) => category.id === categoryId
            );
            if (selectedCategory) {
              setSearchedCards(selectedCategory.cards);
            } else {
              setSearchedCards(dummyCards);
            }
          }}
        />
        <h2 className="subtitle is-4 mt-5 has-text-white has-text-weight-bold">
          {searchedCards.length
            ? `Viewing ${searchedCards.length} results:`
            : "Search for a Calm to begin"}
        </h2>
        <div className="columns is-multiline">
          {searchedCards.length > 0
            ? searchedCards.map((card) => {
                return (
                  <div key={card.cardId} className="column is-4">
                    <div className="card custom-card">
                      {card.image ? (
                        <div className="card-image">
                          <figure className="image equal-image">
                            <img
                              src={card.image}
                              alt={`The cover for ${card.title}`}
                            />
                          </figure>
                        </div>
                      ) : null}
                      <div className="card-content">
                        <p className="title is-5">{card.title}</p>
                        <p className="subtitle is-6">Date: {card.date}</p>
                        <p>{card.description}</p>
                        {authService.loggedIn() && (
                          <button
                            className={`button is-block ${
                              savedCardIds?.some(
                                (savedCardId) => savedCardId === card.cardId
                              )
                                ? "is-info"
                                : "is-primary"
                            }`}
                            onClick={() => handleSaveCard(card.cardId)}
                          >
                            {savedCardIds?.some(
                              (savedCardId) => savedCardId === card.cardId
                            )
                              ? "Calm saved!"
                              : "Save this Calm!"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            : // Display the dummy cards when no searched cards are available
              dummyCards.map((card) => {
                return (
                  <div key={card.cardId} className="column is-4">
                    <div className="card">
                      {card.image ? (
                        <div className="card-image">
                          <figure className="image">
                            <img
                              src={card.image}
                              alt={`The cover for ${card.title}`}
                            />
                          </figure>
                        </div>
                      ) : null}
                      <div className="card-content">
                        <p className="title is-5">{card.title}</p>
                        <p>{card.description}</p>
                        <button
                          className={`button is-block ${
                            savedCardIds?.some(
                              (savedCardId) => savedCardId === card.cardId
                            )
                              ? "is-info"
                              : "is-primary"
                          }`}
                          onClick={() => handleSaveCard(card.cardId)}
                        >
                          {savedCardIds?.some(
                            (savedCardId) => savedCardId === card.cardId
                          )
                            ? "Calm saved!"
                            : "Save this Calm!"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
      {showSavedMessage && <div>Saved!</div>}
    </>
  );
};

export default SearchCards;

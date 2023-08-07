import React, { useState, useEffect } from "react";

import { getMe, deleteCard } from "../utils/API";
import { authService } from "../utils/auth";
import { removeCardId } from "../utils/localStorage";
import './SavedCards.css'

const SavedCards = () => {
  const [userData, setUserData] = useState({});

  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = authService.loggedIn() ? authService.getToken() : null;

        if (!token) {
          return false;
        }

        const user = await getMe(token);

        if (!user) {
          throw new Error("something went wrong!");
        }

        // debugged response here not an HTTP response object, added user instead from getMe
        setUserData(user);
      } catch (err) {
        console.error(err);
      }
    };

    getUserData();
  }, [userDataLength]);

  // create function that accepts the card's mongo _id value as param and deletes the card from the database
  const handleDeleteCard = async (cardId) => {
    const token = authService.loggedIn() ? authService.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await deleteCard(cardId, token);

      // If the deleteCard function does not throw an error,
      // it means the card was deleted successfully.
      // So, update the user data and remove the card's id from localStorage.
      const updatedUser = { ...userData };
      updatedUser.savedCards = updatedUser.savedCards.filter(
        (card) => card.cardId !== cardId
      );
      setUserData(updatedUser);
      removeCardId(cardId);
    } catch (err) {
      console.error(err);
      console.log("Error deleting the card:", err.message);
    }
  };

  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
    <div className="custom-background2">
      <section className="hero is-bold is-small">
        <div className="hero-body">
          <div className="container">
            <h1 className="title has-text-black">Viewing saved Calms!</h1>
          </div>
        </div>
      </section>
      <div className="container">
        <h2 className="subtitle is-4 mt-5 has-text-black">
          {userData.savedCards.length
            ? `Viewing ${userData.savedCards.length} saved ${
                userData.savedCards.length === 1 ? "card" : "cards"
              }:`
            : "You have no saved cards!"}
        </h2>
        <div className="columns is-multiline">
          {userData.savedCards.map((card) => {
            return (
              <div key={card.cardId} className="column is-4">
                <div className="custom-card">
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
                    <p className="subtitle is-6">Date: {card.date}</p>
                    <p>{card.description}</p>
                  </div>
                  <footer className="card-footer">
                    <button
                      className="button is-success is-fullwidth"
                      onClick={() => handleDeleteCard(card.cardId)}
                    >
                      Delete this Calm!
                    </button>
                  </footer>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </>
  );
};

export default SavedCards;

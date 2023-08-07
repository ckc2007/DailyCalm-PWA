import client from "./ApolloClient";
import { GET_ME } from "../graphql/queries";
import {
  LOGIN_USER,
  ADD_USER,
  SAVE_CARD,
  REMOVE_CARD,
  ADD_SCORE,
  UPDATE_GOAL,
} from "../graphql/mutations";

export const getMe = async (token) => {
  try {
    const response = await client.query({
      query: GET_ME,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!response || !response.data || !response.data.me) {
      throw new Error("Invalid response or missing data.");
    }

    return response.data.me;
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching user data.");
  }
};

export const createUser = (userData) => {
  return client.mutate({
    mutation: ADD_USER,
    variables: userData,
  });
};

export const loginUser = (userData) => {
  return client.mutate({
    mutation: LOGIN_USER,
    variables: userData,
  });
};

export const saveCard = async (cardData, token) => {
  try {
    const response = await client.mutate({
      mutation: SAVE_CARD,
      variables: { cardData },
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!response || !response.data || !response.data.saveCard) {
      throw new Error("Invalid response or missing data.");
    }

    return response.data.saveCard;
  } catch (err) {
    console.error(err);
    throw new Error("Error saving the card.");
  }
};

export const deleteCard = (cardId, token) => {
  return client.mutate({
    mutation: REMOVE_CARD,
    variables: { cardId },
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

export const fetchSavedCards = async (token) => {
  try {
    const response = await client.query({
      query: GET_ME,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!response || !response.data || !response.data.me) {
      throw new Error("Invalid response or missing data.");
    }

    // me.savedCards contains the array of user's saved cards
    return response.data.me.savedCards;
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching saved cards.");
  }
};

export const addScore = async (score, token) => {
  try {
    const response = await client.mutate({
      mutation: ADD_SCORE,
      variables: { score },
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!response || !response.data || !response.data.addScore) {
      throw new Error("Invalid response or missing data.");
    }

    return response.data.addScore;
  } catch (err) {
    console.error(err);
    throw new Error("Error adding score.");
  }
};

export const updateGoal = async (goal, token) => {
  try {
    const response = await client.mutate({
      mutation: UPDATE_GOAL,
      variables: { goal },
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!response || !response.data || !response.data.updateGoal) {
      throw new Error("Invalid response or missing data.");
    }

    return response.data.updateGoal;
  } catch (err) {
    console.error(err);
    throw new Error("Error updating goal.");
  }
};

export default client;

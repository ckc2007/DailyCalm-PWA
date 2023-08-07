import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation AddUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      _id
      email
      token
      username
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      email
      _id
      token
      username
    }
  }
`;

export const SAVE_CARD = gql`
  mutation SaveCard($cardData: CardInput!) {
    saveCard(cardData: $cardData) {
      _id
      username
      email
      cardCount
      savedCards {
        _id
        date
        description
        cardId
        image
        link
        title
      }
      score
      goal
    }
  }
`;

export const REMOVE_CARD = gql`
  mutation RemoveCard($cardId: ID!) {
    removeCard(cardId: $cardId) {
      _id
      username
      email
      savedCards {
        _id
        date
        description
        cardId
        image
        link
        title
      }
    }
  }
`;

export const ADD_SCORE = gql`
  mutation AddScore($score: Int!) {
    addScore(score: $score) {
      _id
      score
    }
  }
`;

export const UPDATE_GOAL = gql`
  mutation UpdateGoal($goal: Int!) {
    updateGoal(goal: $goal) {
      _id
      goal
    }
  }
`;

export const CLEAR_SCORE = gql`
  mutation ClearScore {
    clearScore {
      _id
      score
    }
  }
`;

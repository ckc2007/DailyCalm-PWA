import { gql } from "@apollo/client";

export const GET_ME = gql`
  query {
    me {
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
      score
      goal
    }
  }
`;

// chorney working here

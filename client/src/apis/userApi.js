import { gql } from "@apollo/client";

// input User {
//   name: String!
//   email: String
// }

export const REGISTER = gql`
  mutation Register($user: newUser!) {
    register(user: $user) {
      message
    }
  }
`;
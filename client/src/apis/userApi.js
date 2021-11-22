import { gql } from "@apollo/client";

export const REGISTER = gql`
  mutation Register($user: newUser!) {
    register(user: $user) {
      message
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
    }
  }
`

// export const USER_INFO = gql`
//   query GetInfo()
// `
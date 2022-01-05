import { gql } from "@apollo/client";

export const GET_QUESTION_SETS_USER_CREATED = gql`
  query GetQuestionSetsUserCreated($page: Int, $limit: Int, $sort: Int, $typeSort: typeSortQuestionSet) {
    getQuestionSetsByUserId(page: $page, limit: $limit, sort: $sort, typeSort: $typeSort) {
      questionSets {
        id
        userId
        name
        cover
        tag
        isPublic
        played
        likes
        liked
        nameUser
        questionLength
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_QUESTION_SETS_USER_LIKED = gql`
  query GetQuestionSetsUserLiked($page: Int, $limit: Int, $sort: Int, $typeSort: typeSortQuestionSet) {
    GetQuestionSetsUserLiked(page: $page, limit: $limit, sort: $sort, typeSort: $typeSort) {
      questionSets {
        id
        userId
        name
        cover
        tag
        isPublic
        played
        likes
        liked
        nameUser
        questionLength
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_QUESTIONS_BY_QUESTION_SET_ID = gql`
  query GetQuestionsByQuestionSetId($questionSetId: String!, $page: Int, $limit: Int) {
    getQuestionByQuestionSetId(questionSetId: $questionSetId, page: $page, limit: $limit) {
      questions {
        id
        questionSetId
        content
        image
        video
        audio
        type
        answers {
          id
          content
          image
          isCorrect
          votes
        }
        played
        time
        score
        typeAnswers
        explanation
        doubleScore
      }
    }
  }
`;

export const SEARCH_QUESTION_SET = gql`
  query SearchQuestionSets($textSearch: String!, $page: Int, $limit: Int, $sort: Int, $typeSort: typeSortQuestionSetSearch, tag: String, userId: String) {
    SearchQuestionSets(textSearch: $textSearch, page: $page, limit: $limit, sort: $sort, typeSort: $typeSort, tag: $tag, userId: $userId) {
      textSearch
      questionSets {
        id
        userId
        name
        cover
        tag
        isPublic
        played
        likes
        liked
        nameUser
        questionLength
        createdAt
        updatedAt
      }
    }
  }
`;

export const LIKE_QUESTION_SET = gql`
  mutation likeQuestionSet($questionSetId: String!) {
    likeQuestionSet(questionSetId: $questionSetId) {
      message
    }
  }
`;
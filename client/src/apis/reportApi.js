import { gql } from "@apollo/client";

export const GET_ALL_REPORTS = gql`
  query GetAllReports($page: Int, $limit: Int, $sort: Int, $typeSort: typeSortReport) {
    GetAllReports(page: $page, limit: $limit, sort: $sort, typeSort: $typeSort) {
      reports {
        _id
        name
        gameMode
        createdAt
        players {
          _id
        }
      }
    }
  }
`;

export const GET_REPORT_DETAIL = gql`
  query GetReportDetail($reportId: String!) {
    GetDetailReport(reportId: $reportId) {
      players {
        _id
        name
        rank
        correctPercentAnswers
        unAnswered
        finalScore
        detailAllQuestions {
          _id
          content
          answered
          type
          correct
          time
          score
        }
      }
      questions {
        _id
        dataQuestion {
          image
          content
          time
          answers {
            content
            countPlayerAnswer
            isCorrect
          }
          countPlayerNoAnswer
        }
        percentRight
        avgAnswersTime
        detailAllPlayers {
          _id,
          answered,
          name,
          correct,
          time
          score
        }
      }
    }
  }
`
export const DOWNLOAD_REPORT = gql`
  query DownloadReport($reportId: String!) {
    DownloadReport(reportId: $reportId)
  }
`;

export const DELETE_REPORT = gql`
  mutation DeleteReport($reportId: String!) {
    DeleteReport(reportId: $reportId) {
      message
    }
  }
`;
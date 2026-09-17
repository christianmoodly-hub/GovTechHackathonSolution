import { QuestionnaireScreen } from "../../components/QuestionnaireScreen";
import { jobFit } from "../../questionnaires/jobFit";

export default function JobFitRoute() {
  return <QuestionnaireScreen definition={jobFit} resultKey="jobFit" />;
}

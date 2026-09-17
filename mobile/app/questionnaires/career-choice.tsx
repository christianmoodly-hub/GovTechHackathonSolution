import { QuestionnaireScreen } from "../../components/QuestionnaireScreen";
import { careerChoice } from "../../questionnaires/careerChoice";

export default function CareerChoiceRoute() {
  return (
    <QuestionnaireScreen definition={careerChoice} resultKey="careerChoice" />
  );
}

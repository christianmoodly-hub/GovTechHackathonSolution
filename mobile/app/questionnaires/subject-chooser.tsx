import { QuestionnaireScreen } from "../../components/QuestionnaireScreen";
import { subjectChooser } from "../../questionnaires/subjectChooser";

export default function SubjectChooserRoute() {
  return (
    <QuestionnaireScreen
      definition={subjectChooser}
      resultKey="subjectChooser"
    />
  );
}

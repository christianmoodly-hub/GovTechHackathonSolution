import { QuestionnaireScreen } from "../../../components/QuestionnaireScreen";
import { useLocale } from "../../../contexts/LocaleContext";
import { resolveCareerChoice } from "../../../questionnaires/resolveCareerChoice";

export default function CareerChoiceRoute() {
  const { locale } = useLocale();
  const definition = resolveCareerChoice(locale);

  return (
    <QuestionnaireScreen definition={definition} resultKey="careerChoice" />
  );
}

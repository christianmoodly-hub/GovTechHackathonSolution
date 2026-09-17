import { Redirect, useLocalSearchParams } from "expo-router";
import { href } from "../../utils/href";

export default function QualificationRedirect() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={href(`/directory/qualifications/${id}`)} />;
}

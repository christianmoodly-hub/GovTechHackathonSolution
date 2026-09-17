import { Redirect, useLocalSearchParams } from "expo-router";
import { href } from "../../utils/href";

export default function OccupationRedirect() {
  const { code } = useLocalSearchParams<{ code: string }>();
  return <Redirect href={href(`/directory/occupations/${code}`)} />;
}

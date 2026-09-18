import { Redirect, useLocalSearchParams } from "expo-router";
import { href } from "../../utils/href";

export default function BursaryRedirect() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={href(`/directory/bursaries/${id}`)} />;
}

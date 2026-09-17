import { Redirect, useLocalSearchParams } from "expo-router";
import { href } from "../../utils/href";

export default function ProviderRedirect() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={href(`/directory/providers/${id}`)} />;
}

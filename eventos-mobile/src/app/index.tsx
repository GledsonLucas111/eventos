import { Redirect } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { Loading } from "@/components/feedback";
export default function Index() {
  const { token, loading } = useAuth();
  if (loading) return <Loading />;
  return <Redirect href={token ? "/events" : "/login"} />;
}

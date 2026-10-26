import { useContext } from "react";
import { RegistrationContext } from "@/context/registration-context";

export function useRegistrations() {
  const context = useContext(RegistrationContext);

  if (!context)
    throw new Error(
      "useRegistrations deve ser usado dentro de RegistrationProvider.",
    );
    
  return context;
}

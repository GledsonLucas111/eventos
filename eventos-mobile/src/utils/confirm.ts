import { Alert } from "react-native";
export function confirmAction(
  title: string,
  message: string,
): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: "Voltar", style: "cancel", onPress: () => resolve(false) },
        {
          text: "Sim, cancelar",
          style: "destructive",
          onPress: () => resolve(true),
        },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}

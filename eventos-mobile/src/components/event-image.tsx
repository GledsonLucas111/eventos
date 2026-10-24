import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "@/styles/theme";
export function EventImage({
  uri,
  large = false,
}: {
  uri: string;
  large?: boolean;
}) {
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const style = [styles.image, large && { height: 230 }];
  if (failedUri === uri || !uri)
    return (
      <View style={[...style, styles.placeholder]}>
        <Text style={{ color: colors.muted }}>Imagem indisponível</Text>
      </View>
    );
  return (
    <Image
      accessibilityLabel="Imagem do evento"
      source={{ uri }}
      style={style}
      resizeMode="cover"
      onError={() => setFailedUri(uri)}
    />
  );
}
const styles = StyleSheet.create({
  image: { width: "100%", height: 155, backgroundColor: "#e2e8f0" },
  placeholder: { alignItems: "center", justifyContent: "center" },
});

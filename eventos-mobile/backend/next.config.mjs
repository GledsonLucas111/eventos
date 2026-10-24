// Configuração para o backend eventos-web, não para o Expo.
const config = {
  async headers() {
    if (process.env.NODE_ENV !== "development") return [];
    const origin = process.env.MOBILE_WEB_ORIGIN || "http://localhost:8081";
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: origin },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, Accept",
          },
        ],
      },
    ];
  },
};
export default config;

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 1. Login → dapat token
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
            }),
          }
        );

        const data = await res.json();
        if (!res.ok || !data?.token) return null;

        let userData: {
          id: string;
          username: string;
          role: string;
          token: string;
        };

        // 2. Kalau API login sudah balikin user
        if (data.user) {
          userData = {
            id: data.user.id,
            username: data.user.username,
            role: data.user.role,
            token: data.token,
          };
        } else {
          // 3. Kalau tidak ada user → fetch profil pakai token
          const profileRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
            {
              headers: { Authorization: `Bearer ${data.token}` },
            }
          );

          if (!profileRes.ok) return null;
          const profile = await profileRes.json();

          userData = {
            id: profile.id,
            username: profile.username,
            role: profile.role, // ⬅️ role dinamis
            token: data.token,
          };
        }

        return userData;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub ?? "";
      session.user.username = token.username ?? "";
      session.user.role = token.role ?? ""; // ⬅️ dinamis ikut API
      session.user.token = token.accessToken ?? "";
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };

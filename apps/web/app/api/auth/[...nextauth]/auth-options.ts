import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Auth } from "@atdb/client-services";
import { config } from "@atdb/client-config";
import { redirect } from "next/navigation";

const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;
        const { email, password } = credentials;

        const loginCredentials = await Auth.login({ email, password });
        if (!loginCredentials) return null;

        return loginCredentials;
      },
    }),
  ],
  secret: config.NEXTAUTH_SECRET,
  callbacks: {
    // @ts-ignore
    async jwt({ token, user }) {
      if (user) return { ...token, ...user };

      // @ts-ignore
      if (new Date().getTime() < token.secrets.expires_in) return token;

      const newSecrets = await Auth.refreshToken({
        // @ts-ignore
        refresh_token: token.secrets.refresh_token,
      });

      if (!newSecrets) redirect("/api/auth/signin");

      token.secrets = {
        // @ts-ignore
        ...token.secrets,
        ...newSecrets,
      };

      return token;
    },

    session({ token, session }) {
      // @ts-ignore
      session.user = token.user;
      // @ts-ignore
      session.secrets = token.secrets;
      return session;
    },
  },
  debug: true,
};

export default authOptions;

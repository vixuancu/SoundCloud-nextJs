import { sendRequest } from "@/utils/api";
import NextAuth, { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { error } from "console";
import dayjs from "dayjs";
// hàm resfresh accesstoken
async function refreshAccessToken(token: JWT) {
  const res = await sendRequest<IBackendRes<JWT>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/refresh`,
    method: "POST",
    body: { refresh_token: token?.refresh_token },
  });

  if (res.data) {
    console.log(">>> check old token: ", token.access_token); // token trước khi refresh
    console.log(">>> check new token: ", res.data?.access_token); // token sau khi refresh

    return {
      ...token,
      access_token: res.data?.access_token ?? "",
      refresh_token: res.data?.refresh_token ?? "",
      access_expire: dayjs(new Date())
        .add(
          +(process.env.TOKEN_EXPIRE_NUMBER as string),
          process.env.TOKEN_EXPIRE_UNIT as any
        )
        .unix(),
      error: "",
    };
  } else {
    //failed to refresh token => do nothing
    return {
      ...token,
      error: "RefreshAccessTokenError", // This is used in the front-end, and if present, we can force a re-login, or similar
    };
  }
}
export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "username&password",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Tên đăng nhập", type: "text" },
        password: { label: "Mật Khẩu", type: "password" },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)

        //
        const res = await sendRequest<IBackendRes<JWT>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
          method: "POST",
          body: {
            username: credentials?.username,
            password: credentials?.password,
          },
        });
        //

        // If no error and we have user data, return it
        if (res && res.data) {
          return res.data as any; // dữ liệu ở đây là user
        } else {
          // Return null if user data could not be retrieved
          // return null;
          throw new Error(res?.message as string); // trả về nội dung lỗi
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!, // thêm dấu ! để không báo lỗi undefined
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser, trigger }) {
      if (trigger === "signIn" && account?.provider !== "credentials") {
        // dùng debug ở server để biết thuộc tính
        //todo
        const res = await sendRequest<IBackendRes<JWT>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/social-media`,
          method: "POST",
          body: {
            type: account?.provider.toLocaleUpperCase(),
            username: user.email,
          },
        });
        if (res.data) {
          token.access_token = res.data?.access_token;
          token.refresh_token = res.data?.refresh_token;
          token.user = res.data?.user;
          token.access_expire = dayjs(new Date())
            .add(
              +(process.env.TOKEN_EXPIRE_NUMBER as string),
              process.env.TOKEN_EXPIRE_UNIT as any
            )
            .unix();
        }
      }
      if (trigger === "signIn" && account?.provider === "credentials") {
        //locall data lưu data vào token
        //@ts-ignore
        token.access_token = user.access_token;
        //@ts-ignore
        token.refresh_token = user.refresh_token;
        //@ts-ignore
        token.user = user.user;
        //@ts-ignore
        token.access_expire = dayjs(new Date())
          .add(
            +(process.env.TOKEN_EXPIRE_NUMBER as string),
            process.env.TOKEN_EXPIRE_UNIT as any
          )
          .unix();
      }

      const isTimeAfter = dayjs(dayjs(new Date())).isAfter(
        dayjs.unix((token?.access_expire as number) ?? 0)
      );

      if (isTimeAfter) {
        return refreshAccessToken(token);
      }
      return token;
    },
    async session({ session, user, token }) {
      if (token) {
        session.access_token = token.access_token;
        session.refresh_token = token.refresh_token;
        session.user = token.user;
        session.access_expire = token.access_expire;
        session.error = token.error;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

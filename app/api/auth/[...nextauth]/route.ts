

import NextAuth, {NextAuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/app/utils/dbConnect";
import Parent from "@/app/models/Parent";



export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        //==nextauth doesnot automatically expose providerAccountId,
        // so we add it manually to the session callback 
        // and then use it in the signIn callback
        async jwt({token,account}){
            if (account) {
                token.sub = account.providerAccountId;
                //instead of storing googleId we decide to store the sub because
                //NextAuth already provides sub as the provider user ID
            }
            return token;
        },

        async session({session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },

        async signIn({ user, account }) {
            await dbConnect();

            if (!user.email) return false;

            const googleId = account?.providerAccountId;

            // Check if user exists in DB, if not create a new Parent
            let parent = await Parent.findOne({ googleId });
            if (!parent) {
                parent = new Parent({
                    googleId,
                    username: user.name || "Parent",
                    email: user.email,
                });
                await parent.save();
            }
            return true;
        },

        //
        async redirect({ baseUrl }) {
            return `${baseUrl}/parent/dashboard`;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
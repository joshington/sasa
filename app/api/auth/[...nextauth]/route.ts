

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/app/utils/dbConnect";
import Parent from "@/app/models/Parent";



const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user}) {
            await dbConnect();

            // Check if user exists in DB, if not create a new Parent
            let parent = await Parent.findOne({ email: user.email });
            if (!parent) {
                parent = new Parent({
                    username: user.name,
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
});

export { handler as GET, handler as POST };
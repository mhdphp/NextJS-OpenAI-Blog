part-2 branch

Setup Auth0 for authentification - Section 2 / 6 lesson
https://www.udemy.com/course/next-js-ai/learn/lecture/36149088#questions
Signup to [auth0](https://auth0.auth0.com/)

.env.local - authO
AUTH0_SECRET= > generate a random 32 bits string:    openssl rand -hex 32
AUTH0_BASE_URL=
AUTH0_ISSUER_BASE_URL=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=


part-3 branch

in index.js
implement:
import { useUser } from "@auth0/nextjs-auth0/client";
const {user} = useUser();
<!-- <div>
      {!!user ? (
        <>
        <div>
          <Image
            src={user.picture}
            alt={user.name}
            height={50}
            width={50}
          />
          <div>
            {user.email}
          </div>
        </div>
        <Link href="/api/auth/logout">Logout</Link>
        </>
      ) : (
        <Link href="/api/auth/login">Login</Link>
      )}
    </div>
  </div> -->

  in next.config.js
  images: {
    domains: ['s.gravatar.com'],
  },
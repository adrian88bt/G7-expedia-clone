# Expedia Clone

A React + Redux travel booking app where you can search stays and flights, filter
them, add them to a cart, and book them. There is also an admin panel for managing
listings and seeing what people have booked.

Built for SE 3290 (Software Project Management) by Group 7. It started as a fork of
[kumkumdutta/Expedia-clone](https://github.com/kumkumdutta/Expedia-clone) and has
since been reworked — the auth moved from phone OTP to email/password, the dead
external APIs were replaced with a local json-server, and the cart and booking flow
were built out.

## Features

**For travellers**

- Browse stays and flights, with sorting and price filtering
- Sign up and sign in with email and password (Firebase Auth)
- Add stays and flights to a cart, remove them, see a running total
- Check out with guest details and get a booking confirmation
- Things to do destination pages

**For admins**

- Dashboard with counts across the whole catalogue
- Add and remove flights and hotels
- See every booking, every cart, and every registered user

Admin pages are gated: signed-out visitors go to the login page, and signed-in
non-admins go home.

## Tech stack

React 18 (Create React App), Redux with thunks, Chakra UI, React Router 6,
Firebase Auth v9, axios, and json-server standing in for a backend.

## How auth works

Two stores, joined on email:

- **Firebase** holds the credentials and does the actual sign-in.
- **db.json** holds the profile — display name, phone, and the `is_admin` flag.

So an account needs to exist in _both_ places. Registering through the app does
both for you. If you add a user by hand in the Firebase console, add a matching
row to `db.json` with the same email or the app will sign you in without a profile.

## Getting started

You will need Node.js 16 or newer and a Firebase project.

**1. Clone and install**

```bash
git clone https://github.com/adrian88bt/G7-expedia-clone.git
cd G7-expedia-clone
npm install
```

**2. Set up Firebase**

In the [Firebase console](https://console.firebase.google.com/), create a project,
then go to **Authentication → Sign-in method** and enable **Email/Password**.

**3. Configure the environment**

```bash
cp .env.example .env.local
```

Fill in the Firebase values from **Project settings → Your apps → SDK setup and
configuration**. `.env.local` is gitignored. Leave `REACT_APP_API_URL` alone for
local development — it defaults to the json-server below.

CRA only reads env vars at startup, so restart the dev server after editing.

**4. Run both servers**

You need two terminals. The API:

```bash
npm run server   # json-server on http://localhost:8080
```

and the app:

```bash
npm start        # http://localhost:3000
```

**5. Create some accounts**

`db.json` ships with two profiles, but Firebase does not know about them yet. In
**Authentication → Users**, add these two, then sign in:

| Email             | Password | Role     |
| ----------------- | -------- | -------- |
| `admin@gmail.com` | `123456` | Admin    |
| `user@gmail.com`  | `123456` | Customer |

Signing in as the admin drops you on `/admin`. Anyone else lands on the home page.

These are throwaway demo credentials for a public sample repo — don't reuse them
anywhere real.

## Scripts

| Command          | What it does                               |
| ---------------- | ------------------------------------------ |
| `npm start`      | Dev server on port 3000                    |
| `npm run server` | json-server serving `db.json` on port 8080 |
| `npm run build`  | Production build into `build/`             |
| `npm test`       | CRA test runner                            |

## Project layout

```
src/
  01_firebase/     Firebase initialisation
  Components/      Navbar, Footer, route guards
  Pages/
    Admin/         Dashboard, listings, bookings, carts, users
    Flights/       Flight search and cards
    Stay/          Hotel search, filters, pagination
    ThingsTodo/    Destination pages
    CartPage.jsx   The cart
    CheckoutPage.jsx
  Redux/
    AdminFlights/  Admin flight CRUD
    AdminHotel/    Admin hotel CRUD
    Authantication/ Login, register, session
    CartReducer/   Cart and bookings
    StayReducer/   Hotel search and filters
  baseurl.js       Single source of truth for the API host
  cartTotals.js    Price maths shared by cart, checkout, and admin
db.json            The whole dataset
```

## Data

`db.json` is the entire backend. json-server writes changes straight back to the
file, so registering a user or making a booking really does persist.

| Collection    | What's in it                          |
| ------------- | ------------------------------------- |
| `users`       | Profiles, including `is_admin`        |
| `hotel`       | 239 stays                             |
| `flight`      | 22 flights                            |
| `hotelcart`   | Cart rows for stays, keyed by email   |
| `flightcart`  | Cart rows for flights, keyed by email |
| `bookings`    | Completed bookings                    |
| `giftcards`   | Gift card data — no page uses it yet  |
| `Things_todo` | Destination listings                  |

Cart rows carry a `user_email` so one person's cart isn't everyone's, and a
`catalog_id` pointing back at the original listing.

## Deployment

**Local** is the simplest option and is what the steps above describe: run
json-server and the CRA dev server side by side, or `npm run build` and serve the
`build/` folder.

**Cloud** (Vercel, GCP, AWS) needs two extra things:

1. json-server hosted somewhere reachable, with `REACT_APP_API_URL` pointed at it.
   The default is `http://localhost:8080`, which a deployed build cannot reach.
2. `CI=false` on the build command. CRA treats lint warnings as errors when `CI`
   is set, and this codebase still has warnings inherited from upstream.

Add the Firebase env vars to the host's environment settings too, and add the
deployed domain under **Authentication → Settings → Authorized domains**.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Credits

Group 7 — Adrian Thongsavath, Cai Chen, Miray Hirabayashi.

Forked from [kumkumdutta/Expedia-clone](https://github.com/kumkumdutta/Expedia-clone)
by Kumkum Dutta, Ashish, Amit, Sagar Balsaraf, and Sarim.

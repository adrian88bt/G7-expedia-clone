# Contributing

Thanks for taking a look. This is a student project for SE 3290, but it is open
source and outside contributions are welcome.

## Getting set up

The [README](README.md) has the full setup. The short version:

```bash
npm install
cp .env.example .env.local   # then fill in your Firebase values
npm run server               # json-server on :8080
npm start                    # app on :3000
```

You need both servers running. Without json-server the app loads but every list
is empty and sign-in cannot find your profile.

## Before you start on something big

Open an issue first. It saves you building something we were already halfway
through, or something that doesn't fit where the project is heading. Small fixes —
a broken link, a typo, an obvious bug — just send the pull request.

## Branches

Branch off `main`, and name it after what you are doing:

```
feat/cart-quantity-picker
fix/flight-filter-price-range
docs/deployment-steps
```

## Commits

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add a quantity picker to cart lines
fix: stop the price filter hiding hotels above 10000
docs: explain the two-store auth setup
chore: ignore json-server temp files
refactor: pull price maths into cartTotals
```

Write the summary line in the imperative — "add", not "added". If the change needs
explaining, use the body to say *why* it was needed, not what the diff already
shows.

## Pull requests

Keep one PR to one concern. Two unrelated fixes are two PRs, and both get reviewed
faster that way.

In the description, cover:

- what changed and why
- how you tested it — the actual steps, so a reviewer can repeat them
- anything you deliberately left out

Before you open it:

- `npm start` compiles without new warnings
- `npm run build` succeeds
- You clicked through what you touched, with json-server running
- `db.json` only contains changes you meant to make. It is easy to commit rows
  left over from testing — check `git diff db.json` before committing.

## House style

Match the file you are editing. The codebase is inconsistent in places — it grew
out of a fork — and a PR that reformats a file while changing three lines is hard
to review. Fix the formatting in its own commit if it bothers you.

A few things worth knowing:

- **Never hardcode an API host.** Import `BASE_URL` from `src/baseurl.js`. That
  file is the reason a deployed build can point somewhere other than localhost.
- **Price maths goes in `src/cartTotals.js`.** Some values in `db.json` are
  strings and one hotel has no tax field, so the helpers there coerce before
  adding. Do the arithmetic inline and you will eventually concatenate strings.
- **Cart rows are keyed by `user_email`.** Anything you add to a cart needs it, or
  it belongs to nobody and shows up in no one's cart.
- **Strip the `id` before POSTing to a cart.** json-server keeps whatever id you
  hand it, so reusing a catalogue id collides with an existing row and the write
  fails. Keep it as `catalog_id` instead.

## Reporting bugs

Include what you did, what you expected, what happened, and whether json-server
was running. A screenshot of the browser console helps a lot.

## Security

Do not put real credentials in `db.json` or anywhere else in the repo — it is
public. Firebase config values belong in `.env.local`, which is gitignored. The
accounts in `db.json` are throwaway demo logins.

If you find something genuinely sensitive, open an issue asking to be contacted
privately rather than posting the details.

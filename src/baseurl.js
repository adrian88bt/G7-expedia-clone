// Single source of truth for the API host.
//
// Locally this is the json-server started by `npm run server`, which serves
// db.json on port 8080. For a deployed build, set REACT_APP_API_URL to the
// hosted API instead (CRA reads env vars at build time).
export const BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080";

export default BASE_URL;

export type AuthorizedRequest = Request & {
  user: {
    email: string;
    id: string;
    iat: number;
    exp: number;
  };
};

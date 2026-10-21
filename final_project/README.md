# Express Book Review

## Start the service

From this directory, run `npm install` and then `npm start`. The API listens on port 5000 by default. Set `PORT` or `JWT_SECRET` to customize the port or token secret.

## Routes

- `GET /` lists the available books.
- `GET /isbn/:isbn`, `GET /author/:author`, and `GET /title/:title` search the catalog.
- `GET /review/:isbn` returns reviews for a book.
- `POST /register` accepts `{ "username": "reader", "password": "secret" }`.
- `POST /customer/login` accepts the same credentials and returns a bearer token.
- `PUT /customer/auth/review/:isbn` accepts `{ "review": "..." }` and requires `Authorization: Bearer <token>`.
- `DELETE /customer/auth/review/:isbn` removes the signed-in user's review.

The provided book dataset is in `router/booksdb.js`. User accounts and reviews are kept in memory, so they reset when the server restarts.

The exported Axios helpers in `router/general.js` (`getAllBooks`, `getBookByISBN`, `getBooksByAuthor`, and `getBooksByTitle`) call this API. Set `BOOK_API_URL` if the service is hosted elsewhere.

import { ApolloClient, InMemoryCache } from "@apollo/client";

export const clientCSR = new ApolloClient({
  uri: "http://localhost:8080/",
  cache: new InMemoryCache(),
});

export const getClientSSR = () =>
  new ApolloClient({
    uri: "http://back:8080/",
    cache: new InMemoryCache(),
  });

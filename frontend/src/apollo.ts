import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client/core'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { setContext } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

const httpLink = new HttpLink({ uri: 'http://localhost:3200/graphql' })

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const wsLink = new GraphQLWsLink(
  createClient({ url: 'ws://localhost:3200/graphql' }),
)

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  wsLink,
  authLink.concat(httpLink),
)

const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
})

export default apolloClient

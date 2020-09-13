export const microserviceOptions = {
  batch: +process.env.MICROSERVICES_BATCH > 0,
  graphqlApi: +process.env.MICROSERVICES_GRAPHQL > 0
}
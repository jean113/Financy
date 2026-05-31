import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import { ApolloServer } from '@apollo/server'
import { buildSchema } from 'type-graphql'
import { expressMiddleware } from '@as-integrations/express5'
import { AuthResolver } from './resolvers/auth.resolver.js'
import { UsuarioResolver } from './resolvers/usuario.resolver.js'
import { buildContext } from './graphql/context/index.js'
import { CategoriaResolver } from './resolvers/categoria.resolver.js'
import { TransacaoResolver } from './resolvers/transacao.resolver.js'

async function bootstrap() {
  const app = express()

  app.use(cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
  }))

  const schema = await buildSchema({
    resolvers: [
      AuthResolver,
      UsuarioResolver,
      CategoriaResolver,
      TransacaoResolver,
    ],
    validate: false,
    emitSchemaFile: './schema.graphql',
  })

  const server = new ApolloServer({
    schema,
  })

  await server.start()

  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(server, {
      context: buildContext,
    })
  )

  app.listen(
    {
      port: 4000,
    },
    () => {
      console.log(`Servidor iniciado na porta 4000!`)
    }
  )
}

bootstrap()

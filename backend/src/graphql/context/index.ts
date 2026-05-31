import type { ExpressContextFunctionArgument } from '@as-integrations/express5'
import { verifyJwt, type JwtPayload } from '../../utils/jwt.js'

export type GraphqlContext = {
  usuarioId: string | undefined
  token: string | undefined
  req: ExpressContextFunctionArgument['req']
  res: ExpressContextFunctionArgument['res']
}

export const buildContext = async ({
  req,
  res,
}: ExpressContextFunctionArgument): Promise<GraphqlContext> => {
  const authHeader = req.headers.authorization
  let usuarioId: string | undefined
  let token: string | undefined

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring('Bearer '.length)
    try {
      const payload = verifyJwt(token) as JwtPayload
      usuarioId = payload.id
    } catch (error) {}
  }
  return { usuarioId, token, req, res }
}

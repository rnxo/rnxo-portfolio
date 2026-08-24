import { createMiddleware } from '@tanstack/react-start'
import { hasValidSession } from './session.server'

// admin系のcreateServerFnすべてに付与する。beforeLoadによるルートガードは
// UXでしかなく、サーバー関数自体を直接呼ばれた場合の防御にはならないため。
export const authMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    if (!(await hasValidSession())) {
      throw new Error('Unauthorized')
    }
    return next()
  },
)

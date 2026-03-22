/**
 * Helper to add centerId filtering to Prisma queries.
 * 
 * Usage:
 * prisma.class.findMany({ 
 *   where: { 
 *     ...withCenter(session.user.centerId) 
 *   } 
 * })
 */
export function withCenter(centerId: string | null | undefined) {
  if (!centerId) {
    return {}
  }
  return { centerId }
}

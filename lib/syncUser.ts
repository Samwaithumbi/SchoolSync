import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function syncUser() {
  const clerkUser = await currentUser()
  if (!clerkUser) return null

  const email = clerkUser.primaryEmailAddress?.emailAddress
  if (!email) throw new Error("User has no email")

  return prisma.user.upsert({
    where: { id: clerkUser.id },
    update: {
      email,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    },
    create: {
      id: clerkUser.id,
      email,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    }
  })
}
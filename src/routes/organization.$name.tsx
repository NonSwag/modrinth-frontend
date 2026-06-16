import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/organization/$name')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/organization/$name"!</div>
}

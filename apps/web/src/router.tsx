import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  Outlet,
} from "@tanstack/react-router";
import { LandingPage } from "./pages/LandingPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const rootRoute = createRootRoute({
  component: Outlet,
  notFoundComponent: NotFoundPage,
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

// The trial class form and the admin page load on demand: the landing stays light.
const trialClassRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/aula-experimental",
  component: lazyRouteComponent(() => import("./pages/TrialClassPage"), "TrialClassPage"),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: lazyRouteComponent(() => import("./pages/AdminPage"), "AdminPage"),
});

export const router = createRouter({
  routeTree: rootRoute.addChildren([landingRoute, trialClassRoute, adminRoute]),
  defaultPreload: "intent",
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

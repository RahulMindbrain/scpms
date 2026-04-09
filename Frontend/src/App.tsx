import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/reducers/rootReducer";
import RouteOutlet from "./routes/routeOutlet.tsx";
import { ScrollToTop } from "./components/scroll-to-top";
import { PublicRoutes } from "./routes/publicRoutes.ts";
import { PrivateRoutes } from "./routes/privateRoutes.ts";

function App() {
  return (
    <>
      <ScrollToTop />
      <Toaster position="top-right" />

      <Routes>
        {/* Private routes first - when authenticated, these will be matched */}
        <Route element={<RouteOutlet />}>
          <Route>
            {PrivateRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                Component={route.component}
              />
            ))}
          </Route>
        </Route>

        {/* Public routes - only matched if not authenticated or for public-only routes */}
        {PublicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            Component={route.component}
          />
        ))}

        <Route path={"/"} element={<PrivateLoginRedirect />} />
      </Routes>
    </>
  );
}

const PrivateLoginRedirect = () => {
  const { isAuthenticated, userType } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  if (userType?.toLowerCase() === "organization") {
    return <Navigate to="/organization/dashboard" replace />;
  } else if (userType?.toLowerCase() === "student") {
    return <Navigate to="/student/dashboard" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default App;
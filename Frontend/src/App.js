// Import React hooks and components
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

// Import Redux hooks and slices
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthMe, selectIsAuth } from "./redux/slices/auth";

// Import Material-UI components
import Container from "@mui/material/Container";

// Import custom components
import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";

// Define App component
function App() {
  // Initialize Redux hooks
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  // Fetch user authentication status on component mount
  useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  // Render the application layout
  return (
    <>
      {/* Render header */}
      <Header />

      {/* Render main content in a Material-UI container */}
      <Container maxWidth="lg">
        {/* Define application routes */}
        <Routes>
          {/* Home page */}
          <Route path="/" element={<Home />} />

          {/* Full post page */}
          <Route path="/posts/:id" element={<FullPost />} />

          {/* Edit post page */}
          <Route path="/posts/:id/edit" element={<AddPost />} />

          {/* Add post page */}
          <Route path="/add-post" element={<AddPost />} />

          {/* Login page */}
          <Route path="/login" element={<Login />} />

          {/* Registration page */}
          <Route path="/register" element={<Registration />} />
        </Routes>
      </Container>
    </>
  );
}

// Export App component
export default App;

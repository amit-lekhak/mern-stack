import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/Home";
import ProductDetails from "./components/product/ProductDetails";

// Auth or User imports
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import { loadUser } from "./actions/userActions";
import { useEffect, useState } from "react";
import store from "./store";
import Profile from "./components/user/Profile";
import ProtectedRoute from "./components/route/ProtectedRoute";
import UpdateProfile from "./components/user/UpdateProfile";
import UpdatePassword from "./components/user/UpdatePassword";
import ForgotPassword from "./components/user/ForgotPassword";
import NewPassword from "./components/user/NewPassword";

// Cart imports
import Cart from "./components/cart/Cart";
import Shipping from "./components/cart/Shipping";
import ConfirmOrder from "./components/cart/ConfirmOrder";
import axios from "axios";
import Payment from "./components/cart/Payment";
import OrderSuccess from "./components/cart/OrderSuccess";

// Stripe imports
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Order imports
import ListOrders from "./components/order/ListOrders";
import OrderDetails from "./components/order/OrderDetails";

// Admin imports
import Dashboard from "./components/admin/Dashboard";
import ProductsList from "./components/admin/ProductsList";
import NewProduct from "./components/admin/NewProduct";
import { useSelector } from "react-redux";
import UpdateProduct from "./components/admin/UpdateProduct";
import OrdersList from "./components/admin/OrdersList";
import ProcessOrder from "./components/admin/ProcessOrder";
import UsersList from "./components/admin/UsersList";
import UpdateUser from "./components/admin/UpdateUser";
import ProductReviews from "./components/admin/ProductReviews";

function App() {
  const [stripeApiKey, setStripeApiKey] = useState("");

  useEffect(() => {
    store.dispatch(loadUser());

    async function getStripeApiKey() {
      const { data } = await axios.get("/api/v1/stripeapi");
      setStripeApiKey(data.stripeApiKey);
    }

    getStripeApiKey();
  }, []);

  const { user, loading } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          {stripeApiKey && (
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute path="/payment" exact component={Payment} />
            </Elements>
          )}

          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/search/:keyword" exact component={Home} />
            <Route path="/product/:id" exact component={ProductDetails} />

            <Route path="/cart" exact component={Cart} />
            <ProtectedRoute path="/shipping" exact component={Shipping} />
            <ProtectedRoute
              path="/order/confirm"
              exact
              component={ConfirmOrder}
            />

            <ProtectedRoute path="/success" exact component={OrderSuccess} />

            <Route path="/login" component={Login} />
            <Route path="/register" exact component={Register} />
            <Route path="/password/forgot" exact component={ForgotPassword} />
            <Route
              path="/password/reset/:token"
              exact
              component={NewPassword}
            />

            <ProtectedRoute path="/me" exact component={Profile} />
            <ProtectedRoute path="/me/update" exact component={UpdateProfile} />
            <ProtectedRoute
              path="/password/update"
              exact
              component={UpdatePassword}
            />

            <ProtectedRoute path="/orders/me" exact component={ListOrders} />
            <ProtectedRoute path="/order/:id" exact component={OrderDetails} />
          </Switch>
        </div>

        <ProtectedRoute
          path="/dashboard"
          isAdmin={true}
          exact
          component={Dashboard}
        />

        <ProtectedRoute
          path="/admin/products"
          isAdmin={true}
          exact
          component={ProductsList}
        />

        <ProtectedRoute
          path="/admin/product"
          isAdmin={true}
          exact
          component={NewProduct}
        />

        <ProtectedRoute
          path="/admin/product/:id"
          isAdmin={true}
          exact
          component={UpdateProduct}
        />

        <ProtectedRoute
          path="/admin/orders"
          isAdmin={true}
          exact
          component={OrdersList}
        />

        <ProtectedRoute
          path="/admin/order/:id"
          isAdmin={true}
          exact
          component={ProcessOrder}
        />

        <ProtectedRoute
          path="/admin/users"
          isAdmin={true}
          exact
          component={UsersList}
        />

        <ProtectedRoute
          path="/admin/user/:id"
          isAdmin={true}
          exact
          component={UpdateUser}
        />

        <ProtectedRoute
          path="/admin/reviews"
          isAdmin={true}
          exact
          component={ProductReviews}
        />
        {user
          ? !loading && user.role !== "admin" && <Footer />
          : !loading && <Footer />}
      </div>
    </Router>
  );
}

export default App;

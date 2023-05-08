import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function RoleBasedGuard({ children }) {
  let { token } = useParams();
  let [errorMessage, setErrorMessage] = useState("");
  let [loading, setLoading] = useState(false);

  const validateToken = async () => {
    setLoading(true);
    try {
      await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/user/check-expired-token`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrorMessage(error);
      setTimeout(() => {
        Swal.fire(
          {
            icon: "error",
            title: "Oops...",
            text: "Sorry link has been expired",
          },
          500
        );
      });
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  if (loading === false) {
    if (errorMessage) {
      return <Navigate to={"/404"} />;
    } else {
      return <>{children}</>;
    }
  }
}

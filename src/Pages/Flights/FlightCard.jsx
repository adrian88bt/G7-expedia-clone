import { Box, Image, Flex, Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../Redux/CartReducer/cart.action";

export default function FlightCard({ data }) {
  const { id, airline, from, to, departure, arrival, price, totalTime } = data;
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuth = useSelector((store) => store.LoginReducer.isAuth);
  const activeUser = useSelector((store) => store.LoginReducer.activeUser);

  const handleClick = async () => {
    // Cart rows are keyed by email, so there is nowhere to put this yet.
    if (!isAuth) {
      toast({
        title: "Please sign in first",
        description: "You need an account to book a flight.",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      navigate("/login");
      return;
    }

    try {
      await dispatch(addToCart("flight", data, activeUser.email));
      toast({
        title: "Flight added to cart",
        description: "Please proceed to payment.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/cart");
    } catch (err) {
      toast({
        title: "Could not add that flight",
        description: "Is json-server running ?",
        status: "error",
        duration: 7000,
        isClosable: true,
      });
    }
  };

  const Booknow = {
    marginTop: "3%",
    // width:"164px",
    padding: "15px",
    height: "43px",
    background: "teal",
    color: " #FFFFFF",
    bordeRadius: "0.5rem",
    position: "relative",
    marginBottom: "1rem",
  };

  return (
    <Box
      display={"flex"}
      gap="20px"
      key={id}
      height="100px"
      width={"80%"}
      boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
      padding="10px"
      margin="auto"
      justifyContent="space-around"
      alignItems={"center"}
      borderRadius="10px"
      marginBottom={"20px"}
      textAlign="center"
    >
      <Box gap={"30px"}>
        <Image
          src="https://play-lh.googleusercontent.com/OhZSLjRDLvFLqtDp9bIgcvAweZIg5V5uIMI_7kOaS-9nPR043DUfoibkn1BgwG7Ai1U=w240-h480-rw"
          width={"35px"}
          height="30px"
        />
        <h1>{airline}</h1>
      </Box>
      <Flex display={"flex"} flexDirection="column">
        <h3 style={{ fontSize: "10px", fontWeight: "bold" }}>Departure</h3>
        <h3>{departure}</h3>
        <b>{from} </b>
      </Flex>
      <Flex display={"flex"} flexDirection="column">
        <h3 style={{ fontSize: "10px", fontWeight: "bold" }}>Arrival</h3>
        <h3>{arrival}</h3>
        <b style={{ fontSize: "14px" }}>{to} </b>
      </Flex>
      <Flex display={"flex"} flexDirection="column">
        <h3>Duation</h3>
        <b>{totalTime}</b>
      </Flex>
      <Flex display={"flex"} flexDirection="column">
        <h3>Price</h3>
        <b>{price}</b>
      </Flex>
      <Button style={Booknow} onClick={handleClick}>
        Book Now
      </Button>
    </Box>
  );
}

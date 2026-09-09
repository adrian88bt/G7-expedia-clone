import React, { useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Heading,
  Image,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { fetchCart, removeFromCart } from "../Redux/CartReducer/cart.action";
import { cartTotals, formatRupees, lineTotal } from "../cartTotals";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const activeUser = useSelector((store) => store.LoginReducer.activeUser);
  const { hotels, flights, isLoading, isError } = useSelector(
    (store) => store.CartReducer
  );

  useEffect(() => {
    if (activeUser.email) dispatch(fetchCart(activeUser.email));
  }, [dispatch, activeUser.email]);

  const totals = cartTotals(hotels, flights);

  const handleRemove = (kind, id) => {
    dispatch(removeFromCart(kind, id)).catch(() => {
      toast({
        title: "Could not remove that item",
        description: "Is json-server running ?",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    });
  };

  return (
    <Box bg={"gray.100"} minHeight={"700px"} py={6}>
      <Box width={"85%"} margin={"auto"}>
        <Heading fontSize={"26px"} fontWeight={"bold"} textAlign={"left"}>
          Your Cart
        </Heading>
        <Text textAlign={"left"} mb={3}>
          {totals.count === 1 ? "1 item" : `${totals.count} items`} saved for{" "}
          {activeUser.user_name || activeUser.email}
        </Text>

        {isError ? (
          <Box bg={"white"} p={4} textAlign={"left"}>
            <Text>We could not load your cart. Is json-server running ?</Text>
          </Box>
        ) : null}

        {isLoading ? (
          <Box bg={"white"} p={4} textAlign={"left"}>
            <Text>Loading your cart...</Text>
          </Box>
        ) : null}

        {!isLoading && totals.count === 0 ? (
          <Box bg={"white"} p={6} textAlign={"left"}>
            <Heading fontSize={"18px"}>Nothing here yet</Heading>
            <Text mt={2}>
              Add a stay or a flight and it will show up here.
            </Text>
            <Box mt={4} display={"flex"} gap={3}>
              <RouterLink to="/stay">
                <Button bg={"#FF9800"}>Browse stays</Button>
              </RouterLink>
              <RouterLink to="/flight">
                <Button bg={"#FF9800"}>Browse flights</Button>
              </RouterLink>
            </Box>
          </Box>
        ) : null}

        {totals.count > 0 ? (
          <SimpleGrid
            mt={2}
            gridTemplateColumns={{ base: "100%", md: "63% 35%" }}
            gap={"1%"}
          >
            <Box>
              {hotels.map((hotel) => (
                <Box
                  key={`hotel-${hotel.id}`}
                  bg={"white"}
                  p={3}
                  mb={2}
                  textAlign={"left"}
                  display={"flex"}
                  gap={4}
                >
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    width={"140px"}
                    height={"100px"}
                    objectFit={"cover"}
                  />
                  <Box flex={1}>
                    <Heading fontSize={"18px"}>{hotel.name}</Heading>
                    <Text fontSize={"14px"}>{hotel.place}</Text>
                    <Text fontSize={"13px"} color={"gray.600"}>
                      Stay &middot; {formatRupees(hotel.price)} + {formatRupees(hotel.taxes)} taxes
                    </Text>
                  </Box>
                  <Box textAlign={"right"}>
                    <Text fontWeight={"bold"}>{formatRupees(lineTotal(hotel))}</Text>
                    <Button
                      mt={2}
                      size={"sm"}
                      onClick={() => handleRemove("hotel", hotel.id)}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
              ))}

              {flights.map((flight) => (
                <Box
                  key={`flight-${flight.id}`}
                  bg={"white"}
                  p={3}
                  mb={2}
                  textAlign={"left"}
                  display={"flex"}
                  gap={4}
                >
                  <Box flex={1}>
                    <Heading fontSize={"18px"}>
                      {flight.airline} {flight.number}
                    </Heading>
                    <Text fontSize={"14px"}>
                      {flight.from} to {flight.to}
                    </Text>
                    <Text fontSize={"13px"} color={"gray.600"}>
                      Flight &middot; {flight.departure} - {flight.arrival} ({flight.totalTime})
                    </Text>
                  </Box>
                  <Box textAlign={"right"}>
                    <Text fontWeight={"bold"}>{formatRupees(lineTotal(flight))}</Text>
                    <Button
                      mt={2}
                      size={"sm"}
                      onClick={() => handleRemove("flight", flight.id)}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>

            <Box bg={"white"} textAlign={"left"} p={4} height={"fit-content"}>
              <Heading fontSize={"20px"} mb={3}>
                Price Summary
              </Heading>
              <Box justifyContent={"space-between"} display={"flex"}>
                <Box>Subtotal</Box>
                <Box>{formatRupees(totals.subtotal)}</Box>
              </Box>
              <Box justifyContent={"space-between"} display={"flex"}>
                <Box>Taxes</Box>
                <Box>{formatRupees(totals.taxes)}</Box>
              </Box>
              <Divider my={2} />
              <Box
                justifyContent={"space-between"}
                display={"flex"}
                fontWeight={"bold"}
              >
                <Box>Total</Box>
                <Box>{formatRupees(totals.total)}</Box>
              </Box>
              <Button
                mt={4}
                width={"100%"}
                height={"40px"}
                bg={"#FF9800"}
                rounded={"7px"}
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </SimpleGrid>
        ) : null}
      </Box>
    </Box>
  );
};

export default CartPage;

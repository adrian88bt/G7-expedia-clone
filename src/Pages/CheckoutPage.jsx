import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  HStack,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { fetchCart, placeBooking } from "../Redux/CartReducer/cart.action";
import { cartTotals, formatRupees, lineTotal } from "../cartTotals";

// What we store on the booking, so the admin panel has something readable
// without having to reach back into the catalogue.
const describe = (kind, item) =>
  kind === "hotel"
    ? { kind, title: item.name, detail: item.place }
    : {
        kind,
        title: `${item.airline} ${item.number}`,
        detail: `${item.from} to ${item.to}`,
      };

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const activeUser = useSelector((store) => store.LoginReducer.activeUser);
  const { hotels, flights } = useSelector((store) => store.CartReducer);

  const [guest, setGuest] = useState({ name: "", surname: "", mobile: "" });
  const [saving, setSaving] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    if (activeUser.email) dispatch(fetchCart(activeUser.email));
  }, [dispatch, activeUser.email]);

  // Prefill from the signed-in profile, but let the guest type over it.
  useEffect(() => {
    setGuest((current) => ({
      ...current,
      name: current.name || activeUser.user_name || "",
      mobile: current.mobile || activeUser.number || "",
    }));
  }, [activeUser.user_name, activeUser.number]);

  const totals = cartTotals(hotels, flights);

  const handleChange = (e) =>
    setGuest({ ...guest, [e.target.name]: e.target.value });

  const handleBooking = async () => {
    if (!guest.name.trim() || !guest.mobile.trim()) {
      toast({
        title: "We need a name and a mobile number",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setSaving(true);
    const booking = {
      user_email: activeUser.email,
      guest_name: `${guest.name} ${guest.surname}`.trim(),
      guest_mobile: guest.mobile,
      items: [
        ...hotels.map((hotel) => describe("hotel", hotel)),
        ...flights.map((flight) => describe("flight", flight)),
      ],
      subtotal: totals.subtotal,
      taxes: totals.taxes,
      total: totals.total,
      status: "confirmed",
      created_at: new Date().toISOString(),
    };

    try {
      const saved = await dispatch(placeBooking(booking, hotels, flights));
      setConfirmation(saved);
    } catch (err) {
      toast({
        title: "Could not complete the booking",
        description: "Is json-server running ?",
        status: "error",
        duration: 7000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  if (confirmation) {
    return (
      <Box bg={"gray.100"} minHeight={"700px"} py={10}>
        <Box width={"60%"} margin={"auto"} bg={"white"} p={8} textAlign={"left"}>
          <Heading fontSize={"26px"}>You are booked</Heading>
          <Text mt={2}>
            Booking #{confirmation.id} for {confirmation.guest_name}, total{" "}
            {formatRupees(confirmation.total)}.
          </Text>
          <Text mt={2} color={"gray.600"}>
            A confirmation would normally be sent to {confirmation.user_email}.
          </Text>
          <Box mt={5} display={"flex"} gap={3}>
            <RouterLink to="/">
              <Button bg={"#FF9800"}>Back to home</Button>
            </RouterLink>
            <RouterLink to="/stay">
              <Button>Book something else</Button>
            </RouterLink>
          </Box>
        </Box>
      </Box>
    );
  }

  if (totals.count === 0) {
    return (
      <Box bg={"gray.100"} minHeight={"700px"} py={10}>
        <Box width={"60%"} margin={"auto"} bg={"white"} p={8} textAlign={"left"}>
          <Heading fontSize={"22px"}>There is nothing to book</Heading>
          <Text mt={2}>Add a stay or a flight to your cart first.</Text>
          <Box mt={5}>
            <RouterLink to="/cart">
              <Button bg={"#FF9800"}>Go to cart</Button>
            </RouterLink>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box bg={"gray.300"} width={"100%"} minHeight={"1000px"} pb={10}>
      <Box width={"85%"} margin={"auto"}>
        <Heading fontSize={"26px"} fontWeight={"bold"} textAlign={"left"}>
          Review and Book
        </Heading>

        <Box bg={"white"} mt={2} p={3}>
          <HStack>
            <Box>
              <Image
                src="https://i.postimg.cc/mZmMdvzw/Screenshot-2023-04-01-130744.png"
                alt="image"
              />
            </Box>
            <Box>
              <Text textAlign={"left"} fontWeight={"bold"}>
                Fully refundable before your check-in date
              </Text>
              <Text>
                You can change or cancel this trip if plans change. Because
                flexibility matters.
              </Text>
            </Box>
          </HStack>
        </Box>

        <SimpleGrid
          mt={2}
          gridTemplateColumns={{ base: "100%", md: "63% 35%" }}
          gap={"1%"}
        >
          <Box bg={"white"} p={3}>
            <Heading textAlign={"left"} fontSize={"20px"} fontWeight={"bold"}>
              Guest Details
            </Heading>
            <Box>
              <Box textAlign={"left"} my={2}>
                <label>
                  First Name :
                  <Input
                    type="text"
                    name="name"
                    value={guest.name}
                    onChange={handleChange}
                    placeholder="First Name"
                    border="1px solid gray"
                  />
                </label>
              </Box>
              <Box textAlign={"left"} my={2}>
                <label>
                  Surname :
                  <Input
                    type="text"
                    name="surname"
                    value={guest.surname}
                    onChange={handleChange}
                    placeholder="Surname"
                    border="1px solid gray"
                  />
                </label>
              </Box>
              <Box textAlign={"left"} my={2}>
                <label>
                  Mobile No :
                  <Input
                    type="text"
                    name="mobile"
                    value={guest.mobile}
                    onChange={handleChange}
                    placeholder="Mobile No"
                    border="1px solid gray"
                  />
                </label>
              </Box>
            </Box>

            <Heading
              textAlign={"left"}
              fontSize={"20px"}
              fontWeight={"bold"}
              mt={6}
            >
              Payment Method
            </Heading>
            <Text textAlign={"left"} mt={2}>
              {formatRupees(0)} due now. Payment information is only needed to
              hold your reservation.
            </Text>
            <Box display={"flex"} gap={"6px"} mt={2}>
              <Image
                height={"30px"}
                width={"30px"}
                src="https://a.travel-assets.com/dms-svg/payments/cards-cc_american_express.svg"
                alt="image"
              />
              <Image
                height={"30px"}
                width={"30px"}
                src="https://a.travel-assets.com/dms-svg/payments/cards-cc_master_card.svg"
                alt="image"
              />
              <Image
                height={"30px"}
                width={"30px"}
                src="https://a.travel-assets.com/egds/marks/payment__visa.svg"
                alt="image"
              />
              <Image
                height={"30px"}
                width={"30px"}
                src="https://a.travel-assets.com/dms-svg/payments/cards-cc_visa_electron.svg"
                alt="image"
              />
            </Box>
          </Box>

          <Box bg={"white"} textAlign={"left"} p={4} height={"fit-content"}>
            <Heading fontSize={"20px"} mb={3}>
              Price Summary
            </Heading>

            {[
              ...hotels.map((hotel) => ({ kind: "hotel", item: hotel })),
              ...flights.map((flight) => ({ kind: "flight", item: flight })),
            ].map(({ kind, item }) => (
              <Box
                key={`${kind}-${item.id}`}
                justifyContent={"space-between"}
                display={"flex"}
              >
                <Box pr={2}>{describe(kind, item).title}</Box>
                <Box whiteSpace={"nowrap"}>{formatRupees(lineTotal(item))}</Box>
              </Box>
            ))}

            <Divider my={2} />

            <Box justifyContent={"space-between"} display={"flex"}>
              <Box>Subtotal</Box>
              <Box>{formatRupees(totals.subtotal)}</Box>
            </Box>
            <Box justifyContent={"space-between"} display={"flex"}>
              <Box>Taxes</Box>
              <Box>{formatRupees(totals.taxes)}</Box>
            </Box>
            <Box
              justifyContent={"space-between"}
              display={"flex"}
              fontWeight={"bold"}
            >
              <Box>Total</Box>
              <Box>{formatRupees(totals.total)}</Box>
            </Box>
            <Box
              justifyContent={"space-between"}
              display={"flex"}
              color="green.600"
            >
              <Box>Pay Now</Box>
              <Box>{formatRupees(0)}</Box>
            </Box>
            <Box justifyContent={"space-between"} display={"flex"}>
              <Box>Pay at property</Box>
              <Box>{formatRupees(totals.total)}</Box>
            </Box>

            <Button
              mt={4}
              width={"100%"}
              height="40px"
              bg={"#FF9800"}
              rounded={"7px"}
              isLoading={saving}
              loadingText="Booking..."
              onClick={handleBooking}
            >
              Complete Booking
            </Button>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default CheckoutPage;

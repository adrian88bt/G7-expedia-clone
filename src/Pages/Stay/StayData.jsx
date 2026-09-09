import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { DeleteHotel, fetchingHotels } from "../../Redux/StayReducer/action";
import { addToCart } from "../../Redux/CartReducer/cart.action";
import "./StayData.css";
import PriceFilter from "./PriceFilter";
import Sidebar from "./Sidebar";
import Pagination from "./Pagination";

const StayData = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const isAuth = useSelector((store) => store.LoginReducer.isAuth);
  const activeUser = useSelector((store) => store.LoginReducer.activeUser);
  const { data } = useSelector((store) => store.StayReducer);
  const checkInDate = useSelector((state) => state.StayReducer.checkInDate);
  const checkOutDate = useSelector((state) => state.StayReducer.checkOutDate);
  const selectedCity = useSelector((state) => state.StayReducer.selectedCity);
  console.log("city",selectedCity);
  console.log("In", checkInDate);
  console.log("out", checkOutDate);
  // Upper bound covers the priciest hotel in db.json (25000); at 10000 the top
  // 15 were silently filtered out of every page.
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 30000]);
  const [filteredHotel, setFilteredHotel] = useState([]);
  const [price, setPrice] = useState(""); // Define price state variable

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const totalNumOfPages = Math.ceil(244 / 20); 


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleLeft = (id) => {
    dispatch(DeleteHotel(id));
  };

  const handleBook = async (hotel) => {
    // Cart rows are keyed by email, so there is nowhere to put this yet.
    if (!isAuth) {
      toast({
        title: "Please sign in first",
        description: "You need an account to book a stay.",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      navigate("/login");
      return;
    }

    try {
      await dispatch(addToCart("hotel", hotel, activeUser.email));
      toast({
        title: "Stay added to cart",
        description: "Please proceed to payment.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/cart");
    } catch (err) {
      toast({
        title: "Could not add that stay",
        description: "Is json-server running ?",
        status: "error",
        duration: 7000,
        isClosable: true,
      });
    }
  };

  // useEffect(() => {
  //   dispatch(fetchingHotels("","",""));
  // }, [dispatch]);

  useEffect(() => {
    if (data) {
      setFilteredHotel(
        data.filter(
          (hotel) =>
            hotel.price >= selectedPriceRange[0] &&
            hotel.price <= selectedPriceRange[1]
        )
      );
      console.log(filteredHotel);
    }
  }, [data, selectedPriceRange]);

console.log(data)
  return (
    <div className="stay-data">
      
      <div className="sidebar-container">
        <Sidebar/>
      </div>

      {filteredHotel?.map((hotel) => (
        <div className="stay-card" key={hotel.id}>
          <img src={hotel.image} alt="hotel" />

          <div className="stay-info">
            <div className="stay-header">
              <h3 className="stay-name">{hotel.name}</h3>
              <button
                className="stay-left-btn"
                onClick={() => handleLeft(hotel.id)}
              >
                We have 5 left
              </button>
            </div>
            <p className="stay-location">{hotel.location}</p>
            <p className="stay-description">{hotel.description}</p>
            <div className="stay-details">
              <button
                className="stay-book-btn"
                onClick={() => handleBook(hotel)}
              >
                Book Now
              </button>
              <div className="stay-price">
                <span>Price:</span>
                <p>₹{hotel.price.toLocaleString()}</p>
              </div>
              <div className="stay-rating">
                <span>Rating:</span>
                <p>{hotel.rating ? hotel.rating : 1}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div>
      <Pagination
        current={currentPage}
        onChange={handlePageChange}
        total={totalNumOfPages}
      />
      </div>
    </div>
  );
};

export default StayData;
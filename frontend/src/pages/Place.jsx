import { useEffect, useState } from "react";
import PlaceCard from "../components/PlaceCard";
import { useParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import ReviewCard from "../components/ReviewCard";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { Tag, ring } from "@chakra-ui/react";

function formatDate(inputDate) {
  const options = { year: '2-digit', month: 'short' };
  const date = new Date(inputDate);
  return date.toLocaleDateString(undefined, options);
}

function Place() {

  const navigate = useNavigate();
  const { placename } = useParams();
  const [rating, setRating] = useState(0); // Initialize rating state
  const [reviewdata, setReviewData] = useState([]); // Initialize review data state
  const [placeData, setPlaceData] = useState([]);
  const [ratingPrediction, setRatingPrediction] = useState([]);
  const [tag, settag] = useState(["charminar", "friends"])

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/api/placereview/${placename}`)
      .then(response => {
        // Handle the successful response
        const data = response.data;
        console.log(response.data);
        setRating(data.current_place.rating.toFixed(1)); // Set the rating from the API response
        setReviewData(data.reviews); // Set the review data from the API response
        setPlaceData(data.current_place);
      })
      .catch(error => {
        // Handle any errors that occurred during the request
        console.error('Error fetching data:', error);
      });
  }, [placename]);

  return (
    <>
      <div className="navbar">Review Places</div>
      <div className="places-main-content">
        <p className="placeheading">{placename}</p>
        <StarRating rating={rating} />
        {rating} {/* Display the rating */}
        ({placeData.num_reviews}) | 
        Visit with : {placeData.best_company}
        <br/>
        {/* {tag && tag.map((item)=> {
        return <Tag colorScheme='blue' style={{ marginRight: '10px'}}>{item}</Tag>})
        } */}
      </div>
      <div className="main-review-list">
        {reviewdata && reviewdata.map((review, index) => {
          return (
            <ReviewCard
              key={index}
              personname={review[0]} // Assuming the API response has a 'name' field for the reviewer's name
              date={formatDate(review[1])}
              typeofvisit={review[4]}
              review={review[5]} // Assuming the API response has a 'review_text' field for the review content
              rating={review[3]}
              prediction={review[6]}
            />
          );
        })}
      </div>
      <div className="floating-button" onClick={() => { navigate(`/addnewreview/${placename}`) }}>
        <button>+</button>
      </div>
    </>
  );
}

export default Place;
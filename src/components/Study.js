import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Study = () => {
	const [deck, setDeck] = useState([]);
	const [cardsList, setCards] = useState([]);
	const { id } = useParams();
	const [numberOfCards, setNumberOfCards] = useState(0);
	const [numberOfCorrect, setNumberOfCorrect] = useState(0);
	const [accuracy, setAccuracy] = useState(0);
	const [cardIndex, setCardIndex] = useState(0);
	const [displayText, setDisplayText] = useState("");
	const [flip, setFlip] = useState(false);
	const [previous_accuracy, setPreviousAccuracy] = useState(0);
	const [previous_attempt, setPreviousAttempt] = useState(0);
	const [incorrectCards, setIncorrectCards] = useState([]);
	const navigate = useNavigate();

	async function fetchData() {
		try {
			const response = await fetch(
				`http://4.204.242.184:3001/study/view/info/${id}`,
				{
					method: "GET",
					headers: { token: localStorage.token },
				}
			);

			const parseRes = await response.json();
			console.log(parseRes);
			setDeck(parseRes.deck);
			setCards(parseRes.cards);

			setNumberOfCards(parseRes.cards.length);
			setDisplayText(parseRes.cards[0].question);
			setPreviousAccuracy(parseRes.accuracy.accuracy);
			setPreviousAttempt(parseRes.accuracy.attempts);
			console.log("BRO PLEASE");
			console.log(parseRes);
		} catch (err) {
			console.error(err.message);
		}
	}

	useEffect(() => {
		fetchData();
		console.log("123");
	}, []);

	const handleNext = (e) => {
		e.preventDefault();
		// check to see if we are at the end of the deck
		if (cardIndex === numberOfCards - 1) {
			setDisplayText("You have reached the end of the deck.");
			// disable the next button
			document.getElementById("next").disabled = true;
			document.getElementById("answer").disabled = true;
			document.getElementById("previous").disabled = true;
			// set the accuracy to 2 decimal places

			submitFinal();
			// navigate("/end");
		} else {
			setCardIndex(cardIndex + 1);
			setDisplayText(cardsList[cardIndex + 1].question);
		}
	};

	const submitFinal = async () => {
		let new_attempts = previous_attempt + 1;
		let send_accuracy = (
			((cardsList.length - incorrectCards.length) / cardsList.length) *
			100
		).toFixed(2);
		setAccuracy(send_accuracy);
		console.log(accuracy);

		try {
			const body = { send_accuracy, new_attempts };
			const response = await fetch(
				`http://4.204.242.184:3001/study/update/${id}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						token: localStorage.token,
					},
					body: JSON.stringify(body),
				}
			);
			const parseRes = await response.json();
			console.log(parseRes);
		} catch (err) {
			console.error(err.message);
		}
	};

	const onFlip = (e) => {
		e.preventDefault();
		setFlip(!flip);
		if (!flip) {
			setDisplayText(cardsList[cardIndex].answer);
			// display buttons to mark correct or incorrect
			document.getElementById("collapseExample").style.display = "block";
		} else {
			document.getElementById("collapseExample").style.display = "none";
			setDisplayText(cardsList[cardIndex].question);
		}
	};

	const onCorrect = (e) => {
		setNumberOfCorrect(numberOfCorrect + 1);
		e.preventDefault();
	};

	const onIncorrect = (e) => {
		console.log("aman is daddddy");
		e.preventDefault();
		console.log("im gay");
		// add the card object to the incorrectCards array
		let incorrectCard = cardsList[cardIndex];
		let { question, answer } = incorrectCard;
		let card = { question, answer };
		setIncorrectCards((incorrectCards) => [...incorrectCards, card]);

		console.log(incorrectCards);
	};

	return (
		<div>
			<div className="center text-center">
				<div className="card ">
					<div className="card-body">
						<h5 className="card-title">
							{deck.deck_name} - Question {cardIndex + 1}
						</h5>
						<p className="card-text">{displayText}</p>
						<button
							id="previous"
							className="btn btn-link"
							onClick={(e) => {
								handleNext(e);
							}}
							type="button"
						>
							Previous
						</button>
						<button
							id="answer"
							className="btn btn-link"
							type="button"
							onClick={(e) => {
								onFlip(e);
							}}
						>
							Show Answer
						</button>
						<button
							id="next"
							className="btn btn-link"
							onClick={(e) => {
								handleNext(e);
							}}
							type="button"
						>
							Next
						</button>
						<div class="collapse" id="collapseExample">
							<div class="card card-body">
								<button
									className="btn btn-success"
									onClick={(e) => {
										onCorrect(e);
										onFlip(e);
										setNumberOfCorrect(numberOfCorrect + 1);
										handleNext(e);
									}}
								>
									Correct
								</button>
								<button
									className="btn btn-danger"
									onClick={(e) => {
										onIncorrect(e);
										onFlip(e);
										handleNext(e);
									}}
								>
									Incorrect
								</button>
							</div>
						</div>
					</div>
					<div className="card-footer">
						<h5>Number of Cards: {cardsList.length}</h5>
						<h5>Number of Correct: {numberOfCorrect}</h5>
					</div>
				</div>
			</div>
			<div>
				<h1 className="text-center">End of Deck</h1>
				{/* Display Results */}
				<h2>Results for Current Attempt #{previous_attempt + 1}</h2>
				<h3>Accuracy: {accuracy} % </h3>
				<h3>Previous Attempts: {previous_attempt} </h3>
				<h3>Previous Accuracy: {previous_accuracy}% </h3>
				{/* display all cards in incorrectcards array */}
				<h3>Incorrect Cards</h3>
				<ul>
					{incorrectCards.map((card, index) => {
						return (
							<li key={index}>
								<h4>Question: {card.question}</h4>
								<h4>Answer: {card.answer}</h4>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
};

export default Study;

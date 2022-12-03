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

	/**
	 * Get the deck and cards from the database
	 */
	async function fetchData() {
		try {
			const response = await fetch(
				`http://localhost:3001/study/view/info/${id}`,
				{
					method: "GET",
					headers: { token: localStorage.token },
				}
			);

			const parseRes = await response.json();
			setDeck(parseRes.deck);
			setCards(parseRes.cards);

			setNumberOfCards(parseRes.cards.length);
			setDisplayText(parseRes.cards[0].question);
			setPreviousAccuracy(parseRes.accuracy.accuracy);
			setPreviousAttempt(parseRes.accuracy.attempts);
		} catch (err) {
			console.error(err.message);
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	/**
	 * Show the next card
	 * @param {*} e
	 */
	const handleNext = (e) => {
		e.preventDefault();
		// check to see if we are at the end of the deck
		if (cardIndex === numberOfCards - 1) {
			setDisplayText("You have reached the end of the deck.");
			// disable the buttons
			document.getElementById("next").disabled = true;
			document.getElementById("answer").disabled = true;
			document.getElementById("previous").disabled = true;
			submitFinal();
		} else {
			setCardIndex(cardIndex + 1);
			setDisplayText(cardsList[cardIndex + 1].question);
		}
	};

	/**
	 * Show the previous card
	 * @param {*} e
	 */
	const handlePrevious = (e) => {
		e.preventDefault();
		// check to see if we are at the beginning of the deck
		if (cardIndex === 0) {
			setDisplayText("You have reached the beginning of the deck.");
			// disable the buttons
			document.getElementById("next").disabled = true;
			document.getElementById("answer").disabled = true;
			document.getElementById("previous").disabled = true;
		} else {
			setCardIndex(cardIndex - 1);
			setDisplayText(cardsList[cardIndex - 1].question);
		}
	};

	/**
	 * Last card ansswered, submit the results
	 */
	const submitFinal = async () => {
		let new_attempts = previous_attempt + 1;
		let send_accuracy = (
			((cardsList.length - incorrectCards.length) / cardsList.length) *
			100
		).toFixed(2);
		setAccuracy(send_accuracy);

		try {
			const body = { send_accuracy, new_attempts };
			const response = await fetch(
				`http://localhost:3001/study/update/${id}`,
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
		} catch (err) {
			console.error(err.message);
		}

		document.getElementById("results").style.display = "block";
	};

	/**
	 * Flip the card
	 * @param {*} e
	 */
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

	/**
	 * On correct answer, show the next card
	 * @param {*} e
	 */
	const onCorrect = (e) => {
		setNumberOfCorrect(numberOfCorrect + 1);
		e.preventDefault();
	};

	/**
	 * On incorrect answer, show the next card and add to incorrect list
	 * @param {*} e
	 */
	const onIncorrect = (e) => {
		e.preventDefault();
		// add the card object to the incorrectCards array
		let incorrectCard = cardsList[cardIndex];
		let { question, answer } = incorrectCard;
		let card = { question, answer };
		setIncorrectCards((incorrectCards) => [...incorrectCards, card]);
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
								handlePrevious(e);
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
			<div id="results" class="collapse text-center mt-3">
				<h4>Results for Current Attempt #{previous_attempt + 1}</h4>
				<h5>Accuracy: {accuracy} % </h5>
				<h5>Previous Attempts: {previous_attempt} </h5>
				<h5>Previous Accuracy: {previous_accuracy}% </h5>
				<h5 className="text-center">Incorrect Cards</h5>
				<table className="table mt-3">
					<thead>
						<tr>
							<th>Question</th>
							<th>Answer</th>
						</tr>
					</thead>
					<tbody>
						{incorrectCards.map((card, index) => {
							return (
								<tr key={index}>
									<td>{card.question}</td>
									<td>{card.answer}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Study;

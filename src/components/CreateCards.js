import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

/**
 *
 * @param {*} param0
 * @returns
 */
const CreateCards = ({ setAuth }) => {
	const [name, setName] = useState("");
	const [inputs, setInputs] = useState({
		question: "",
		answer: "",
	});
	const [successMessage, setSuccessMessage] = useState("");
	const state = useLocation().state;
	const deck_id = state.deck_id;
	const { question, answer } = inputs;

	/**
	 * Clear the form after a card is created
	 */
	const clearForm = () => {
		setInputs({
			question: "",
			answer: "",
		});
	};

	/**
	 * Submit the form to create a new card
	 * @param {*} e
	 */
	const onSubmitForm = async (e) => {
		e.preventDefault();
		try {
			const body = { question, answer, deck_id };

			const response = await fetch(
				"http://4.204.242.184:3001/create/cards",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						token: localStorage.token,
					},
					body: JSON.stringify(body),
				}
			);

			const parseRes = await response.json();
			if (parseRes) {
				setSuccessMessage("Card created successfully");
			} else {
				setSuccessMessage("Card creation failed");
			}

			clearForm();
		} catch (err) {
			console.error(err.message + "From CreateCards.js");
			setAuth(false);
		}
	};

	/**
	 * Set state for the inputs
	 * @param {*} e
	 */
	const onChange = (e) => {
		setInputs({ ...inputs, [e.target.id]: e.target.value });
	};

	return (
		<div>
			<h1 className="text-center">Create Cards</h1>
			<form onSubmit={onSubmitForm}>
				<div className="form-group mb-3">
					<input
						type="text"
						className="form-control"
						id="question"
						placeholder="Question"
						value={question}
						onChange={(e) => onChange(e)}
						required={true}
					/>
				</div>
				<div className="form-group">
					<input
						type="text"
						className="form-control"
						id="answer"
						placeholder="Answer"
						value={answer}
						onChange={(e) => onChange(e)}
						required={true}
					/>
				</div>
				{/* Small text that indicates success message */}
				<small id="emailHelp" className="form-text text-muted">
					{successMessage}
				</small>

				<div className="col-md-12 text-center mb-3">
					<button type="submit" className="btn btn-primary m-3">
						Submit Card
					</button>
					<Link to="/Dashboard">
						<button className="btn btn-primary m-3">
							Back to Dashboard
						</button>
					</Link>
				</div>
			</form>
		</div>
	);
};

export default CreateCards;

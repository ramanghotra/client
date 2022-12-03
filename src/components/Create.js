/**
 * Create a deck of flash cards
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Create = ({ setAuth }) => {
	const navigate = useNavigate();

	const [name, setName] = useState("");
	const [inputs, setInputs] = useState({
		deckName: "",
		deckDescription: "",
		courseInfo: "",
	});

	// Destucture the inputs object
	const { deckName, deckDescription, courseInfo } = inputs;

	/**
	 * Submit the form to create a new deck
	 * @param {*} e
	 */
	const onSubmitForm = async (e) => {
		e.preventDefault();
		try {
			const body = { deckName, deckDescription, courseInfo };
			const response = await fetch("http://localhost:3001/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					token: localStorage.token,
				},
				body: JSON.stringify(body),
			});

			const parseRes = await response.json();
			localStorage.setItem("deck_id", parseRes.deck_id);
			navigate("/create/cards", { state: { deck_id: parseRes.deck_id } });
		} catch (err) {
			console.error(err.message + "From Create.js");
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
			<h1 className="text-center">Create a Deck</h1>
			<form onSubmit={onSubmitForm}>
				<div className="form-group mb-3">
					<input
						type="text"
						className="form-control"
						id="deckName"
						placeholder="Enter Deck Name"
						defaultValue={deckName}
						onChange={(e) => onChange(e)}
						required={true}
					/>
				</div>
				<div className="form-group mb-3">
					<textarea
						className="form-control"
						placeholder="Enter Deck Description"
						id="deckDescription"
						rows="3"
						defaultValue={deckDescription}
						onChange={(e) => onChange(e)}
						required={true}
					></textarea>
				</div>
				<div className="form-group mb-3">
					<textarea
						className="form-control"
						placeholder="Enter Course Information"
						id="courseInfo"
						rows="3"
						defaultValue={courseInfo}
						onChange={(e) => onChange(e)}
						required={true}
					></textarea>
				</div>

				<div className="col-md-12 text-center">
					<button type="submit" className="btn btn-primary">
						Create Flash Cards
					</button>
				</div>
			</form>
		</div>
	);
};

export default Create;

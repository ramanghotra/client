import React, { Fragment, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const CreateCards = ({ setAuth }) => {
	const [name, setName] = useState("");
	const [inputs, setInputs] = useState({
		deckName: "",
		deckDescription: "",
		courseInfo: "",
	});

    const state = useLocation().state

    console.log("State", state.state.deck_id)

	const { deckName, deckDescription, courseInfo } = inputs;

	console.log("CreateCards.js");

	const onSubmitForm = async (e) => {
		e.preventDefault();
		try {
			const body = { deckName, deckDescription, courseInfo };
			const response = await fetch("http://localhost:3001/create/cards", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					token: localStorage.token,
				},
				body: JSON.stringify(body),
			});

			const parseRes = await response.json();
            console.log(123123)
            console.log(parseRes.deck_id);
            console.log(123123)
			
		} catch (err) {
			console.error(err.message + "From Create.js");
			setAuth(false);
		}
	};

	const onChange = (e) => {
		setInputs({ ...inputs, [e.target.id]: e.target.value });
	};

	return (
		<div>
			<h1 className="text-center">Create Cards</h1>
			<form onSubmit={onSubmitForm}>
				<div className="form-group">
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
				<div className="form-group">
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
				<div className="form-group">
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

export default CreateCards;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Deck from "./Deck";
const Search = () => {
	const searchTerm = useParams();
	const [decks, setDecks] = useState([]);

	/**
	 * Fetch the decks from the server
	 */
	async function fetchData() {
		try {
			const response = await fetch(
				`http://localhost:3001/search/decks/${searchTerm.id}`,
				{
					method: "GET",
					headers: { token: localStorage.token },
				}
			);
			const parseRes = await response.json();
			setDecks(parseRes);
			console.log("ParseRes", parseRes);
			console.log(decks);
		} catch (err) {
			console.error(err.message);
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div>
			<div>
				<h1 className="text-center">Search Results</h1>
			</div>
			<div>
				{decks.length > 0 ? (
					<Deck decks={decks} />
				) : (
					console.log("no decks")
				)}
			</div>
		</div>
	);
};

export default Search;

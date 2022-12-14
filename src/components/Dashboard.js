import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Deck from "./Deck";
const Dashboard = ({ setAuth }) => {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [decks, setDecks] = useState([]);
	const [message, setMessage] = useState("");

	/**
	 * Fetch the decks from the server
	 */
	async function fetchData() {
		try {
			const response = await fetch(
				"http://4.204.242.184:3001/dashboard/",
				{
					method: "GET",
					headers: { token: localStorage.token },
				}
			);
			const parseRes = await response.json();
			setMessage(parseRes.message.message);
			setDecks(parseRes.decks);
			setName(parseRes.user);
		} catch (err) {
			if (err.response.status === 401) {
				localStorage.removeItem("token");
				setAuth(false);
				navigate("/login");
			}
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div>
			<div>
				<h1 className="text-center">Dashboard</h1>
				<h2>Hello, {name.user_firstname}</h2>
				<h5>Todays Message from the Flash Buddy team: {message}</h5>
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

export default Dashboard;

import React, { Fragment, useState, useEffect } from "react";
import NavBar from "./NavBar";

import Deck from "./Deck";
const Dashboard = ({ setAuth }) => {
	const [name, setName] = useState("");
	const [decks, setDecks] = useState([]);
	console.log("Dashboard.js");
	async function fetchData() {
		try {
			const response = await fetch("http://localhost:3001/dashboard/", {
				method: "GET",
				headers: { token: localStorage.token },
			});
			const parseRes = await response.json();
			console.log("*** parseRes ***");
			console.log(parseRes);
			console.log("*** parseRes ***");
			setDecks(parseRes.decks);
			setName(parseRes.user);
		} catch (err) {
			console.log(err?.response.status);
			console.error(err.message);
			if (err.response.status === 401) {
				localStorage.removeItem("token");
				setAuth(false);
				window.location = "/";
			}
		}
	}

	// const logout = (e) => {
	// 	e.preventDefault();
	// 	localStorage.removeItem("token");
	// 	setAuth(false);
	// 	window.location = "/";
	// 	console.log("logout clicked");
	// };

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div>
			<div>
				<h1 className="text-center">Dashboard</h1>
				<h2>Hello, {name.user_firstname}</h2>
			</div>
			<div>
				{decks.length > 0 ? (
					<Deck decks={decks} />
				) : (
					console.log("no decks")
				)}
			</div>
{/* 
			<button className="btn btn-primary" onClick={(e) => logout(e)}>
				Logout
			</button> */}
		</div>
	);
};

export default Dashboard;

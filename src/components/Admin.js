import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Admin = ({ setAuth }) => {
	const [name, setName] = useState("");
	const [decks, setDecks] = useState([]);
	const [users, setUsers] = useState([]);
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	const updateDecks = (deck_id) => {
		setDecks((prevDecks) => {
			return prevDecks.filter((deck) => deck.deck_id !== deck_id);
		});
	};

	const updateUsers = (user_id) => {
		setUsers((prevUsers) => {
			return prevUsers.filter((user) => user.user_id !== user_id);
		});
	};

	async function fetchData() {
		console.log("fetchData");
		try {
			const response = await fetch(
				"http://4.204.242.184:3001/profile/admin",
				{
					method: "GET",
					headers: { token: localStorage.token },
				}
			);
			const parseRes = await response.json();
			setDecks(parseRes.decks);
			setName(parseRes.user);
			setUsers(parseRes.users);

			console.log("ParseRes", parseRes);
		} catch (err) {
			if (err.response.status === 401) {
				localStorage.removeItem("token");
				setAuth(false);
				navigate("/login");
			}
		}
	}

	const onDeleteButton = async (e, deck_id) => {
		try {
			const body = { deck_id };
			console.log("Body", body);

			const response = await fetch(
				"http://4.204.242.184:3001/profile/admin/delete/deck",
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						token: localStorage.token,
					},
					body: JSON.stringify(body),
				}
			);

			const parseRes = await response.json();
			console.log("ParseRes", parseRes);
		} catch (err) {
			console.error(err.message + "From ProfileDeck.js");
		}

		updateDecks(deck_id);
	};

	const onDeleteUser = async (e, user_id) => {
		try {
			const body = { user_id };
			console.log("Body", body);

			const response = await fetch(
				"http://4.204.242.184:3001/profile/delete/user",
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						token: localStorage.token,
					},
					body: JSON.stringify(body),
				}
			);

			const parseRes = await response.json();
			console.log("ParseRes", parseRes);

			updateUsers(user_id);
		} catch (err) {
			console.error(err.message + "From ProfileDeck.js");
		}
	};

	const onMessageButton = async () => {
		// send post request to banner table
		try {
			const body = { message };
			const response = await fetch(
				"http://4.204.242.184:3001/profile/admin/banner",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						token: localStorage.token,
					},
					body: JSON.stringify(body),
				}
			);
		} catch (err) {
			console.error(err.message + "From ProfileDeck.js");
		}

		// redirect to home page
		navigate("/dashboard");
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div className="mt-3">
			<div className="mt-3">
				<h1 className="text-center">Admin Console</h1>
			</div>

			{/* Create a small form that intakes a message to be displayed  */}
			<div>
				<h2>Message of the Day</h2>
				<form className="form">
					<div className="form-group">
						<input
							type="text"
							placeholder="Update Message"
							onChange={(e) => setMessage(e.target.value)}
						/>
						<button
							className="btn btn-warning"
							onClick={(e) => {
								e.preventDefault();
								onMessageButton();
							}}
						>
							Submit
						</button>
					</div>
				</form>
			</div>

			<div className="col-xs-6">
				<h2 className="text-center">Decks</h2>
				<table className="table text-center table-hover">
					<thead>
						<tr>
							<th scope="col">Deck Name</th>
							<th scope="col">Deck Description</th>
							<th scope="col">Deck Owner</th>
							<th scope="col">Delete Deck</th>
						</tr>
					</thead>
					<tbody>
						{decks.map((deck) => (
							<tr key={deck.deck_id}>
								<td>{deck.deck_name}</td>
								<td>{deck.deck_description}</td>
								<td>{deck.user}</td>
								<td>
									<button
										className="btn btn-danger"
										onClick={(e) => {
											onDeleteButton(e, deck.deck_id);
										}}
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="col-xs-6">
				<h2 className="text-center">Users</h2>
				<table className="table text-center table-hover">
					<thead>
						<tr>
							<th scope="col">User Name</th>
							<th scope="col">User Email</th>
							<th scope="col">User Role</th>
							<th scope="col">Delete User</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user.user_id}>
								<td>
									{user.user_firstname +
										" " +
										user.user_lastname}
								</td>
								<td>{user.user_email}</td>
								<td>{user.user_role}</td>
								<td>
									<button
										className="btn btn-danger"
										onClick={(e) => {
											onDeleteUser(e, user.user_id);
										}}
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Admin;

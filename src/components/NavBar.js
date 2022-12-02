// import useState
import React, { useState } from "react";
const NavBar = ({ setAuth, text }) => {
	const [search, setSearch] = useState("");
	const logout = (e) => {
		e.preventDefault();
		localStorage.removeItem("token");

		setAuth(false);
		console.log("logout clicked");
	};

	/**
	 * fetch the search results from the server
	 * @param {*} e 
	 */
	const fetchData = async (e) => {
		e.preventDefault();
		window.location = `/search/decks/${search}`;
	};

	return (
		<nav class="navbar navbar-expand-lg navbar-light bg-light">
			<div class="container-fluid">
				<a class="navbar-brand" href="#">
					Flash Buddy!
				</a>
				<button
					class="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarSupportedContent"
					aria-controls="navbarSupportedContent"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span class="navbar-toggler-icon"></span>
				</button>
				<div
					class="collapse navbar-collapse"
					id="navbarSupportedContent"
				>
					<ul class="navbar-nav me-auto mb-2 mb-lg-0">
						<li class="nav-item">
							<a
								class="nav-link active"
								aria-current="page"
								href="/dashboard"
							>
								Dashboard
							</a>
						</li>
						<li class="nav-item">
							<a
								class="nav-link active"
								aria-current="page"
								href="/create"
							>
								Create
							</a>
						</li>
						<li class="nav-item">
							<a
								class="nav-link active"
								aria-current="page"
								href="/profile"
							>
								My Account
							</a>
						</li>
						<li class="nav-item">
							<button
								class="btn btn-outline-success"
								type="submit"
								onClick={(e) => logout(e)}
							>
								Login/Logout
							</button>
						</li>
					</ul>
					<form class="d-flex">
						<input
							class="form-control me-2"
							type="search"
							placeholder="Search"
							aria-label="Search"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<button
							class="btn btn-outline-success"
							type="button"
							onClick={(e) => fetchData(e)}
						>
							Search
						</button>
					</form>
				</div>
			</div>
		</nav>
	);
};

export default NavBar;

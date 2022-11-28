import React from "react";

const Deck = ({ decks }) => {
	// for each deck, render a card with deck_name and deck_description

	return (
		<div className="row">
			{decks.map((deck) => {
				return (
					<div className="col-sm-4">
						<div className="card mb-1">
							<div className="card-body">
								<h5 className="card-title ">
									{deck.deck_name}
								</h5>
								<p className="card-text">
									{deck.deck_description}
								</p>
								<a href="#" class="btn btn-primary">
									// Go somewhere //
								</a>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default Deck;

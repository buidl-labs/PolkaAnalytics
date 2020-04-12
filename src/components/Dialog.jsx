import React, { Component } from 'react';


	class Dialog extends Component{
		state = {
			isopen: false
		}
		render() {
			return(
				<div className="App">
					<button onClick={(e) => this.setState({ isOpen: true })}>Preferences</button>

					
				<Dialog isOpen={this.state.isOpen} onClose={(e) => this.setState({ isOpen: false })}>
				lorem ipsum
				 difoas
				 kafehkfsjsfsgsdhgfkhsagfahk
				
				
				</Dialog>
			</div>
			);
		}
	}


export default Dialog;
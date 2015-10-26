import React from "react";
import ReactDOM from "react-dom";

export default class ColorComponent extends React.Component {
	constructor(){
		super();
	}

	render(){
		let style = {
			backgroundColor: this.props.color
		};

		return (
			<div className={ this.props.className } style={ style } onClick={ this.props.onClick }>
				<div className="label">{ this.props.name }</div>
			</div>
		);
	}
}

ColorComponent.defaultProps = {
	onClick: "",
	className: "",
	color: "",
	name: ""
};

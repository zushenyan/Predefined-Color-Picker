import React from "react";
import ReactDOM from "react-dom";
import ActionConstants from "../../../action/ActionConstants";
import ColorComponent from "./ColorComponent";

export default class MainComponent extends React.Component {
	constructor(){
		super();
		this.state = {
			paletteColors: [],
			selectorColors: [],
			lastSelectedColorIndex: -1
		};
		this._updateToken = this._update.bind(this);
	}

	componentWillMount(){
		this.props.store.addListener(ActionConstants.SET_PALETTE_COLORS, this._updateToken);
		this.props.store.addListener(ActionConstants.SET_SELECTOR_COLORS, this._updateToken);
		this.props.store.addListener(ActionConstants.CHANGE_PALETTE_COLOR, this._updateToken);
		this._update();
	}

	componentWillUnmount(){
		this.props.store.removeListener(ActionConstants.SET_PALETTE_COLORS, this._updateToken);
		this.props.store.removeListener(ActionConstants.SET_SELECTOR_COLORS, this._updateToken);
		this.props.store.removeListener(ActionConstants.CHANGE_PALETTE_COLOR, this._updateToken);
	}

	render(){
		let paletteComponents = this._createColorComponenets(this.state.paletteColors, "palette");
		let selectorComponents = this._createColorComponenets(this.state.selectorColors, "selector");

		return (
			<div className="pcp">
				<div className="pcp-palette">{ paletteComponents }</div>
				<div className="pcp-selector">{ selectorComponents }</div>
			</div>
		);
	}

	_createColorComponenets(colors, option){
		let list = [];
		let color, name, onClick;
		for(let i = 0, className = "pcp-color"; i < colors.length; i++, className = "pcp-color"){
			color = colors[i].color;
			name = colors[i].name;
			onClick = option === "palette" ? this._handlePaletteColorClick.bind(this, i) : this._handleSelectorColorClick.bind(this, i);
			className += (color === "") ? " pcp-bg-none" : "";
			className += (this.state.lastSelectedColorIndex === i && option === "palette") ? " pcp-selected" : "";
			list.push(<ColorComponent
				key={i}
				onClick={onClick}
				className={className}
				color={color}
				name={name}
				/>
			);
		}
		return list;
	}

	_handlePaletteColorClick(index, e){
		let selectedIndex = index;
		if(index === this.state.lastSelectedColorIndex){
			selectedIndex = -1;
		}
		else{
			selectedIndex = index;
		}
		this.setState({
			lastSelectedColorIndex: selectedIndex
		});
	}

	_handleSelectorColorClick(index, e){
		if(this.state.lastSelectedColorIndex < 0){
			return;
		}
		let color = this.props.store.getSelectorColors()[index].color;
		let name = this.props.store.getPaletteColors()[this.state.lastSelectedColorIndex].name;
		this.props.actionCreator[ActionConstants.CHANGE_PALETTE_COLOR](
			{index: this.state.lastSelectedColorIndex,
				newColor: {color: color, name: name}
			}
		);
	}

	_update(){
		this.setState({
			paletteColors: this.props.store.getPaletteColors(),
			selectorColors: this.props.store.getSelectorColors()
		});
	}
}

MainComponent.defaultProps = {
	actionCreator: null,
	store: null
};
